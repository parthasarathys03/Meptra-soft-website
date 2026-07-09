// Single source of truth for service/intent landing pages.
// Plain ESM so scripts/seo-build.mjs and src/seo/routes.mjs can import it too.
// Types live in landings.d.ts.

/** @type {import('./landings').LandingContent[]} */
export const landings = [
  {
    slug: "online-internship",
    path: "/internships/online",
    accent: "amber",
    image: "/assets/courses.webp",
    imageAlt: "Online internship at Meptrasoft AI Technologies — students working remotely on live products",
    eyebrow: "Online Internship",
    h1: "Online Internship on Real Client Projects",
    subtitle:
      "A fully remote internship where you ship features on live AI products used by real clients — with mentor code reviews, not busywork.",
    intro: [
      "Our online internship is built for students and freshers anywhere in Tamil Nadu and across India who want real software experience without relocating. You work remotely alongside our engineers on the same codebases we ship to paying clients.",
      "Every intern gets a mentor, weekly goals, code reviews on each pull request, and a verifiable certificate on completion. Durations run from one month to a full year depending on your availability and the role.",
    ],
    highlights: [
      { icon: "laptop-code", title: "100% remote", body: "Work from home on real tasks; join stand-ups and reviews online." },
      { icon: "briefcase", title: "Live client products", body: "Ship features to production, not throwaway practice exercises." },
      { icon: "graduate", title: "Mentored 1:1", body: "A senior engineer reviews your code and unblocks you." },
      { icon: "certificate", title: "Real certificate", body: "A completion certificate backed by genuine, reviewable commits." },
    ],
    checklist: [
      "Remote onboarding and a real project brief in week one",
      "Mentor code reviews on every pull request",
      "Experience across frontend, backend, AI, or data — matched to your role",
      "A GitHub history of real contributions recruiters can verify",
      "Completion certificate and a recommendation for strong performers",
    ],
    related: [
      { label: "Paid Internship", to: "/internships/paid" },
      { label: "Free Internship", to: "/internships/free" },
      { label: "AI Internship", to: "/internships/ai" },
      { label: "Web Development Internship", to: "/internships/web-development" },
      { label: "Open internship roles", to: "/careers" },
    ],
    faqs: [
      {
        question: "Is the online internship really remote?",
        answer:
          "Yes — the entire internship is remote. You onboard, get your tasks, attend reviews, and ship your work online. You only need a laptop and a stable internet connection.",
      },
      {
        question: "Do I get a certificate for the online internship?",
        answer:
          "Yes. Every intern who completes the program receives a certificate backed by real, reviewable contributions to live products — not a participation slip.",
      },
      {
        question: "Who can apply for the online internship?",
        answer:
          "College students and freshers of any level. Entry is by a short interview or by strong performance in one of our courses. We match your role to your current skills.",
      },
    ],
    cta: { title: "Apply for the online internship", body: "Tell us your skills and availability — we'll match you to a live project." },
  },
  {
    slug: "paid-internship",
    path: "/internships/paid",
    accent: "amber",
    image: "/assets/career.webp",
    imageAlt: "Paid mentored internship at Meptrasoft AI Technologies",
    eyebrow: "Paid Internship",
    h1: "Paid Internship with 1:1 Mentorship",
    subtitle:
      "Not job-ready yet? Our paid track teaches, guides, and mentors you one-on-one until you can ship real work — the same live products and duration as the free track.",
    intro: [
      "The paid internship is for students who want structured, intensive mentorship. We invest hands-on time teaching you the skills the role needs, then put you on the same real client products as everyone else.",
      "You still get everything the free track offers — real work, code reviews, and a certificate — plus dedicated one-on-one guidance to accelerate you from beginner to contributor.",
    ],
    highlights: [
      { icon: "graduate", title: "Dedicated mentor", body: "One-on-one teaching until you can ship confidently." },
      { icon: "briefcase", title: "Real client work", body: "Same live products and responsibilities as our engineers." },
      { icon: "gauge", title: "Faster ramp-up", body: "Structured plan that takes you from basics to production." },
      { icon: "certificate", title: "Certificate + reference", body: "Proof of work and a reference for strong finishers." },
    ],
    checklist: [
      "One-on-one mentorship tailored to your starting level",
      "Guided path from fundamentals to shipping real features",
      "Work on live client and in-house AI products",
      "Duration from one month to a year",
      "Certificate and recommendation on completion",
    ],
    related: [
      { label: "Free Internship", to: "/internships/free" },
      { label: "Online Internship", to: "/internships/online" },
      { label: "AI Internship", to: "/internships/ai" },
      { label: "Courses", to: "/courses/ai" },
    ],
    faqs: [
      {
        question: "What's the difference between the paid and free internship?",
        answer:
          "The work, duration, and certificate are the same. The paid track adds intensive one-on-one mentorship for students who aren't job-ready yet — we teach you until you can ship.",
      },
      {
        question: "Will I work on real projects in the paid internship?",
        answer:
          "Yes. Once you're ready, you contribute to the same live client and in-house products as our engineers, under mentor supervision.",
      },
    ],
    cta: { title: "Start your paid internship", body: "Get a mentor and a plan that takes you from beginner to shipping." },
  },
  {
    slug: "free-internship",
    path: "/internships/free",
    accent: "amber",
    image: "/assets/courses.webp",
    imageAlt: "Free internship at Meptrasoft AI Technologies for skilled students",
    eyebrow: "Free Internship",
    h1: "Free Internship for Skilled Students",
    subtitle:
      "For talented students — entry by interview or top course performance. Work on real client products with real exposure and a certificate, at no cost.",
    intro: [
      "Our free internship rewards skill. If you can already contribute, clear a short interview or finish near the top of one of our courses and you're in — no fee.",
      "You work on real client products based on current open roles, get mentor reviews, and earn a certificate. It's the same real work as the paid track; the difference is you come in already able to ship.",
    ],
    highlights: [
      { icon: "star", title: "Merit-based entry", body: "Interview or top course performance — no fee." },
      { icon: "briefcase", title: "Real client products", body: "Contribute to production work, not exercises." },
      { icon: "graduate", title: "Mentor reviews", body: "Every PR is reviewed like a junior engineer's." },
      { icon: "certificate", title: "Certificate", body: "Verifiable proof of real contributions." },
    ],
    checklist: [
      "Free entry by interview or course merit",
      "Real client and product tasks from day one",
      "Mentor code reviews on every contribution",
      "Duration from one month to a year",
      "Completion certificate",
    ],
    related: [
      { label: "Paid Internship", to: "/internships/paid" },
      { label: "Online Internship", to: "/internships/online" },
      { label: "AI Internship", to: "/internships/ai" },
      { label: "Placement Training", to: "/placement-training" },
    ],
    faqs: [
      {
        question: "Is the free internship really free?",
        answer:
          "Yes. There's no fee. Entry is merit-based — clear a short interview or perform strongly in one of our courses.",
      },
      {
        question: "Do free interns work on the same projects as paid interns?",
        answer: "Yes — the same live client products, the same mentor reviews, and the same certificate.",
      },
    ],
    cta: { title: "Apply for a free internship", body: "Show us your skills — clear the interview and start on real work." },
  },
  {
    slug: "ai-internship",
    path: "/internships/ai",
    accent: "teal",
    image: "/assets/aiandit.webp",
    imageAlt: "AI internship at Meptrasoft AI Technologies — building RAG, NLP and OCR features",
    eyebrow: "AI Internship",
    h1: "AI Internship — Build Real AI Products",
    subtitle:
      "Work on production AI: RAG pipelines, NLP features, and OCR/document-intelligence systems that real clients use — mentored by engineers who ship them.",
    intro: [
      "This is a hands-on AI internship, not a lecture series. You'll build and improve retrieval-augmented generation (RAG) systems, natural-language features, and document-intelligence pipelines inside our live AI products.",
      "You don't need to be an expert — you need Python basics and drive. Mentors review your work and back you on production issues so you learn how real AI systems are built and shipped.",
    ],
    highlights: [
      { icon: "brain", title: "Generative AI & RAG", body: "Build grounded LLM features on real data." },
      { icon: "robot", title: "NLP & automation", body: "Ship language features and agentic workflows." },
      { icon: "database", title: "Document intelligence", body: "OCR and extraction pipelines in production." },
      { icon: "graduate", title: "Engineer mentorship", body: "Senior AI engineers review every change." },
    ],
    checklist: [
      "Work on live RAG, NLP, and OCR product features",
      "Learn evals, prompt engineering, and fine-tuning in practice",
      "Python-based, mentored, and review-driven",
      "Real commits you can show recruiters",
      "Certificate and reference for strong performers",
    ],
    related: [
      { label: "AI Course", to: "/courses/ai" },
      { label: "Online Internship", to: "/internships/online" },
      { label: "AI & ML Final-Year Projects", to: "/final-year-projects/ai-ml" },
      { label: "AI Engineer roles", to: "/careers" },
    ],
    faqs: [
      {
        question: "What will I build in the AI internship?",
        answer:
          "Real product features — retrieval-augmented generation systems, NLP features, and OCR/document-intelligence pipelines that clients actually use.",
      },
      {
        question: "Do I need prior AI experience?",
        answer:
          "You need Python fundamentals and motivation. We mentor you through the AI-specific skills — RAG, prompting, evals, and deployment — on real tasks.",
      },
    ],
    cta: { title: "Apply for the AI internship", body: "Build production AI with senior engineers reviewing your work." },
  },
  {
    slug: "web-development-internship",
    path: "/internships/web-development",
    accent: "teal",
    image: "/assets/career.webp",
    imageAlt: "Web development internship at Meptrasoft AI Technologies",
    eyebrow: "Web Development Internship",
    h1: "Web Development Internship",
    subtitle:
      "Ship real features on live client and product websites — frontend and backend — under a mentor's guidance. React, JavaScript, APIs, and deployment.",
    intro: [
      "Our web development internship puts you on real websites and web apps, not tutorial to-do lists. You'll work across the frontend and backend of our stack and see your work go live.",
      "You'll grow with modern tools — React, JavaScript/TypeScript, REST APIs, and cloud deployment — with code reviews that treat you like a junior engineer.",
    ],
    highlights: [
      { icon: "code", title: "Frontend & backend", body: "Work across the full web stack on real features." },
      { icon: "rocket", title: "Ship to production", body: "See your code go live on client sites and apps." },
      { icon: "graduate", title: "Reviewed like a pro", body: "Mentor reviews on every pull request." },
      { icon: "certificate", title: "Portfolio + certificate", body: "Real projects for your resume and portfolio." },
    ],
    checklist: [
      "Build features with React and modern JavaScript/TypeScript",
      "Work on real client and in-house web products",
      "Learn APIs, databases, and deployment in practice",
      "Mentor code reviews and Git workflow",
      "Certificate and portfolio-ready work",
    ],
    related: [
      { label: "Full Stack Course", to: "/courses/ai" },
      { label: "Online Internship", to: "/internships/online" },
      { label: "Paid Internship", to: "/internships/paid" },
      { label: "Web developer roles", to: "/careers" },
    ],
    faqs: [
      {
        question: "What tech stack does the web development internship use?",
        answer:
          "Modern web tooling — React, JavaScript/TypeScript, REST APIs, databases, and cloud deployment — the same stack we build client products on.",
      },
      {
        question: "Will my work actually go live?",
        answer: "Yes. Interns ship real features to live client and product websites, reviewed by a mentor before release.",
      },
    ],
    cta: { title: "Apply for the web development internship", body: "Ship real web features and build a portfolio recruiters trust." },
  },
  {
    slug: "ai-course",
    path: "/courses/ai",
    accent: "amber",
    image: "/assets/courses.webp",
    imageAlt: "AI course at Meptrasoft AI Technologies — Generative AI, machine learning, and agents",
    eyebrow: "AI Course",
    h1: "AI Course — Generative AI, ML & Agents",
    subtitle:
      "A hands-on AI course in Tamil and English. Learn LLMs, RAG, machine learning, and AI agents by building and deploying a real application — not slides.",
    intro: [
      "This AI course takes you from foundations to shipping working AI. You'll cover machine learning basics, generative AI, retrieval-augmented generation, prompt engineering, and autonomous agents, all through hands-on projects.",
      "Taught in Tamil and English with mentor support, the course ends with a deployed AI application you can put on your resume. It pairs naturally with an AI internship for real product experience.",
    ],
    highlights: [
      { icon: "brain", title: "Generative AI & LLMs", body: "Prompting, RAG, and fine-tuning in practice." },
      { icon: "chart", title: "Machine learning", body: "Train, evaluate, and deploy real models." },
      { icon: "robot", title: "AI agents", body: "Build agents that plan, use tools, and act." },
      { icon: "graduate", title: "Ship a real app", body: "Finish with a deployed AI project." },
    ],
    checklist: [
      "ML foundations through model training and deployment",
      "Generative AI: LLMs, RAG, prompt engineering, evals",
      "Agentic AI: tool use and autonomous workflows",
      "Taught in Tamil & English with mentor support",
      "A deployed AI application for your portfolio",
    ],
    related: [
      { label: "Python Course", to: "/courses/python" },
      { label: "AI Internship", to: "/internships/ai" },
      { label: "AI & ML Projects", to: "/final-year-projects/ai-ml" },
      { label: "All courses", to: "/learn" },
    ],
    faqs: [
      {
        question: "Is the AI course beginner-friendly?",
        answer:
          "Yes. It starts from foundations and builds up. Python basics help, and our Python course is a good starting point if you're new.",
      },
      {
        question: "What will I build in the AI course?",
        answer:
          "A real, deployed AI application — typically an LLM/RAG app — plus smaller machine-learning and agent projects along the way.",
      },
      {
        question: "Is the AI course taught in Tamil?",
        answer: "Yes, it's taught in both Tamil and English, with mentor support throughout.",
      },
    ],
    cta: { title: "Enroll in the AI course", body: "Learn AI by building and deploying real applications." },
  },
  {
    slug: "python-course",
    path: "/courses/python",
    accent: "amber",
    image: "/assets/courses.webp",
    imageAlt: "Python course at Meptrasoft AI Technologies — from fundamentals to real projects",
    eyebrow: "Python Course",
    h1: "Python Course — From Basics to Real Projects",
    subtitle:
      "Learn Python the practical way: fundamentals, automation, data, and real-world projects. Taught in Tamil and English — the best first language for AI and jobs.",
    intro: [
      "Python is the best first language for a software or AI career, and this course takes you from zero to building real things. You'll master syntax, data structures, and problem-solving, then apply them to automation, data, and small applications.",
      "With mentor support and hands-on projects, you finish able to write real Python — the foundation for our AI, data, and machine-learning tracks.",
    ],
    highlights: [
      { icon: "code", title: "Solid fundamentals", body: "Syntax, data structures, and clean problem-solving." },
      { icon: "gauge", title: "Automation", body: "Automate real tasks with scripts and libraries." },
      { icon: "chart", title: "Data & projects", body: "Work with data and build small applications." },
      { icon: "graduate", title: "Interview-ready", body: "Coding practice that prepares you for placements." },
    ],
    checklist: [
      "Python fundamentals and problem-solving",
      "Data structures and clean coding practice",
      "Automation and real mini-projects",
      "A launchpad into AI, ML, and data courses",
      "Taught in Tamil & English with mentor support",
    ],
    related: [
      { label: "AI Course", to: "/courses/ai" },
      { label: "AI & ML Projects", to: "/final-year-projects/ai-ml" },
      { label: "Placement Training", to: "/placement-training" },
      { label: "All courses", to: "/learn" },
    ],
    faqs: [
      {
        question: "Do I need any prior coding experience for the Python course?",
        answer: "No. The course starts from absolute basics and builds to real projects, with mentor support throughout.",
      },
      {
        question: "Will the Python course help with placements?",
        answer:
          "Yes. Python fundamentals and coding practice are core to coding-round preparation. Pair it with our placement training for interview readiness.",
      },
    ],
    cta: { title: "Enroll in the Python course", body: "Start with the best first language for AI and jobs." },
  },
  {
    slug: "final-year-projects",
    path: "/final-year-projects",
    accent: "amber",
    image: "/assets/about.webp",
    imageAlt: "Final-year and college projects at Meptrasoft AI Technologies — IEEE and custom AI projects",
    eyebrow: "Final-Year & College Projects",
    h1: "Final-Year Projects & College Projects",
    subtitle:
      "Original, IEEE-standard and custom projects for final-year and college students — modern AI, ML, and deep-learning projects you can actually defend, never recycled dumps.",
    intro: [
      "We build real final-year and college projects around current-year, industry-standard problem statements — not copied GitHub repos everyone in your batch also has. Every project is original and scoped to your requirement and domain.",
      "Choose IEEE-based problems or a fully custom build across web, mobile, AI, and data. We support you through the code, documentation, and paper so you can present and defend your project with confidence.",
    ],
    highlights: [
      { icon: "star", title: "IEEE & current-year", body: "Real, industry-standard problem statements." },
      { icon: "brain", title: "Modern AI/ML/DL", body: "AI, machine-learning, and deep-learning projects." },
      { icon: "pen-ruler", title: "Custom & original", body: "Scoped to you — never a recycled dump." },
      { icon: "graduate", title: "Docs & viva support", body: "Report, paper, and defense preparation." },
    ],
    checklist: [
      "IEEE-based or fully custom project builds",
      "Modern AI, ML, and deep-learning projects",
      "Web, mobile, and data domains covered",
      "Source code, documentation, and paper guidance",
      "Viva/defense preparation and a working demo",
    ],
    related: [
      { label: "AI & ML Projects", to: "/final-year-projects/ai-ml" },
      { label: "Deep Learning Projects", to: "/final-year-projects/deep-learning" },
      { label: "AI Course", to: "/courses/ai" },
      { label: "Industrial Training", to: "/industrial-training" },
    ],
    faqs: [
      {
        question: "Are the final-year projects original?",
        answer:
          "Yes. Every project is built fresh around current-year problem statements and scoped to you — never a recycled dump shared across a batch.",
      },
      {
        question: "Do you help with the project report and viva?",
        answer:
          "Yes. We support the source code, documentation, and IEEE paper, and prepare you to present and defend the project in your viva.",
      },
      {
        question: "What kinds of projects can you build?",
        answer:
          "IEEE-standard or custom projects across AI, machine learning, deep learning, web, mobile, and data — all original and demo-ready.",
      },
    ],
    cta: { title: "Get your final-year project", body: "Tell us your domain and we'll scope an original, defendable project." },
  },
  {
    slug: "final-year-projects-ai-ml",
    path: "/final-year-projects/ai-ml",
    accent: "teal",
    image: "/assets/aiandit.webp",
    imageAlt: "AI and machine-learning final-year projects at Meptrasoft AI Technologies",
    eyebrow: "AI & ML Projects",
    h1: "AI & Machine Learning Final-Year Projects",
    subtitle:
      "Modern AI and machine-learning projects for final-year students — real datasets, real models, and results you can explain and defend.",
    intro: [
      "These are genuine AI and machine-learning projects: you'll work with real datasets, train and evaluate models, and ship a working demo. We pick current, industry-relevant problems so your project stands out.",
      "From classification and prediction to recommendation, NLP, and computer vision, we scope a project to your interest and support the code, report, and viva.",
    ],
    highlights: [
      { icon: "chart", title: "Real datasets", body: "Train and evaluate on genuine data, not toy sets." },
      { icon: "brain", title: "Modern models", body: "Classification, NLP, CV, recommendation, and more." },
      { icon: "pen-ruler", title: "Original scope", body: "Built for your domain and interest." },
      { icon: "graduate", title: "Explainable results", body: "You can present and defend every step." },
    ],
    checklist: [
      "Machine-learning projects with real datasets",
      "Model training, evaluation, and a working demo",
      "NLP, computer vision, prediction, or recommendation",
      "Source code and documentation",
      "Viva and paper support",
    ],
    related: [
      { label: "Deep Learning Projects", to: "/final-year-projects/deep-learning" },
      { label: "All Final-Year Projects", to: "/final-year-projects" },
      { label: "AI Course", to: "/courses/ai" },
      { label: "AI Internship", to: "/internships/ai" },
    ],
    faqs: [
      {
        question: "Do AI/ML projects use real data?",
        answer: "Yes — we build on genuine datasets and train real models, so your results and demo are meaningful.",
      },
      {
        question: "Can you match the project to my interest area?",
        answer: "Yes. Tell us your domain — NLP, vision, prediction, recommendation — and we scope an original project around it.",
      },
    ],
    cta: { title: "Start your AI/ML project", body: "Pick a domain and we'll build a real, defendable ML project." },
  },
  {
    slug: "final-year-projects-deep-learning",
    path: "/final-year-projects/deep-learning",
    accent: "teal",
    image: "/assets/aiandit.webp",
    imageAlt: "Deep-learning final-year projects at Meptrasoft AI Technologies",
    eyebrow: "Deep Learning Projects",
    h1: "Deep Learning Final-Year Projects",
    subtitle:
      "Deep-learning projects with real neural networks — computer vision, NLP, and generative models — built, trained, and demo-ready.",
    intro: [
      "Take on a serious deep-learning project: convolutional networks for vision, transformers for language, or generative models — trained on real data with a working demo at the end.",
      "We scope the problem, guide the architecture and training, and support your report and viva so the project is both impressive and genuinely yours.",
    ],
    highlights: [
      { icon: "brain", title: "Neural networks", body: "CNNs, transformers, and generative models." },
      { icon: "chart", title: "Trained on real data", body: "Meaningful training and evaluation." },
      { icon: "rocket", title: "Working demo", body: "A runnable, presentable result." },
      { icon: "graduate", title: "Report & viva support", body: "Documentation and defense preparation." },
    ],
    checklist: [
      "Deep-learning projects in vision, NLP, or generation",
      "Real neural-network training and evaluation",
      "A working, demo-ready build",
      "Source code and documentation",
      "Paper and viva support",
    ],
    related: [
      { label: "AI & ML Projects", to: "/final-year-projects/ai-ml" },
      { label: "All Final-Year Projects", to: "/final-year-projects" },
      { label: "AI Course", to: "/courses/ai" },
      { label: "AI Internship", to: "/internships/ai" },
    ],
    faqs: [
      {
        question: "Are deep-learning projects too advanced for final year?",
        answer:
          "Not with guidance. We scope the problem to your level and mentor you through architecture, training, and evaluation so it's achievable and impressive.",
      },
      {
        question: "Which frameworks do you use?",
        answer: "Typically PyTorch or TensorFlow, chosen to fit the project — with full code and documentation handed over.",
      },
    ],
    cta: { title: "Start your deep-learning project", body: "Build and train a real neural-network project with mentor support." },
  },
  {
    slug: "placement-training",
    path: "/placement-training",
    accent: "amber",
    image: "/assets/courses.webp",
    imageAlt: "Placement training at Meptrasoft AI Technologies — aptitude, coding, technical and HR interviews",
    eyebrow: "Placement Training",
    h1: "Placement Training That Gets You Hired",
    subtitle:
      "A complete placement preparation program — aptitude, coding, communication, technical, and HR interviews — with mentor support that continues until you're placed.",
    intro: [
      "This isn't a syllabus, it's a placement roadmap. Each stage builds on the last: aptitude, coding, communication and group discussion, the technical interview, and the HR round — with mock rounds for every stage.",
      "You get live mentor-led classes, weekly assessments, real mock interviews, and continuous feedback. Support continues until your college ends and you're placed. Everything a fresher needs to crack the first IT job.",
    ],
    highlights: [
      { icon: "chart", title: "Aptitude & coding", body: "Quant, logical reasoning, and coding rounds." },
      { icon: "users", title: "Communication & GD", body: "Spoken English, group discussion, and presentation." },
      { icon: "code", title: "Technical interview", body: "DSA, core subjects, and project defense." },
      { icon: "graduate", title: "HR interview", body: "Behavioral prep, resume, and confidence building." },
    ],
    checklist: [
      "Live mentor-led classes in Tamil & English",
      "Mock aptitude, coding, technical, and HR interviews",
      "Weekly assessments and continuous feedback",
      "Resume, portfolio, and communication preparation",
      "Support that continues until you're placed",
    ],
    related: [
      { label: "Python Course", to: "/courses/python" },
      { label: "AI Course", to: "/courses/ai" },
      { label: "Online Internship", to: "/internships/online" },
      { label: "All programs", to: "/learn" },
    ],
    faqs: [
      {
        question: "How long is the placement training program?",
        answer:
          "The core program runs about six months, with mentor support continuing until your college ends and you're placed.",
      },
      {
        question: "What does placement training cover?",
        answer:
          "Aptitude, coding, communication and group discussion, the technical interview, and the HR round — each with mock rounds and feedback.",
      },
      {
        question: "Is placement training available online?",
        answer: "Yes. Classes are live and mentor-led, delivered online in Tamil and English.",
      },
    ],
    cta: { title: "Join placement training", body: "Follow a proven roadmap from aptitude to your first job offer." },
  },
  {
    slug: "industrial-training",
    path: "/industrial-training",
    accent: "navy",
    image: "/assets/career.webp",
    imageAlt: "Industrial training at Meptrasoft AI Technologies — hands-on, certificate-backed",
    eyebrow: "Industrial Training",
    h1: "Industrial Training & Certifications",
    subtitle:
      "Hands-on industrial training, workshops, and industrial-visit certifications — from a single day to a month — backed by us and our partners.",
    intro: [
      "Industrial training bridges the gap between college and industry. Our short, hands-on programs give you real exposure to how software and AI products are built, with a recognized certificate at the end.",
      "Choose workshops, industrial visits, or short internship-style certifications lasting from one day to a month. Ideal for meeting college training requirements with genuine, practical learning.",
    ],
    highlights: [
      { icon: "briefcase", title: "Hands-on", body: "Practical exposure to real tools and workflows." },
      { icon: "clock", title: "Flexible duration", body: "From a single day to a full month." },
      { icon: "certificate", title: "Recognized certificate", body: "Backed by us and our partners." },
      { icon: "users", title: "Workshops & IV", body: "Workshops and industrial-visit options." },
    ],
    checklist: [
      "Short, hands-on industrial training programs",
      "Workshops and industrial-visit certifications",
      "Duration from one day to one month",
      "Practical exposure to real product workflows",
      "Recognized completion certificate",
    ],
    related: [
      { label: "Online Internship", to: "/internships/online" },
      { label: "Final-Year Projects", to: "/final-year-projects" },
      { label: "Placement Training", to: "/placement-training" },
      { label: "All programs", to: "/learn" },
    ],
    faqs: [
      {
        question: "How long does industrial training last?",
        answer: "Programs run from a single day to a month, depending on the workshop or certification you choose.",
      },
      {
        question: "Do I get a certificate for industrial training?",
        answer: "Yes — a recognized completion certificate backed by us and our partners.",
      },
    ],
    cta: { title: "Book industrial training", body: "Get hands-on exposure and a recognized certificate, fast." },
  },
  {
    slug: "data-science-course",
    path: "/courses/data-science",
    accent: "amber",
    image: "/assets/courses.webp",
    imageAlt: "Data Science course at Meptrasoft AI Technologies — Python, statistics, ML and real datasets",
    eyebrow: "Data Science Course",
    h1: "Data Science Course — Python, ML & Real Data",
    subtitle:
      "A hands-on data science course in Tamil and English: Python, statistics, SQL, machine learning, and visualization — built around real datasets and a portfolio project.",
    intro: [
      "This data science course turns raw data into decisions. You'll learn Python for data, statistics, SQL, data cleaning, visualization, and machine learning — the exact workflow analysts and data scientists use on the job.",
      "You finish with a real, deployed analysis or model you can defend in interviews. Mentor support runs throughout, and the course pairs naturally with our AI course and internships.",
    ],
    highlights: [
      { icon: "chart", title: "Statistics & Python", body: "The maths and tooling data science actually needs." },
      { icon: "database", title: "SQL & data wrangling", body: "Clean, join, and query real datasets." },
      { icon: "brain", title: "Machine learning", body: "Train and evaluate models that predict." },
      { icon: "graduate", title: "Portfolio project", body: "A real analysis you can show recruiters." },
    ],
    checklist: [
      "Python for data analysis (pandas, NumPy)",
      "Statistics, probability, and hypothesis testing",
      "SQL and data cleaning on real datasets",
      "Machine learning and model evaluation",
      "Data visualization and a portfolio project",
    ],
    related: [
      { label: "AI Course", to: "/courses/ai" },
      { label: "Python Course", to: "/courses/python" },
      { label: "AI & ML Projects", to: "/final-year-projects/ai-ml" },
      { label: "All courses", to: "/learn" },
    ],
    faqs: [
      {
        question: "Do I need maths for the data science course?",
        answer:
          "We teach the statistics you need from the ground up. Comfort with basic maths helps, but the course builds the rest with practical examples.",
      },
      {
        question: "What will I build in the data science course?",
        answer: "A real end-to-end analysis or machine-learning model on genuine data — a portfolio piece you can explain in interviews.",
      },
    ],
    cta: { title: "Enroll in the data science course", body: "Learn to turn real data into models and decisions." },
  },
  {
    slug: "web-development-course",
    path: "/courses/web-development",
    accent: "amber",
    image: "/assets/courses.webp",
    imageAlt: "Web Development course at Meptrasoft AI Technologies — full-stack, React, and deployment",
    eyebrow: "Web Development Course",
    h1: "Web Development Course — Full Stack, Job-Ready",
    subtitle:
      "Learn front-end to back-end web development: HTML, CSS, JavaScript, React, APIs, databases, and deployment — and ship real web apps for your portfolio.",
    intro: [
      "This full-stack web development course takes you from the basics to deploying real applications. You'll build responsive front-ends with React, back-ends with APIs and databases, and ship them live.",
      "Taught in Tamil and English with mentor code reviews, the course ends with deployed projects on your resume — and a direct path into our web development internship.",
    ],
    highlights: [
      { icon: "code", title: "Front-end", body: "HTML, CSS, JavaScript, and React." },
      { icon: "pipeline", title: "Back-end", body: "APIs, databases, and authentication." },
      { icon: "rocket", title: "Deployment", body: "Ship apps live with modern tooling." },
      { icon: "graduate", title: "Real projects", body: "Portfolio-ready web apps you built." },
    ],
    checklist: [
      "HTML, CSS, and modern JavaScript/TypeScript",
      "React front-end development",
      "APIs, databases, and back-end basics",
      "Git, deployment, and performance",
      "Deployed portfolio projects",
    ],
    related: [
      { label: "Web Development Internship", to: "/internships/web-development" },
      { label: "Python Course", to: "/courses/python" },
      { label: "Final-Year Projects", to: "/final-year-projects" },
      { label: "All courses", to: "/learn" },
    ],
    faqs: [
      {
        question: "Is the web development course full stack?",
        answer: "Yes — it covers both front-end (HTML, CSS, JavaScript, React) and back-end (APIs, databases, deployment).",
      },
      {
        question: "Will I build real projects?",
        answer: "Yes. You finish with deployed web apps for your portfolio, and can continue on our web development internship.",
      },
    ],
    cta: { title: "Enroll in the web development course", body: "Go from basics to shipping full-stack web apps." },
  },
  {
    slug: "generative-ai-training",
    path: "/courses/generative-ai",
    accent: "teal",
    image: "/assets/aiandit.webp",
    imageAlt: "Generative AI training at Meptrasoft AI Technologies — LLMs, RAG, prompting and agents",
    eyebrow: "Generative AI Training",
    h1: "Generative AI Training — LLMs, RAG & Agents",
    subtitle:
      "Hands-on generative AI training: large language models, prompt engineering, retrieval-augmented generation (RAG), fine-tuning, and AI agents — build and deploy a real GenAI app.",
    intro: [
      "Generative AI is the most in-demand skill in tech right now. This training takes you deep into large language models, prompt engineering, RAG, evaluation, and autonomous agents — the exact stack we use to build client AI products.",
      "You'll build and deploy a working generative-AI application, mentored by engineers who ship these systems. Ideal after our AI or Python course, and a direct route into an AI internship.",
    ],
    highlights: [
      { icon: "brain", title: "LLMs & prompting", body: "Work with modern models and prompt design." },
      { icon: "database", title: "RAG", body: "Ground answers in your own data." },
      { icon: "robot", title: "AI agents", body: "Build agents that plan and use tools." },
      { icon: "gauge", title: "Evals & deploy", body: "Measure quality and ship to production." },
    ],
    checklist: [
      "Large language models and prompt engineering",
      "Retrieval-augmented generation (RAG)",
      "Fine-tuning and evaluation",
      "Building autonomous AI agents",
      "A deployed generative-AI application",
    ],
    related: [
      { label: "AI Course", to: "/courses/ai" },
      { label: "AI Internship", to: "/internships/ai" },
      { label: "Data Science Course", to: "/courses/data-science" },
      { label: "All courses", to: "/learn" },
    ],
    faqs: [
      {
        question: "What's the difference between the AI course and generative AI training?",
        answer:
          "The AI course covers machine learning through generative AI broadly. Generative AI training goes deeper on LLMs, RAG, fine-tuning, and agents specifically.",
      },
      {
        question: "Do I need experience before generative AI training?",
        answer: "Python basics help. If you're new, start with our Python or AI course, then move into generative AI training.",
      },
    ],
    cta: { title: "Start generative AI training", body: "Master LLMs, RAG, and agents by building a real app." },
  },
  {
    slug: "software-internship",
    path: "/internships/software",
    accent: "teal",
    image: "/assets/career.webp",
    imageAlt: "Software internship at Meptrasoft AI Technologies — real engineering on live products",
    eyebrow: "Software Internship",
    h1: "Software Internship — Real Engineering Experience",
    subtitle:
      "A software engineering internship on live products — frontend, backend, AI, or data. Real tasks, mentor code reviews, Git workflow, and a certificate that means something.",
    intro: [
      "This software internship gives you genuine engineering experience: you join a real codebase, pick up real tasks, and ship them through pull requests reviewed by senior engineers — the way software is actually built.",
      "We match you to frontend, backend, AI, or data work based on your skills. Remote, mentored, and available as free (merit-based) or paid (with intensive teaching) tracks.",
    ],
    highlights: [
      { icon: "code", title: "Real codebases", body: "Contribute to live products, not exercises." },
      { icon: "pipeline", title: "Git & reviews", body: "Pull requests and professional workflow." },
      { icon: "laptop-code", title: "Your track", body: "Frontend, backend, AI, or data." },
      { icon: "certificate", title: "Real certificate", body: "Backed by verifiable commits." },
    ],
    checklist: [
      "Work on live software products",
      "Professional Git and code-review workflow",
      "Matched to frontend, backend, AI, or data",
      "Remote, mentored, flexible duration",
      "Certificate and reference for strong performers",
    ],
    related: [
      { label: "Online Internship", to: "/internships/online" },
      { label: "AI Internship", to: "/internships/ai" },
      { label: "Web Development Internship", to: "/internships/web-development" },
      { label: "Open roles", to: "/careers" },
    ],
    faqs: [
      {
        question: "What kind of software work will I do in the internship?",
        answer: "Frontend, backend, AI, or data engineering — matched to your skills — on real, live products under mentor supervision.",
      },
      {
        question: "Is the software internship paid or free?",
        answer: "Both tracks exist: a merit-based free track and a paid track with intensive one-on-one mentorship if you're not job-ready yet.",
      },
    ],
    cta: { title: "Apply for the software internship", body: "Get real engineering experience on live products." },
  },
  {
    slug: "college-projects",
    path: "/college-projects",
    accent: "amber",
    image: "/assets/about.webp",
    imageAlt: "College projects at Meptrasoft AI Technologies — original mini and major projects for all years",
    eyebrow: "College Projects",
    h1: "College Projects — Original & Fully Supported",
    subtitle:
      "Mini and major college projects for every year and department — original builds across AI, ML, web, mobile, and data, with code, documentation, and viva support.",
    intro: [
      "Not just final year — we build original college projects for every semester and department. Whether it's a mini project, a review submission, or a major project, you get a genuine build scoped to your requirement.",
      "Every project is original (never a recycled dump), covers modern tech like AI and machine learning where relevant, and comes with source code, documentation, and support to present it confidently.",
    ],
    highlights: [
      { icon: "pen-ruler", title: "Any year, any dept", body: "Mini and major projects, all departments." },
      { icon: "brain", title: "Modern tech", body: "AI, ML, web, mobile, and data." },
      { icon: "star", title: "Original builds", body: "Scoped to you — never recycled." },
      { icon: "graduate", title: "Docs & viva", body: "Report, documentation, and defense help." },
    ],
    checklist: [
      "Mini and major projects for all years",
      "AI, ML, web, mobile, and data domains",
      "Original, plagiarism-free builds",
      "Source code and documentation",
      "Review and viva preparation",
    ],
    related: [
      { label: "Final-Year Projects", to: "/final-year-projects" },
      { label: "AI & ML Projects", to: "/final-year-projects/ai-ml" },
      { label: "Deep Learning Projects", to: "/final-year-projects/deep-learning" },
      { label: "Industrial Training", to: "/industrial-training" },
    ],
    faqs: [
      {
        question: "Do you build mini projects too, or only final-year projects?",
        answer: "Both. We build mini projects, review submissions, and major projects for every year and department — all original.",
      },
      {
        question: "Will my college project be original?",
        answer: "Yes — every project is built fresh and scoped to your requirement, with source code and documentation you can defend.",
      },
    ],
    cta: { title: "Get your college project", body: "Tell us your year, department, and idea — we'll build it original." },
  },
];

const bySlug = new Map(landings.map((l) => [l.slug, l]));
export const getLanding = (slug) => bySlug.get(slug);
