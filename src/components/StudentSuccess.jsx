import { useEffect, useRef, useState } from 'react';

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

export default function StudentSuccess() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const c1 = useCounter(500, visible);
  const c2 = useCounter(50, visible);
  const c3 = useCounter(10, visible);
  const c4 = useCounter(200, visible);

  return (
    <section className="section student-success" id="success" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Impact</span>
          <h2 className="section-title">Our <span className="gradient-text">Student Success</span></h2>
          <p className="section-sub">Real outcomes from our training, internship, and product programs.</p>
        </div>
        <div className="success-stats">
          <div className="success-stat">
            <span className="success-num">{c1}+</span>
            <span className="success-label">Students Trained</span>
          </div>
          <div className="success-stat">
            <span className="success-num">{c2}+</span>
            <span className="success-label">AI Models Built</span>
          </div>
          <div className="success-stat">
            <span className="success-num">{c3}+</span>
            <span className="success-label">Products Developed</span>
          </div>
          <div className="success-stat">
            <span className="success-num">{c4}+</span>
            <span className="success-label">Internships Completed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
