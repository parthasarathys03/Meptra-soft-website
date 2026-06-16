import { useEffect, useRef } from 'react';
import { Technology, Analytics, System, AppsRounded, Cloud, FormNextLink, StatusGood } from 'grommet-icons';

const programs = [
  {
    icon: <Technology size="medium" className="meptra-icon" />,
    title: 'Artificial Intelligence Engineering',
    duration: '3–6 Months',
    topics: ['Machine Learning', 'Deep Learning', 'NLP', 'Generative AI', 'AI Product Development'],
    desc: 'Master AI from fundamentals to production-grade systems with hands-on projects.',
  },
  {
    icon: <Analytics size="medium" className="meptra-icon" />,
    title: 'Data Science Program',
    duration: '3 Months',
    topics: ['Python for Data Science', 'Statistics', 'Machine Learning', 'Data Visualization', 'Predictive Modeling'],
    desc: 'Statistical analysis, machine learning, visualization, and real-world data projects.',
  },
  {
    icon: <System size="medium" className="meptra-icon" />,
    title: 'Data Engineering Program',
    duration: '3 Months',
    topics: ['SQL', 'Data Warehousing', 'ETL Pipelines', 'Apache Spark', 'Cloud Data Platforms'],
    desc: 'Build scalable data pipelines, warehouses, and cloud data platforms.',
  },
  {
    icon: <AppsRounded size="medium" className="meptra-icon" />,
    title: 'Full Stack Development',
    duration: '3 Months',
    topics: ['React', 'Node.js', 'REST APIs', 'Databases', 'SaaS Architecture'],
    desc: 'End-to-end web development from frontend to backend and deployment.',
  },
  {
    icon: <Cloud size="medium" className="meptra-icon" />,
    title: 'Cloud Computing',
    duration: '3 Months',
    topics: ['AWS', 'Azure', 'GCP', 'Containerization', 'CI/CD'],
    desc: 'Cloud-native architecture, DevOps, and infrastructure management.',
  },
];

const benefits = [
  'Real-world projects from our AI product portfolio',
  'Industry mentors with 5+ years experience',
  'Resume building & interview preparation',
  'Industry-recognised certification',
  'Placement assistance & career support',
];

export default function Training() {
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

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="training" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Training Programs</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">AI &amp; Technology <span className="text-teal">Training Programs</span> for Freshers</h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">Industry-oriented training designed for students and fresh graduates to gain real-world skills in AI, Data Science, Data Engineering, and Software Development.</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-7 max-[480px]:grid-cols-1">
          {programs.map((p) => (
            <div className="training-card rounded-[20px] border-2 border-border-card bg-white p-[36px_24px] text-left transition duration-[700ms] ease-smooth hover:-translate-y-1 hover:border-teal hover:shadow-card-hover max-[480px]:p-[24px_16px]" data-animate key={p.title}>
              <div className="training-icon mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[rgba(1,128,142,0.2)] bg-[linear-gradient(135deg,rgba(1,128,142,0.1),rgba(0,180,174,0.06))] text-[2rem] text-teal">{p.icon}</div>
              <h3 className="mb-2.5 text-center text-[1.05rem] font-extrabold tracking-[-0.01em] text-text-dark">{p.title}</h3>
              <span className="mx-auto mb-3 block w-fit rounded-pill bg-[rgba(1,128,142,0.1)] px-[14px] py-1 text-center text-[0.78rem] font-semibold text-teal">{p.duration}</span>
              <p className="text-[0.88rem] leading-[1.75] text-text-body">{p.desc}</p>
              <ul className="mt-3 flex list-none flex-wrap justify-center gap-1.5 p-0">
                {p.topics.map(t => <li className="rounded-pill bg-[rgba(1,128,142,0.08)] px-3 py-1 text-[0.75rem] font-medium text-teal-dark" key={t}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-[24px] bg-[linear-gradient(135deg,#0a3d3d_0%,#0d5c5c_45%,#0f2f50_100%)] px-10 py-12 shadow-card-hover max-[768px]:px-6 max-[768px]:py-9" data-animate>
          <h3 className="mb-8 text-center text-[1.4rem] font-extrabold tracking-[-0.01em] text-white">Key Benefits</h3>
          <div className="mx-auto flex max-w-[920px] flex-wrap justify-center gap-4">
            {benefits.map(b => (
              <div className="inline-flex items-center gap-3 rounded-[14px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-5 py-3.5 transition duration-[400ms] ease-smooth hover:border-[rgba(0,180,174,0.5)] hover:bg-[rgba(255,255,255,0.1)]" key={b}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-light text-white shadow-[0_2px_8px_rgba(0,180,174,0.4)]">
                  <StatusGood size="small" color="white" />
                </span>
                <span className="text-[0.92rem] font-medium text-[rgba(255,255,255,0.92)]">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <a href="#register" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" onClick={(e) => handleAnchorClick(e, '#register')}>
            <span>Enroll in Training</span>
            <FormNextLink size="medium" className="meptra-icon" />
          </a>
        </div>
      </div>
    </section>
  );
}
