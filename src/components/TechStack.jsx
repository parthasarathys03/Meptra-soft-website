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
    <section className="section techstack" id="techstack" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Technology</span>
          <h2 className="section-title">Technologies We <span className="gradient-text">Work With</span></h2>
          <p className="section-sub">Industry-leading tools and frameworks powering our AI products and platforms.</p>
        </div>
        <div className="tech-categories">
          {categories.map((cat) => (
            <div className="tech-category" data-animate key={cat.title}>
              <h3 className="tech-cat-title">{cat.title}</h3>
              <div className="tech-pills">
                {cat.pills.map((pill) => <span key={pill}>{pill}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
