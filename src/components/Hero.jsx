import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function useCounter(target, shouldStart) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    const duration = 2000;
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(update);
      else setCount(target);
    };
    requestAnimationFrame(update);
  }, [target, shouldStart]);
  return count;
}

function GlobeCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2.55;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    function syncSize() {
      const W = container.clientWidth;
      const H = container.clientHeight;
      if (!W || !H) return;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
    }
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(container);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner sphere
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.99, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x0a3d3d, transparent: true, opacity: 0.15 })
    ));
    // Wireframe
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 40, 20),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.004, wireframe: true })
    ));
    // Atmosphere
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.04, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x55e8c8, transparent: true, opacity: 0.04, side: THREE.BackSide })
    ));

    function ll2v(lat, lng, r) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    // Instant dots
    const instantPos = [];
    for (let i = 0; i < 4000; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      instantPos.push(1.01 * Math.sin(phi) * Math.cos(theta), 1.01 * Math.cos(phi), 1.01 * Math.sin(phi) * Math.sin(theta));
    }
    const instantGeo = new THREE.BufferGeometry();
    instantGeo.setAttribute('position', new THREE.Float32BufferAttribute(instantPos, 3));
    const instantDots = new THREE.Points(instantGeo,
      new THREE.PointsMaterial({ color: 0xc8ede6, size: 0.009, transparent: true, opacity: 0.75, sizeAttenuation: true })
    );
    globeGroup.add(instantDots);

    // Replace with real country data when loaded
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => {
        const countries = topojson.feature(world, world.objects.countries);
        const positions = [];
        countries.features.forEach(f => {
          if (!f.geometry) return;
          const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
          polys.forEach(poly => poly.forEach(ring => ring.forEach(([lng, lat]) => {
            const v = ll2v(lat, lng, 1.01);
            positions.push(v.x, v.y, v.z);
          })));
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        globeGroup.remove(instantDots);
        globeGroup.add(new THREE.Points(geo,
          new THREE.PointsMaterial({ color: 0xc8ede6, size: 0.009, transparent: true, opacity: 0.75, sizeAttenuation: true })
        ));
      })
      .catch(() => {});

    const arcDefs = [
      [37.77, -122.42, 51.51, -0.13],
      [40.71, -74.01, 35.68, 139.65],
      [28.61, 77.21, -33.87, 151.21],
      [48.86, 2.35, 1.35, 103.82],
      [-23.55, -46.63, 55.76, 37.62],
      [19.43, -99.13, 31.23, 121.47],
      [1.35, 103.82, 37.77, -122.42],
      [51.51, -0.13, -23.55, -46.63],
    ];

    const TRAIL_LEN = 20;
    const ARC_PTS = 80;
    const arcMeshes = arcDefs.map((d, i) => {
      const start = ll2v(d[0], d[1], 1.01);
      const end = ll2v(d[2], d[3], 1.01);
      const mid = start.clone().add(end).normalize().multiplyScalar(1.85);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(ARC_PTS));
      lineGeo.setDrawRange(0, 0);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0.55 })
      );
      globeGroup.add(line);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.010, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0 })
      );
      globeGroup.add(dot);
      return { line, dot, curve, phase: i / arcDefs.length, speed: 0.003 + Math.random() * 0.002 };
    });

    const seen = new Set();
    arcDefs.forEach(d => {
      [[d[0], d[1]], [d[2], d[3]]].forEach(([lat, lng]) => {
        const key = lat.toFixed(1) + ',' + lng.toFixed(1);
        if (seen.has(key)) return;
        seen.add(key);
        const p = ll2v(lat, lng, 1.015);
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.014, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
        );
        core.position.copy(p);
        globeGroup.add(core);
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.028, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x55e8c8, transparent: true, opacity: 0.2 })
        );
        halo.position.copy(p);
        globeGroup.add(halo);
      });
    });

    let dragging = false, px = 0, py = 0, vx = 0, vy = 0.0016;
    const onMouseDown = e => { dragging = true; px = e.clientX; py = e.clientY; };
    const onMouseMove = e => { if (!dragging) return; vy = (e.clientX - px) * 0.004; vx = (e.clientY - py) * 0.004; px = e.clientX; py = e.clientY; };
    const onMouseUp = () => { dragging = false; };
    const onTouchStart = e => { dragging = true; px = e.touches[0].clientX; py = e.touches[0].clientY; };
    const onTouchMove = e => { if (!dragging) return; vy = (e.touches[0].clientX - px) * 0.004; vx = (e.touches[0].clientY - py) * 0.004; px = e.touches[0].clientX; py = e.touches[0].clientY; };
    const onTouchEnd = () => { dragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!dragging) {
        globeGroup.rotation.y += 0.003;
        vx *= 0.92; vy *= 0.92;
      } else {
        globeGroup.rotation.y += vy;
        globeGroup.rotation.x = Math.max(-0.6, Math.min(0.6, globeGroup.rotation.x + vx));
      }
      arcMeshes.forEach(arc => {
        arc.phase = (arc.phase + arc.speed) % 1;
        const t = arc.phase;
        const head = Math.floor(t * ARC_PTS);
        const tail = Math.max(0, head - TRAIL_LEN);
        arc.line.geometry.setDrawRange(tail, head - tail);
        arc.dot.position.copy(arc.curve.getPoint(t));
        const env = t < 0.05 ? t / 0.05 : t > 0.92 ? (1 - t) / 0.08 : 1.0;
        arc.dot.material.opacity = env * 1.0;
        arc.line.material.opacity = env * 0.55;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} id="globeContainer" />;
}

export default function Hero() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const c1 = useCounter(50, statsVisible);
  const c2 = useCounter(500, statsVisible);
  const c3 = useCounter(10, statsVisible);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-glow" />
      <div className="hero-inner">
        <div className="hero-globe-wrap">
          <GlobeCanvas />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Powered Innovation
          </div>
          <h1 className="hero-title">
            Building <span className="gradient-text">AI-Powered</span> Products, Data Platforms, and the Next Generation of Engineers
          </h1>
          <p className="hero-sub">
            Meptrasoft AI Technologies is an AI-driven technology startup focused on building intelligent SaaS products, advanced data platforms, and AI-powered solutions. Alongside product innovation, we train and mentor future engineers through real-world internships, industry-focused training, and placement preparation.
          </p>
          <div className="hero-buttons">
            <a href="#products" className="btn-primary" onClick={(e) => handleAnchorClick(e, '#products')}>
              <span>Explore Products</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
            <a href="#internship" className="btn-secondary" onClick={(e) => handleAnchorClick(e, '#internship')}>
              <span>Join Internship</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
          <div className="hero-stats" ref={statsRef}>
            <div className="stat">
              <span className="stat-number">{c1}</span><span className="stat-plus">+</span>
              <span className="stat-label">AI Models Deployed</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">{c2}</span><span className="stat-plus">+</span>
              <span className="stat-label">Engineers Trained</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">{c3}</span><span className="stat-plus">+</span>
              <span className="stat-label">SaaS Products</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
