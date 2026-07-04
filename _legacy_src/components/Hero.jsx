import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FormNextLink } from 'grommet-icons';
import globePoints from './globePoints.json';

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
    globeGroup.scale.set(0.01, 0.01, 0.01);
    scene.add(globeGroup);

    // Smooth scale-up animation on load
    const scaleStart = performance.now();
    const scaleDuration = 2200;
    function animateScale() {
      const elapsed = performance.now() - scaleStart;
      const progress = Math.min(elapsed / scaleDuration, 1);
      // Smooth ease-in-out (cubic bezier style)
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const s = 0.01 + eased * 0.99;
      globeGroup.scale.set(s, s, s);
      if (progress < 1) requestAnimationFrame(animateScale);
    }
    requestAnimationFrame(animateScale);

    // Inner sphere
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.99, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x0a3d3d, transparent: true, opacity: 0.15 })
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

    // Dotted globe points
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(globePoints, 3));
    const globeDots = new THREE.Points(geo,
      new THREE.PointsMaterial({ color: 0xc8ede6, size: 0.011, transparent: true, opacity: 0.9, sizeAttenuation: true })
    );
    globeGroup.add(globeDots);

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
        new THREE.SphereGeometry(0.013, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
      );
      globeGroup.add(dot);
      // Impact ripple ring, laid flat on the surface at the landing point
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.6, 1.0, 28),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      ring.position.copy(end.clone().normalize().multiplyScalar(1.0));
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), end.clone().normalize());
      ring.scale.setScalar(0.001);
      globeGroup.add(ring);
      return { line, dot, ring, curve, phase: i / arcDefs.length, speed: 0.0014 + Math.random() * 0.0009, ripple: 1 };
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
        const prev = arc.phase;
        arc.phase = (arc.phase + arc.speed) % 1;
        const t = arc.phase;
        if (arc.phase < prev) arc.ripple = 0; // wrapped past the end => landed
        const head = Math.floor(t * ARC_PTS);
        const tail = Math.max(0, head - TRAIL_LEN);
        arc.line.geometry.setDrawRange(tail, head - tail);
        arc.dot.position.copy(arc.curve.getPoint(t));
        // Fade in at launch, stay bright through the landing
        const env = t < 0.05 ? t / 0.05 : 1.0;
        // Minimal smash: ring expands and fades, dot pulses, on impact
        if (arc.ripple < 1) {
          arc.ripple += 0.05;
          const r = Math.min(arc.ripple, 1);
          arc.ring.scale.setScalar(0.02 + r * 0.06);
          arc.ring.material.opacity = (1 - r) * 0.85;
          arc.dot.scale.setScalar(1 + (1 - r) * 1.2);
        } else {
          arc.ring.material.opacity = 0;
          arc.dot.scale.setScalar(1);
        }
        arc.dot.material.opacity = env;
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

  return <div ref={containerRef} id="globeContainer" className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 cursor-grab [pointer-events:all] [will-change:transform] active:cursor-grabbing max-[1024px]:left-1/2 max-[1024px]:top-1/2 max-[1024px]:-translate-x-1/2 max-[1024px]:-translate-y-1/2" />;
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-hero pt-[128px] pb-[80px] max-[1024px]:min-h-[auto] max-[1024px]:pt-[104px] max-[1024px]:pb-[64px] max-[768px]:pt-[92px] max-[768px]:pb-[52px] max-[480px]:pt-[80px] max-[480px]:pb-[40px]" id="hero">
      <div className="pointer-events-none absolute left-[20%] top-[40%] z-[1] h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow bg-[radial-gradient(circle,rgba(0,212,170,0.08)_0%,rgba(14,165,233,0.04)_35%,transparent_65%)]" />
      <div className="relative z-[2] min-h-[calc(100vh-160px)] w-full max-[1024px]:min-h-[auto]">
        <div className="pointer-events-none absolute left-[-8%] top-0 z-[1] h-[120%] w-[68%] opacity-[0.92] max-[1024px]:left-0 max-[1024px]:top-[42%] max-[1024px]:h-[78%] max-[1024px]:w-full max-[1024px]:-translate-y-1/2 max-[1024px]:opacity-[0.6] max-[768px]:h-[70%] max-[768px]:opacity-[0.52] max-[480px]:h-[62%] max-[480px]:opacity-[0.48]">
          <GlobeCanvas />
        </div>
        <div className="relative z-[3] ml-[46%] mr-[2%] flex min-h-[calc(100vh-160px)] max-w-[680px] flex-col justify-center text-left min-[1440px]:mr-[8%] min-[1440px]:max-w-[580px] max-[1280px]:min-[1025px]:ml-1/2 max-[1280px]:min-[1025px]:mr-[2%] max-[1280px]:min-[1025px]:max-w-[540px] max-[1024px]:mx-auto max-[1024px]:min-h-[auto] max-[1024px]:max-w-full max-[1024px]:px-8 max-[1024px]:pt-[60px] max-[1024px]:pb-[40px] max-[1024px]:text-center max-[768px]:px-5 max-[768px]:pt-[48px] max-[768px]:pb-8 max-[480px]:px-4 max-[480px]:pt-9 max-[480px]:pb-6">
          <div className="mb-5 inline-flex animate-fade-in-up items-center gap-2 self-start rounded-pill border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] px-5 py-2 text-[0.85rem] font-medium text-white max-[1024px]:self-center">
            <span className="h-2 w-2 animate-blink rounded-full bg-teal-light" />
            AI-Powered Innovation
          </div>
          <h1 className="mb-6 animate-fade-in-up text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-[1.22] tracking-[-0.02em] text-white [animation-delay:0.1s] [animation-fill-mode:both] min-[1440px]:text-[2.6rem] max-[1280px]:min-[1025px]:text-[2rem] max-[480px]:text-[1.6rem]">
            Building <span className="text-teal-light">AI-Powered</span> Products, Data Platforms, and the Next Generation of Engineers
          </h1>
          <div className="mb-9 flex animate-fade-in-up flex-wrap justify-start gap-4 [animation-delay:0.3s] [animation-fill-mode:both] max-[1024px]:justify-center">
            <a href="#products" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" onClick={(e) => handleAnchorClick(e, '#products')}>
              <span>Explore Products</span>
              <FormNextLink size="medium" />
            </a>
            <a href="#internship" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-2 border-[rgba(255,255,255,0.35)] bg-transparent px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:border-white hover:bg-[rgba(255,255,255,0.1)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" onClick={(e) => handleAnchorClick(e, '#internship')}>
              <span>Join Internship</span>
              <FormNextLink size="medium" />
            </a>
          </div>
          <div className="flex animate-fade-in-up items-center justify-start gap-9 [animation-delay:0.4s] [animation-fill-mode:both] max-[1024px]:justify-center max-[768px]:flex-col max-[768px]:gap-5" ref={statsRef}>
            <div className="text-center">
              <span className="text-[1.8rem] font-extrabold text-white">{c1}</span><span className="text-[1.2rem] font-bold text-teal-light">+</span>
              <span className="mt-0.5 block text-[0.72rem] font-medium uppercase tracking-[0.05em] text-[rgba(255,255,255,0.6)]">AI Models Deployed</span>
            </div>
            <div className="h-9 w-px bg-[rgba(255,255,255,0.15)] max-[768px]:h-px max-[768px]:w-12" />
            <div className="text-center">
              <span className="text-[1.8rem] font-extrabold text-white">{c2}</span><span className="text-[1.2rem] font-bold text-teal-light">+</span>
              <span className="mt-0.5 block text-[0.72rem] font-medium uppercase tracking-[0.05em] text-[rgba(255,255,255,0.6)]">Engineers Trained</span>
            </div>
            <div className="h-9 w-px bg-[rgba(255,255,255,0.15)] max-[768px]:h-px max-[768px]:w-12" />
            <div className="text-center">
              <span className="text-[1.8rem] font-extrabold text-white">{c3}</span><span className="text-[1.2rem] font-bold text-teal-light">+</span>
              <span className="mt-0.5 block text-[0.72rem] font-medium uppercase tracking-[0.05em] text-[rgba(255,255,255,0.6)]">SaaS Products</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
