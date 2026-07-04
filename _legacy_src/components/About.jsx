import { useEffect, useRef, useState } from 'react';
import { StatusGood, Group, AppsRounded } from 'grommet-icons';

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

export default function About() {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('[data-animate]');
    if (!elements?.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const c1 = useCounter(50, statsVisible);
  const c2 = useCounter(500, statsVisible);
  const c3 = useCounter(10, statsVisible);

  return (
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="about" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="grid grid-cols-2 items-center gap-16 max-[1024px]:grid-cols-1 max-[1024px]:gap-10">
          <div data-animate>
            <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">About Us</span>
            <h2 className="mb-4 text-left text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[1024px]:text-center max-[480px]:text-[1.5rem]">Pioneering <span className="text-teal">AI Innovation</span></h2>
            <p className="mb-4 text-[0.95rem] leading-[1.8] text-text-muted max-[1024px]:text-center">Meptrasoft AI Technologies is an AI-first technology company building intelligent products that solve real-world problems. We combine deep expertise in artificial intelligence, data engineering, and software development to create platforms that drive business transformation.</p>
            <p className="mb-4 text-[0.95rem] leading-[1.8] text-text-muted max-[1024px]:text-center">Beyond products, we are committed to building the next generation of engineers. Our internship and training programs provide hands-on experience with production-grade AI systems, ensuring graduates are industry-ready from day one.</p>
            <div className="mt-7 flex flex-col gap-4 max-[1024px]:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(1,128,142,0.15)] bg-[rgba(1,128,142,0.06)] text-[1.1rem] text-teal">
                  <StatusGood size="medium" className="meptra-icon" />
                </div>
                <span className="text-[0.95rem] font-semibold text-text-dark">AI-First Approach</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(1,128,142,0.15)] bg-[rgba(1,128,142,0.06)] text-[1.1rem] text-teal">
                  <Group size="medium" className="meptra-icon" />
                </div>
                <span className="text-[0.95rem] font-semibold text-text-dark">Engineer-Led Culture</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(1,128,142,0.15)] bg-[rgba(1,128,142,0.06)] text-[1.1rem] text-teal">
                  <AppsRounded size="medium" className="meptra-icon" />
                </div>
                <span className="text-[0.95rem] font-semibold text-text-dark">Production-Grade Quality</span>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] max-[1024px]:h-[260px] max-[768px]:h-[220px] max-[480px]:h-[200px]" data-animate>
            <div className="relative h-full w-full" ref={statsRef}>
              <div className="absolute left-5 top-5 animate-float-card rounded-[20px] border-2 border-border-card bg-white p-[28px_32px] shadow-card transition duration-[700ms] ease-smooth hover:!-translate-y-1 hover:border-teal hover:shadow-card-hover max-[1024px]:left-2.5 max-[1024px]:top-2.5 max-[1024px]:p-[20px_24px] max-[768px]:left-[5px] max-[768px]:top-[5px] max-[768px]:p-[16px_20px] max-[480px]:p-[14px_16px]">
                <span className="block text-[2rem] font-extrabold text-teal max-[768px]:text-[1.5rem] max-[480px]:text-[1.3rem]">{c1}+</span>
                <span className="text-[0.85rem] font-medium text-text-muted max-[768px]:text-[0.78rem]">AI Models in Production</span>
              </div>
              <div className="absolute right-2.5 top-[140px] animate-float-card rounded-[20px] border-2 border-border-card bg-white p-[28px_32px] shadow-card transition duration-[700ms] ease-smooth [animation-delay:1s] hover:!-translate-y-1 hover:border-teal hover:shadow-card-hover max-[1024px]:right-[5px] max-[1024px]:top-[100px] max-[1024px]:p-[20px_24px] max-[768px]:right-0 max-[768px]:top-20 max-[768px]:p-[16px_20px] max-[480px]:p-[14px_16px]">
                <span className="block text-[2rem] font-extrabold text-teal max-[768px]:text-[1.5rem] max-[480px]:text-[1.3rem]">{c2}+</span>
                <span className="text-[0.85rem] font-medium text-text-muted max-[768px]:text-[0.78rem]">Engineers Trained</span>
              </div>
              <div className="absolute bottom-10 left-[60px] animate-float-card rounded-[20px] border-2 border-border-card bg-white p-[28px_32px] shadow-card transition duration-[700ms] ease-smooth [animation-delay:2s] hover:!-translate-y-1 hover:border-teal hover:shadow-card-hover max-[1024px]:bottom-5 max-[1024px]:left-[30px] max-[1024px]:p-[20px_24px] max-[768px]:bottom-2.5 max-[768px]:left-5 max-[768px]:p-[16px_20px] max-[480px]:p-[14px_16px]">
                <span className="block text-[2rem] font-extrabold text-teal max-[768px]:text-[1.5rem] max-[480px]:text-[1.3rem]">{c3}+</span>
                <span className="text-[0.85rem] font-medium text-text-muted max-[768px]:text-[0.78rem]">SaaS Products Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
