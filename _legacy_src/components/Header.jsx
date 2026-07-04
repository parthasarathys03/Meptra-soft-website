import { useState, useEffect } from 'react';

const navItems = [
  { href: '#hero', label: 'Home' },
  { href: '#products', label: 'Products' },
  { href: '#services', label: 'Solutions' },
  { href: '#training', label: 'Training' },
  { href: '#courses', label: 'Courses' },
  { href: '#internship', label: 'Internships' },
  { href: '#projects', label: 'Final Year Projects' },
  { href: '#career', label: 'Careers' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ratios = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target.id, entry.intersectionRatio));
        let topId = null;
        let max = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > max) { max = ratio; topId = id; }
        });
        if (topId) setActiveSection(topId);
      },
      { threshold: [0.1, 0.25, 0.5, 0.75, 1] }
    );

    // Sections below the hero are React.lazy, so they mount after this effect
    // runs. Observe whatever exists now, and pick up the rest as they appear.
    const observed = new Set();
    const observeAll = () => {
      document.querySelectorAll('section[id]').forEach((s) => {
        if (!observed.has(s)) { observed.add(s); observer.observe(s); }
      });
    };
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { observer.disconnect(); mo.disconnect(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  const headerWrapCls =
    'fixed left-0 right-0 top-0 z-[1000] px-8 transition duration-[400ms] ease-smooth max-[1024px]:px-4 max-[1024px]:py-2.5 max-[768px]:px-2.5 max-[768px]:py-1.5 max-[480px]:px-2 max-[480px]:py-1 ' +
    (scrolled ? 'py-1.5' : 'py-3');

  const headerCls = scrolled
    ? 'mx-auto flex max-w-[1400px] items-center justify-between gap-2 rounded-[60px] border-[1.5px] border-[rgba(255,255,255,0.7)] bg-[rgba(255,255,255,0.6)] px-7 py-1 [backdrop-filter:blur(32px)_saturate(1.8)] [-webkit-backdrop-filter:blur(32px)_saturate(1.8)] shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_1px_rgba(255,255,255,0.3)] transition duration-[400ms] ease-smooth max-[1280px]:min-[1025px]:px-4 max-[1280px]:min-[1025px]:py-1 max-[1024px]:px-5 max-[1024px]:py-2.5 max-[768px]:gap-1.5 max-[768px]:px-[14px] max-[768px]:py-[3px] max-[480px]:gap-1 max-[480px]:px-3 max-[480px]:py-[3px]'
    : 'mx-auto flex max-w-[1400px] items-center justify-between gap-2 rounded-[60px] border-0 bg-transparent px-7 py-2 shadow-none transition duration-[400ms] ease-smooth max-[1280px]:min-[1025px]:px-4 max-[1280px]:min-[1025px]:py-1.5 max-[1024px]:px-5 max-[1024px]:py-2.5 max-[768px]:gap-1.5 max-[768px]:px-3 max-[768px]:py-1.5 max-[480px]:gap-1 max-[480px]:px-2.5 max-[480px]:py-[5px]';

  const logoImgCls =
    'block h-auto w-[148px] transition duration-[400ms] ease-smooth max-[1280px]:min-[1025px]:w-[130px] max-[768px]:w-[110px] max-[480px]:w-24 ' +
    (scrolled ? '[filter:none]' : '[filter:brightness(0)_invert(1)]');

  const navLinkCls = (active) => {
    const base =
      'rounded-pill whitespace-nowrap font-medium transition duration-[400ms] ease-smooth';
    if (scrolled) {
      return (
        base +
        ' px-[9px] py-1.5 text-[0.78rem] max-[1280px]:min-[1025px]:px-1.5 max-[1280px]:min-[1025px]:py-[5px] max-[1280px]:min-[1025px]:text-[0.74rem] ' +
        (active
          ? 'bg-navy text-white'
          : 'text-text-body hover:bg-[rgba(15,47,80,0.05)] hover:text-navy')
      );
    }
    return (
      base +
      ' px-3 py-2 text-[0.88rem] max-[1280px]:min-[1025px]:px-[7px] max-[1280px]:min-[1025px]:py-1.5 max-[1280px]:min-[1025px]:text-[0.78rem] ' +
      (active
        ? 'bg-[rgba(255,255,255,0.2)] font-semibold text-white'
        : 'text-[rgba(255,255,255,0.85)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white')
    );
  };

  const toggleSpanCls =
    'h-0.5 w-6 rounded-[2px] transition duration-[400ms] ease-smooth ' +
    (scrolled ? 'bg-text-dark' : 'bg-text-dark max-[1024px]:bg-white');

  return (
    <>
      <div className={headerWrapCls} id="header">
        <header className={headerCls}>
          <a href="#" className="flex shrink-0 items-center" onClick={(e) => handleAnchorClick(e, '#hero')}>
            <img src="/assets/logo.svg" alt="Meptrasoft AI Technologies" className={logoImgCls} />
          </a>
          <ul className="flex items-center gap-1 max-[1280px]:min-[1025px]:gap-[2px] max-[1024px]:hidden">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className={navLinkCls(activeSection === href.slice(1))}
                  onClick={(e) => handleAnchorClick(e, href)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#register"
            className="shrink-0 whitespace-nowrap rounded-pill bg-orange px-5 py-2 text-[0.82rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-px hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_16px_rgba(232,116,74,0.15)] max-[1280px]:min-[1025px]:px-[14px] max-[1280px]:min-[1025px]:py-[7px] max-[1280px]:min-[1025px]:text-[0.78rem] max-[1024px]:hidden"
            onClick={(e) => handleAnchorClick(e, '#register')}
          >
            Register / Apply
          </a>
          <button
            className="hidden cursor-pointer flex-col gap-[5px] border-none bg-transparent p-1 max-[1024px]:flex max-[480px]:h-8 max-[480px]:w-8 max-[480px]:p-1.5"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className={toggleSpanCls} /><span className={toggleSpanCls} /><span className={toggleSpanCls} />
          </button>
        </header>
      </div>

      <div className={`fixed inset-0 z-[999] items-center justify-center bg-[rgba(255,255,255,0.98)] [backdrop-filter:blur(20px)] ${mobileOpen ? 'flex' : 'hidden'}`}>
        <button className="absolute right-6 top-5 cursor-pointer border-none bg-transparent p-2 text-[2rem] leading-none text-text-dark" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
          &times;
        </button>
        <ul className="flex flex-col items-center gap-6 max-[768px]:gap-[18px]">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className="text-[1.25rem] font-medium text-text-dark transition duration-[400ms] ease-smooth hover:text-teal max-[768px]:text-[1.1rem]" onClick={(e) => handleAnchorClick(e, href)}>{label}</a>
            </li>
          ))}
          <li>
            <a href="#register" className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)]" onClick={(e) => handleAnchorClick(e, '#register')}>
              Register / Apply
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
