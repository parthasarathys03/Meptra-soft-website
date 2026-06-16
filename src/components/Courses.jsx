import { useEffect, useRef } from 'react';
import { Code, Technology, LineChart, Database, Reactjs, Magic, Cloud, FormNextLink, Clock, Test, Certificate } from 'grommet-icons';

const courses = [
  { icon: <Code size="medium" className="meptra-icon" />, title: 'Python for AI', duration: '4 Weeks', desc: 'Python fundamentals, NumPy, Pandas, and AI libraries.' },
  { icon: <Technology size="medium" className="meptra-icon" />, title: 'Machine Learning', duration: '6 Weeks', desc: 'Supervised, unsupervised learning, model evaluation, and deployment.' },
  { icon: <LineChart size="medium" className="meptra-icon" />, title: 'Data Analytics with Python', duration: '4 Weeks', desc: 'Data wrangling, visualization, and insights with real datasets.' },
  { icon: <Database size="medium" className="meptra-icon" />, title: 'SQL for Data Engineering', duration: '3 Weeks', desc: 'Advanced SQL, query optimization, and data warehouse design.' },
  { icon: <Reactjs size="medium" className="meptra-icon" />, title: 'Full Stack Web Development', duration: '8 Weeks', desc: 'React, Node.js, REST APIs, MongoDB, and deployment.' },
  { icon: <Magic size="medium" className="meptra-icon" />, title: 'Generative AI Development', duration: '6 Weeks', desc: 'LLMs, prompt engineering, RAG, and AI application building.' },
  { icon: <Cloud size="medium" className="meptra-icon" />, title: 'Cloud & DevOps', duration: '6 Weeks', desc: 'AWS/Azure, Docker, Kubernetes, CI/CD pipelines.' },
];

const features = [
  { icon: <Test size="medium" className="meptra-icon" />, text: 'Hands-on Labs' },
  { icon: <Technology size="medium" className="meptra-icon" />, text: 'Mini Projects' },
  { icon: <Certificate size="medium" className="meptra-icon" />, text: 'Certification' },
];

export default function Courses() {
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
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="courses" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Courses</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">Professional <span className="text-teal">Short-Term Courses</span></h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">Quickly build industry-ready skills with focused, hands-on courses designed for rapid upskilling.</p>
        </div>
        <div className="mb-10 flex justify-center gap-8 max-[768px]:flex-col max-[768px]:items-center" data-animate>
          {features.map(f => (
            <div className="flex items-center gap-2 text-[0.95rem] font-semibold text-teal [&_svg]:text-[1.2rem]" key={f.text}>
              {f.icon}
              <span>{f.text}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 max-[1024px]:grid-cols-1">
          {courses.map((c) => (
            <div className="course-card flex items-start gap-4 rounded-[16px] border border-border bg-white p-6 transition duration-[700ms] ease-smooth hover:-translate-y-[2px] hover:border-teal hover:shadow-card-hover max-[480px]:gap-3 max-[480px]:p-4" data-animate key={c.title}>
              <div className="course-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border-2 border-[rgba(1,128,142,0.2)] bg-[linear-gradient(135deg,rgba(1,128,142,0.1),rgba(0,180,174,0.06))] text-[1.4rem] text-teal">{c.icon}</div>
              <div>
                <h3 className="mb-1 text-[1.05rem] font-bold text-text-dark">{c.title}</h3>
                <span className="mb-1.5 inline-flex items-center gap-1 text-[0.78rem] font-semibold text-teal"><Clock size="small" /> {c.duration}</span>
                <p className="text-[0.85rem] leading-[1.5] text-text-muted">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href="#register" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" onClick={(e) => handleAnchorClick(e, '#register')}>
            <span>View Courses</span>
            <FormNextLink size="medium" className="meptra-icon" />
          </a>
        </div>
      </div>
    </section>
  );
}
