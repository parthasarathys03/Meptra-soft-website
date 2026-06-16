import { useEffect, useRef } from 'react';
import { Magic, Desktop, Database, Target, Code, BarChart } from 'grommet-icons';

const services = [
  {
    icon: <Magic size="medium" className="meptra-icon" />,
    title: 'AI Product Development',
    desc: 'Build intelligent products with NLP, computer vision, recommendation systems, and generative AI capabilities.',
  },
  {
    icon: <Desktop size="medium" className="meptra-icon" />,
    title: 'SaaS Platform Engineering',
    desc: 'Scalable, multi-tenant SaaS platforms with modern architecture, microservices, and cloud-native design.',
  },
  {
    icon: <Database size="medium" className="meptra-icon" />,
    title: 'Data Engineering Systems',
    desc: 'Build robust data pipelines, data lakes, warehouses, and ETL systems for real-time and batch processing.',
  },
  {
    icon: <Target size="medium" className="meptra-icon" />,
    title: 'Machine Learning Solutions',
    desc: 'Custom ML models for prediction, classification, anomaly detection, and optimization across domains.',
  },
  {
    icon: <Code size="medium" className="meptra-icon" />,
    title: 'Custom Software Development',
    desc: 'Full-cycle development of enterprise applications, APIs, and digital platforms tailored to business needs.',
  },
  {
    icon: <BarChart size="medium" className="meptra-icon" />,
    title: 'Data Analytics Platforms',
    desc: 'Interactive dashboards, data visualization, and analytics platforms for actionable business intelligence.',
  },
];

export default function Services() {
  const sectionRef = useRef(null);

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

  return (
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="services" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Solutions</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">AI &amp; Data <span className="text-teal">Technology Services</span></h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">End-to-end technology services from ideation to deployment, powered by AI expertise.</p>
        </div>
        <div className="grid grid-cols-3 gap-7 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1">
          {services.map((s) => (
            <div className="service-card relative overflow-hidden rounded-[20px] border-2 border-border-card bg-white p-[36px_28px] text-center transition duration-[700ms] ease-smooth hover:-translate-y-1 hover:border-teal hover:shadow-card-hover max-[480px]:p-[24px_20px]" data-animate key={s.title}>
              <div className="service-icon-wrap mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[rgba(1,128,142,0.2)] bg-[linear-gradient(135deg,rgba(1,128,142,0.1),rgba(0,180,174,0.06))] text-[2rem] text-teal">{s.icon}</div>
              <h3 className="mb-2.5 text-[1.05rem] font-extrabold tracking-[-0.01em] text-text-dark">{s.title}</h3>
              <p className="text-[0.9rem] leading-[1.75] text-text-body">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
