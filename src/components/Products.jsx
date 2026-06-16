import { useEffect, useRef } from 'react';
import { Task, Certificate, DocumentText, LineChart } from 'grommet-icons';

function useScrollAnimate(ref) {
  useEffect(() => {
    const elements = ref.current?.querySelectorAll('[data-animate]');
    if (!elements?.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const products = [
  {
    icon: <Task size="medium" className="meptra-icon" />,
    name: 'AI Exam Intelligence Platform',
    desc: 'Automated exam generation, intelligent grading, and deep analytics powered by machine learning for smarter assessments.',
    tags: ['NLP', 'ML', 'Analytics'],
  },
  {
    icon: <Certificate size="medium" className="meptra-icon" />,
    name: 'AI Placement Preparation Platform',
    desc: 'Personalized learning paths, mock interviews with AI, resume analysis, and company-specific preparation for career success.',
    tags: ['AI Coach', 'Career', 'Prep'],
  },
  {
    icon: <DocumentText size="medium" className="meptra-icon" />,
    name: 'AI Document Intelligence Platform',
    desc: 'Extract, classify, and process documents with state-of-the-art OCR, NLP, and AI models for enterprise document workflows.',
    tags: ['OCR', 'NLP', 'Enterprise'],
  },
  {
    icon: <LineChart size="medium" className="meptra-icon" />,
    name: 'Data Analytics & BI Platform',
    desc: 'Real-time dashboards, predictive analytics, and business intelligence tools to make data-driven decisions at scale.',
    tags: ['BI', 'Dashboards', 'Predictive'],
  },
];

export default function Products() {
  const sectionRef = useRef(null);
  useScrollAnimate(sectionRef);

  return (
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="products" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Products</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">Our <span className="text-teal">AI Products</span></h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">Intelligent platforms built to transform industries with AI and data-driven insights.</p>
        </div>
        <div className="grid grid-cols-2 gap-7 max-[768px]:grid-cols-1">
          {products.map((p) => (
            <div className="product-card relative overflow-hidden rounded-[20px] border-2 border-border-card bg-white p-[36px_32px] transition duration-[700ms] ease-smooth hover:-translate-y-1 hover:border-teal hover:shadow-card-hover max-[480px]:p-[24px_20px]" data-animate key={p.name}>
              <div className="product-icon mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-[16px] border-2 border-[rgba(1,128,142,0.2)] bg-[linear-gradient(135deg,rgba(1,128,142,0.1),rgba(0,180,174,0.06))] p-[14px] text-[1.8rem] text-teal [&>svg]:h-full [&>svg]:w-full">{p.icon}</div>
              <h3 className="mb-2.5 text-[1.2rem] font-extrabold tracking-[-0.01em] text-text-dark">{p.name}</h3>
              <p className="mb-5 text-[0.92rem] leading-[1.75] text-text-body">{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map(t => <span className="rounded-pill border border-[rgba(1,128,142,0.2)] bg-[rgba(1,128,142,0.08)] px-[14px] py-[5px] text-[0.75rem] font-bold text-teal" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
