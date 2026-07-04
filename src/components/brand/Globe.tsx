import { useEffect, useRef } from "react";
import * as THREE from "three";
import globePoints from "@/data/globePoints.json";

/** Interactive 3D dotted globe with animated arcs. Drag to spin; auto-rotates
 *  otherwise. Built with three.js directly (no react-three-fiber). The whole
 *  scene lives in one useEffect with full teardown — preserve the cleanup or
 *  WebGL contexts leak under StrictMode double-mount. */
export function Globe({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2.55;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    function syncSize() {
      const W = container!.clientWidth;
      const H = container!.clientHeight;
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
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const s = 0.01 + eased * 0.99;
      globeGroup.scale.set(s, s, s);
      if (progress < 1) requestAnimationFrame(animateScale);
    }
    requestAnimationFrame(animateScale);

    // Inner sphere
    globeGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.99, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0x0a3d3d, transparent: true, opacity: 0.15 })
      )
    );

    function ll2v(lat: number, lng: number, r: number) {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lng + 180) * Math.PI) / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    // Dotted globe points
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(globePoints as number[], 3)
    );
    const globeDots = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xc8ede6,
        size: 0.011,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      })
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
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      ring.position.copy(end.clone().normalize().multiplyScalar(1.0));
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), end.clone().normalize());
      ring.scale.setScalar(0.001);
      globeGroup.add(ring);
      return {
        line,
        dot,
        ring,
        curve,
        phase: i / arcDefs.length,
        speed: 0.0014 + ((i * 37) % 10) / 10 * 0.0009,
        ripple: 1,
      };
    });

    let dragging = false,
      px = 0,
      py = 0,
      vx = 0,
      vy = 0.0016;
    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      vy = (e.clientX - px) * 0.004;
      vx = (e.clientY - py) * 0.004;
      px = e.clientX;
      py = e.clientY;
    };
    const onMouseUp = () => {
      dragging = false;
    };
    const onTouchStart = (e: TouchEvent) => {
      dragging = true;
      px = e.touches[0].clientX;
      py = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      vy = (e.touches[0].clientX - px) * 0.004;
      vx = (e.touches[0].clientY - py) * 0.004;
      px = e.touches[0].clientX;
      py = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      dragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!dragging) {
        globeGroup.rotation.y += 0.003;
        vx *= 0.92;
        vy *= 0.92;
      } else {
        globeGroup.rotation.y += vy;
        globeGroup.rotation.x = Math.max(-0.6, Math.min(0.6, globeGroup.rotation.x + vx));
      }
      arcMeshes.forEach((arc) => {
        const prev = arc.phase;
        arc.phase = (arc.phase + arc.speed) % 1;
        const t = arc.phase;
        if (arc.phase < prev) arc.ripple = 0; // wrapped past the end => landed
        const head = Math.floor(t * ARC_PTS);
        const tail = Math.max(0, head - TRAIL_LEN);
        arc.line.geometry.setDrawRange(tail, head - tail);
        arc.dot.position.copy(arc.curve.getPoint(t));
        const env = t < 0.05 ? t / 0.05 : 1.0;
        const ringMat = arc.ring.material as THREE.MeshBasicMaterial;
        const dotMat = arc.dot.material as THREE.MeshBasicMaterial;
        const lineMat = arc.line.material as THREE.LineBasicMaterial;
        if (arc.ripple < 1) {
          arc.ripple += 0.05;
          const r = Math.min(arc.ripple, 1);
          arc.ring.scale.setScalar(0.02 + r * 0.06);
          ringMat.opacity = (1 - r) * 0.85;
          arc.dot.scale.setScalar(1 + (1 - r) * 1.2);
        } else {
          ringMat.opacity = 0;
          arc.dot.scale.setScalar(1);
        }
        dotMat.opacity = env;
        lineMat.opacity = env * 0.55;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden
    />
  );
}
