import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as topojson from 'topojson-client';

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
    camera.position.z = 2.35;

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

    // Inner sphere — very subtle, blends with hero
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.99, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x0b3535, transparent: true, opacity: 0.35 })
    ));
    // Wireframe
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 40, 20),
      new THREE.MeshBasicMaterial({ color: 0x22b8a0, transparent: true, opacity: 0.06, wireframe: true })
    ));
    // Atmosphere
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x00b4ae, transparent: true, opacity: 0.08, side: THREE.BackSide })
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
        globeGroup.add(new THREE.Points(geo,
          new THREE.PointsMaterial({ color: 0x55e8c8, size: 0.007, transparent: true, opacity: 0.75, sizeAttenuation: true })
        ));
      })
      .catch(() => {
        const pos = [];
        for (let i = 0; i < 3000; i++) {
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          pos.push(1.01 * Math.sin(phi) * Math.cos(theta), 1.01 * Math.cos(phi), 1.01 * Math.sin(phi) * Math.sin(theta));
        }
        const fg = new THREE.BufferGeometry();
        fg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        globeGroup.add(new THREE.Points(fg,
          new THREE.PointsMaterial({ color: 0x55e8c8, size: 0.007, transparent: true, opacity: 0.6 })
        ));
      });

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

    const arcMeshes = arcDefs.map((d, i) => {
      const start = ll2v(d[0], d[1], 1.01);
      const end = ll2v(d[2], d[3], 1.01);
      const mid = start.clone().add(end).normalize().multiplyScalar(1.45);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(80)),
        new THREE.LineBasicMaterial({ color: 0xe8744a, transparent: true, opacity: 0 })
      );
      globeGroup.add(line);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xe8744a, transparent: true, opacity: 0 })
      );
      globeGroup.add(dot);
      return { line, dot, curve, phase: i / arcDefs.length, speed: 0.0018 + Math.random() * 0.0014 };
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
        globeGroup.rotation.y += 0.001;
        vx *= 0.92; vy *= 0.92;
      } else {
        globeGroup.rotation.y += vy;
        globeGroup.rotation.x = Math.max(-0.6, Math.min(0.6, globeGroup.rotation.x + vx));
      }
      arcMeshes.forEach(arc => {
        arc.phase = (arc.phase + arc.speed) % 1;
        const t = arc.phase;
        const env = t < 0.12 ? t / 0.12 : t > 0.88 ? (1 - t) / 0.12 : 1.0;
        arc.line.material.opacity = env * 0.5;
        arc.dot.position.copy(arc.curve.getPoint(t));
        arc.dot.material.opacity = env * 0.9;
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
      {/* Wakeo layout: Globe LEFT, Content RIGHT */}
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#internship" className="btn-secondary" onClick={(e) => handleAnchorClick(e, '#internship')}>
              <span>Join Internship</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
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
