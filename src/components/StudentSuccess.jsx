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
    <section className="relative bg-bg-light py-[100px] max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="success" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Impact</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">Our <span className="text-teal">Student Success</span></h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">Real outcomes from our training, internship, and product programs.</p>
        </div>
        <div className="grid grid-cols-4 gap-8 text-center max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1">
          <div className="rounded-[16px] border border-border bg-white p-[32px_16px] transition duration-[700ms] ease-smooth hover:-translate-y-[2px] hover:border-teal hover:shadow-card-hover">
            <span className="mb-1 block text-[2.5rem] font-extrabold text-teal">{c1}+</span>
            <span className="text-[0.85rem] font-medium text-text-body">Students Trained</span>
          </div>
          <div className="rounded-[16px] border border-border bg-white p-[32px_16px] transition duration-[700ms] ease-smooth hover:-translate-y-[2px] hover:border-teal hover:shadow-card-hover">
            <span className="mb-1 block text-[2.5rem] font-extrabold text-teal">{c2}+</span>
            <span className="text-[0.85rem] font-medium text-text-body">AI Models Built</span>
          </div>
          <div className="rounded-[16px] border border-border bg-white p-[32px_16px] transition duration-[700ms] ease-smooth hover:-translate-y-[2px] hover:border-teal hover:shadow-card-hover">
            <span className="mb-1 block text-[2.5rem] font-extrabold text-teal">{c3}+</span>
            <span className="text-[0.85rem] font-medium text-text-body">Products Developed</span>
          </div>
          <div className="rounded-[16px] border border-border bg-white p-[32px_16px] transition duration-[700ms] ease-smooth hover:-translate-y-[2px] hover:border-teal hover:shadow-card-hover">
            <span className="mb-1 block text-[2.5rem] font-extrabold text-teal">{c4}+</span>
            <span className="text-[0.85rem] font-medium text-text-body">Internships Completed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
