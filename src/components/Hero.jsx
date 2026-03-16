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

    let W = container.offsetWidth || 560;
    let H = container.offsetHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 2.55;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.99, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x040e1a, transparent: true, opacity: 0.92 })
    ));
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 28, 14),
      new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.035, wireframe: true })
    ));
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.14, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x00b4ae, transparent: true, opacity: 0.055, side: THREE.BackSide })
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
          new THREE.PointsMaterial({ color: 0x00d4aa, size: 0.008, transparent: true, opacity: 0.85, sizeAttenuation: true })
        ));
      })
      .catch(() => {
        const pos = [];
        for (let i = 0; i < 3000; i++) {
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const r = 1.01;
          pos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
        }
        const fg = new THREE.BufferGeometry();
        fg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        globeGroup.add(new THREE.Points(fg,
          new THREE.PointsMaterial({ color: 0x00d4aa, size: 0.008, transparent: true, opacity: 0.6 })
        ));
      });

    const arcDefs = [
      [37.77, -122.42, 51.51, -0.13],
      [40.71, -74.01,  35.68, 139.65],
      [28.61,  77.21, -33.87, 151.21],
      [48.86,   2.35,   1.35, 103.82],
      [-23.55, -46.63, 55.76,  37.62],
      [19.43, -99.13,  31.23, 121.47],
      [ 1.35, 103.82,  37.77,-122.42],
      [51.51,  -0.13, -23.55, -46.63],
    ];

    const arcMeshes = arcDefs.map((d, i) => {
      const start = ll2v(d[0], d[1], 1.01);
      const end   = ll2v(d[2], d[3], 1.01);
      const mid   = start.clone().add(end).normalize().multiplyScalar(1.52);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts   = curve.getPoints(80);
      const line  = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0 })
      );
      globeGroup.add(line);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.013, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x55ffdd, transparent: true, opacity: 0 })
      );
      globeGroup.add(dot);
      return { line, dot, curve, phase: i / arcDefs.length, speed: 0.0022 + Math.random() * 0.0018 };
    });

    const seen = new Set();
    arcDefs.forEach(d => {
      [[d[0], d[1]], [d[2], d[3]]].forEach(([lat, lng]) => {
        const key = lat.toFixed(1) + ',' + lng.toFixed(1);
        if (seen.has(key)) return;
        seen.add(key);
        const pos = ll2v(lat, lng, 1.015);
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.016, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x55ffdd, transparent: true, opacity: 0.95 })
        );
        core.position.copy(pos);
        globeGroup.add(core);
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.034, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0.22 })
        );
        halo.position.copy(pos);
        globeGroup.add(halo);
      });
    });

    let dragging = false, px = 0, py = 0, vx = 0, vy = 0.0016;
    const onMouseDown = e => { dragging = true; px = e.clientX; py = e.clientY; };
    const onMouseMove = e => {
      if (!dragging) return;
      vy = (e.clientX - px) * 0.005; vx = (e.clientY - py) * 0.005;
      px = e.clientX; py = e.clientY;
    };
    const onMouseUp = () => { dragging = false; };
    const onTouchStart = e => { dragging = true; px = e.touches[0].clientX; py = e.touches[0].clientY; };
    const onTouchMove = e => {
      if (!dragging) return;
      vy = (e.touches[0].clientX - px) * 0.005; vx = (e.touches[0].clientY - py) * 0.005;
      px = e.touches[0].clientX; py = e.touches[0].clientY;
    };
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
        globeGroup.rotation.y += 0.0018;
        vx *= 0.92; vy *= 0.92;
      } else {
        globeGroup.rotation.y += vy;
        globeGroup.rotation.x = Math.max(-0.6, Math.min(0.6, globeGroup.rotation.x + vx));
      }
      arcMeshes.forEach(arc => {
        arc.phase = (arc.phase + arc.speed) % 1;
        const t = arc.phase;
        const env = t < 0.12 ? t / 0.12 : t > 0.88 ? (1 - t) / 0.12 : 1.0;
        arc.line.material.opacity = env * 0.42;
        arc.dot.position.copy(arc.curve.getPoint(t));
        arc.dot.material.opacity = env * 0.95;
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      W = container.offsetWidth; H = container.offsetHeight;
      if (!W || !H) return;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
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

function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [], arcs = [], mouse = { x: -1000, y: -1000 };
    const NODE_COUNT = 80, ARC_COUNT = 6, CONNECTION_DIST = 180;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function createNodes() {
      nodes = [];
      const cx = w / 2, cy = h / 2, radius = Math.min(w, h) * 0.35;
      for (let i = 0; i < NODE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2, r = Math.random() * radius;
        const drift = (Math.random() - 0.5) * 0.3;
        nodes.push({ x: cx + Math.cos(angle) * r + (Math.random() - 0.5) * 100, y: cy + Math.sin(angle) * r + (Math.random() - 0.5) * 100, vx: drift, vy: (Math.random() - 0.5) * 0.3, radius: Math.random() * 2 + 1, alpha: Math.random() * 0.5 + 0.2, pulse: Math.random() * Math.PI * 2 });
      }
    }
    function createArcs() {
      arcs = [];
      for (let i = 0; i < ARC_COUNT; i++) {
        arcs.push({ startAngle: Math.random() * Math.PI * 2, arc: Math.random() * Math.PI * 0.8 + 0.3, radius: Math.min(w, h) * (0.15 + Math.random() * 0.2), speed: (Math.random() - 0.5) * 0.003, alpha: Math.random() * 0.15 + 0.05, width: Math.random() * 1.5 + 0.5 });
      }
    }
    function drawNode(node, time) {
      const pulse = Math.sin(time * 0.002 + node.pulse) * 0.3 + 0.7;
      ctx.beginPath(); ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 170, ${node.alpha * pulse})`; ctx.fill();
      ctx.beginPath(); ctx.arc(node.x, node.y, node.radius * pulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 170, ${node.alpha * 0.1 * pulse})`; ctx.fill();
    }
    function drawConnections() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${(1 - dist / CONNECTION_DIST) * 0.15})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
        const mdx = nodes[i].x - mouse.x, mdy = nodes[i].y - mouse.y, mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 200) {
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 212, 170, ${(1 - mdist / 200) * 0.3})`; ctx.lineWidth = 0.8; ctx.stroke();
        }
      }
    }
    function drawArcs(time) {
      const cx = w / 2, cy = h / 2;
      arcs.forEach(arc => {
        arc.startAngle += arc.speed;
        ctx.beginPath(); ctx.arc(cx, cy, arc.radius, arc.startAngle, arc.startAngle + arc.arc);
        ctx.strokeStyle = `rgba(0, 212, 170, ${arc.alpha})`; ctx.lineWidth = arc.width; ctx.stroke();
        const dotAngle = arc.startAngle + (time * 0.001 * arc.speed * 50) % arc.arc;
        ctx.beginPath(); ctx.arc(cx + Math.cos(dotAngle) * arc.radius, cy + Math.sin(dotAngle) * arc.radius, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 170, ${arc.alpha * 3})`; ctx.fill();
      });
    }
    function drawGlobeOutline(time) {
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.3;
      ctx.beginPath();
      const segments = 120;
      for (let i = 0; i < segments; i++) {
        if (i % 3 === 0) continue;
        const a1 = (i / segments) * Math.PI * 2 + time * 0.0003, a2 = ((i + 1) / segments) * Math.PI * 2 + time * 0.0003;
        ctx.moveTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r); ctx.lineTo(cx + Math.cos(a2) * r, cy + Math.sin(a2) * r);
      }
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)'; ctx.lineWidth = 1; ctx.stroke();
      for (let lat = -2; lat <= 2; lat++) {
        const offset = lat * r * 0.25, lr = Math.sqrt(Math.max(0, r * r - offset * offset));
        ctx.beginPath(); ctx.ellipse(cx, cy + offset, lr, lr * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.04)'; ctx.lineWidth = 0.5; ctx.stroke();
      }
    }
    function updateNodes() {
      nodes.forEach(node => {
        node.x += node.vx; node.y += node.vy;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
      });
    }
    let animId;
    function animate(time) {
      ctx.clearRect(0, 0, w, h);
      drawGlobeOutline(time); drawArcs(time); drawConnections();
      nodes.forEach(node => drawNode(node, time)); updateNodes();
      animId = requestAnimationFrame(animate);
    }

    const onResize = () => { resize(); createNodes(); createArcs(); };
    window.addEventListener('resize', onResize);
    const onMouseMove = (e) => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; };
    const onMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    resize(); createNodes(); createArcs();
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} id="heroCanvas" />;
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
      <HeroCanvas />
      <div className="hero-glow" />
      <div className="hero-inner">
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#internship" className="btn-secondary" onClick={(e) => handleAnchorClick(e, '#internship')}>
              <span>Join Internship</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
        <div className="hero-globe-wrap">
          <GlobeCanvas />
        </div>
      </div>
    </section>
  );
}
