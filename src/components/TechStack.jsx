import { useEffect, useRef } from 'react';

const categories = [
  { title: 'AI & Data Science', pills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI', 'LangChain', 'Hugging Face', 'Pandas', 'NumPy'] },
  { title: 'Data Engineering', pills: ['Apache Spark', 'Kafka', 'Airflow', 'dbt', 'Snowflake', 'BigQuery', 'PostgreSQL', 'MongoDB', 'Redis'] },
  { title: 'Software Development', pills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'FastAPI', 'Django', 'GraphQL', 'REST APIs', 'Java'] },
  { title: 'Cloud & DevOps', pills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Jenkins', 'Linux'] },
];

export default function TechStack() {
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
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="techstack" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Technology</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">Technologies We <span className="text-teal">Work With</span></h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">Industry-leading tools and frameworks powering our AI products and platforms.</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-7 max-[480px]:grid-cols-1">
          {categories.map((cat) => (
            <div className="rounded-[20px] border-2 border-border-card bg-white p-7" data-animate key={cat.title}>
              <h3 className="mb-4 text-[1rem] font-bold text-teal">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.pills.map((pill) => <span className="rounded-pill border border-border bg-bg-light px-[14px] py-1.5 text-[0.8rem] font-medium text-text-body transition duration-[700ms] ease-smooth hover:border-teal hover:bg-[rgba(1,128,142,0.08)] hover:text-teal" key={pill}>{pill}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
