import { Github, LinkedinOption, ChatOption } from 'grommet-icons';

export default function Footer() {
  const handleAnchorClick = (e, href) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const linkCls = 'text-[0.9rem] text-[rgba(255,255,255,0.7)] transition duration-[400ms] ease-smooth hover:translate-x-1 hover:text-white max-[768px]:hover:translate-x-0';

  return (
    <footer className="relative overflow-hidden bg-gradient-footer pt-20 pb-10 text-white before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] before:content-['']">
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-14 grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-14 max-[1280px]:min-[1025px]:grid-cols-[2fr_1fr_1fr_1fr] max-[1280px]:min-[1025px]:gap-8 max-[1024px]:grid-cols-2 max-[1024px]:gap-8 max-[768px]:grid-cols-1 max-[768px]:gap-8 max-[768px]:[&>*]:text-center">
          <div>
            <img src="/assets/logo.svg" alt="Meptrasoft" className="mb-5 h-20 [filter:brightness(0)_invert(1)] max-[768px]:mx-auto max-[768px]:block max-[480px]:h-14" />
            <p className="max-w-[320px] text-[0.9rem] leading-[1.8] text-[rgba(255,255,255,0.75)] max-[768px]:text-center">Building AI-powered products, training the next generation of engineers, and providing real-world project experience.</p>
          </div>
          <div>
            <h4 className="mb-5 text-[0.9rem] font-bold uppercase tracking-[0.06em] text-white">Products</h4>
            <ul className="flex flex-col gap-3.5 max-[768px]:items-center">
              <li><a className={linkCls} href="#products" onClick={(e) => handleAnchorClick(e, '#products')}>AI Exam Platform</a></li>
              <li><a className={linkCls} href="#products" onClick={(e) => handleAnchorClick(e, '#products')}>Placement Platform</a></li>
              <li><a className={linkCls} href="#products" onClick={(e) => handleAnchorClick(e, '#products')}>Document Intelligence</a></li>
              <li><a className={linkCls} href="#products" onClick={(e) => handleAnchorClick(e, '#products')}>Analytics Platform</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-[0.9rem] font-bold uppercase tracking-[0.06em] text-white">Programs</h4>
            <ul className="flex flex-col gap-3.5 max-[768px]:items-center">
              <li><a className={linkCls} href="#training" onClick={(e) => handleAnchorClick(e, '#training')}>Training Programs</a></li>
              <li><a className={linkCls} href="#courses" onClick={(e) => handleAnchorClick(e, '#courses')}>Professional Courses</a></li>
              <li><a className={linkCls} href="#internship" onClick={(e) => handleAnchorClick(e, '#internship')}>Internships</a></li>
              <li><a className={linkCls} href="#projects" onClick={(e) => handleAnchorClick(e, '#projects')}>Final Year Projects</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-[0.9rem] font-bold uppercase tracking-[0.06em] text-white">Company</h4>
            <ul className="flex flex-col gap-3.5 max-[768px]:items-center">
              <li><a className={linkCls} href="#about" onClick={(e) => handleAnchorClick(e, '#about')}>About Us</a></li>
              <li><a className={linkCls} href="#career" onClick={(e) => handleAnchorClick(e, '#career')}>Careers</a></li>
              <li><a className={linkCls} href="#services" onClick={(e) => handleAnchorClick(e, '#services')}>Solutions</a></li>
              <li><a className={linkCls} href="#register" onClick={(e) => handleAnchorClick(e, '#register')}>Register / Apply</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-[0.9rem] font-bold uppercase tracking-[0.06em] text-white">Connect</h4>
            <ul className="flex flex-col gap-3.5 max-[768px]:items-center">
              <li><a className={linkCls} href="#contact" onClick={(e) => handleAnchorClick(e, '#contact')}>Contact Us</a></li>
              <li><a className={linkCls} href="https://wa.me/919345984804" target="_blank" rel="noopener noreferrer"><ChatOption size="small" /> WhatsApp</a></li>
              <li><a className={linkCls} href="#"><LinkedinOption size="small" /> LinkedIn</a></li>
              <li><a className={linkCls} href="#"><Github size="small" /> GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.15)] pt-7 max-[768px]:flex-col max-[768px]:gap-2 max-[768px]:text-center">
          <p className="text-[0.8rem] text-[rgba(255,255,255,0.6)]">&copy; 2026 Meptrasoft AI Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
