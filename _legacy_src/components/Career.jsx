import { FormNextLink, Certificate, Group, Launch, Trophy, Technology, LineChart, Server, AppsRounded, Database } from 'grommet-icons';

const highlights = [
  { icon: <Certificate size="medium" color="#ffffff" />, title: 'Real-World Projects', sub: 'Work on live AI products' },
  { icon: <Group size="medium" color="#ffffff" />, title: 'Mentorship', sub: 'Guided by industry experts' },
  { icon: <Launch size="medium" color="#ffffff" />, title: 'Placement Support', sub: 'Resume & interview prep' },
  { icon: <Trophy size="medium" color="#ffffff" />, title: 'Certification', sub: 'Industry-recognised credentials' },
];

const openRoles = [
  { icon: <Technology size="medium" className="meptra-icon" />, title: 'AI Engineer', desc: 'Build and deploy production AI/ML models and systems.' },
  { icon: <LineChart size="medium" className="meptra-icon" />, title: 'Data Scientist', desc: 'Analyze data, build predictive models, and derive insights.' },
  { icon: <Server size="medium" className="meptra-icon" />, title: 'Backend Developer', desc: 'Design APIs, microservices, and scalable server systems.' },
  { icon: <AppsRounded size="medium" className="meptra-icon" />, title: 'Full Stack Developer', desc: 'Build end-to-end web applications and SaaS platforms.' },
  { icon: <Database size="medium" className="meptra-icon" />, title: 'Data Engineer', desc: 'Design data pipelines, warehouses, and ETL systems.' },
];

export default function Career() {
  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative p-0" id="career">
      <div className="relative flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0a3d3d_0%,#0d5c5c_30%,#01808e_60%,#0f2f50_100%)] px-8 pt-[100px] pb-[80px] max-[768px]:px-5 max-[768px]:py-[64px] max-[480px]:px-4 max-[480px]:py-[48px]">
        <img src="/assets/logo.svg" alt="" className="pointer-events-none absolute right-[3%] top-1/2 h-[62%] w-auto max-w-[46%] -translate-y-1/2 select-none object-contain opacity-[0.13] [filter:brightness(10)_saturate(0)] max-[1024px]:h-[48%] max-[768px]:right-[2%] max-[768px]:h-[40%] max-[768px]:max-w-[70%] max-[768px]:opacity-[0.1] max-[480px]:h-[34%]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,61,61,0.9)_45%,transparent_100%)]" />
        <div className="relative z-[2] mx-auto max-w-[1100px] px-6 text-center max-[768px]:px-4 max-[480px]:px-3">
          <span className="mb-[14px] inline-block rounded-pill border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.18)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-white">Careers</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-white max-[480px]:text-[1.5rem]">
            Build Your Career with <span className="text-[#ffa44f]">Meptrasoft AI</span>
          </h2>
          <p className="mx-auto max-w-[700px] text-[1.05rem] leading-[1.75] text-[rgba(255,255,255,0.82)] max-[480px]:text-[0.92rem]">
            Join our team building AI-powered products and advanced data platforms. We offer internship programs, training, and full-time roles for passionate engineers, data scientists, and product builders.
          </p>
          <div className="mt-8 mb-12 flex flex-wrap justify-center gap-4 max-[768px]:flex-col max-[768px]:items-center">
            <a href="#register" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" onClick={(e) => handleAnchorClick(e, '#register')}>
              <span>View Career Opportunities</span>
              <FormNextLink size="medium" />
            </a>
            <a href="#training" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-2 border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.15)] px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:border-white hover:bg-[rgba(255,255,255,0.1)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" onClick={(e) => handleAnchorClick(e, '#training')}>
              <span>Explore Training</span>
              <FormNextLink size="medium" />
            </a>
          </div>
          <div className="grid grid-cols-4 gap-5 max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1">
            {highlights.map((h) => (
              <div className="flex flex-col gap-1.5 rounded-[16px] border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] p-[20px_16px] transition duration-[700ms] ease-smooth hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.16)]" key={h.title}>
                <span className="text-[1.8rem] text-[rgba(255,255,255,0.9)]">{h.icon}</span>
                <strong className="text-[0.95rem] font-bold text-white">{h.title}</strong>
                <span className="text-[0.82rem] text-[rgba(255,255,255,0.7)]">{h.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="py-16">
          <h3 className="mb-8 text-center text-[1.3rem] font-bold text-text-dark">Open Roles</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 max-[1024px]:grid-cols-1">
            {openRoles.map(r => (
              <div className="flex items-center gap-4 rounded-[16px] border border-border bg-bg-light p-[20px_24px] transition duration-[700ms] ease-smooth hover:border-teal hover:shadow-card max-[480px]:p-4" key={r.title}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[rgba(1,128,142,0.2)] bg-[linear-gradient(135deg,rgba(1,128,142,0.1),rgba(0,180,174,0.06))] text-[1.1rem] text-teal">{r.icon}</div>
                <div>
                  <h4 className="mb-0.5 text-[0.95rem] font-bold text-text-dark">{r.title}</h4>
                  <p className="text-[0.82rem] leading-[1.4] text-text-muted">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
