import type {
  NavGroup,
  Offering,
  Product,
  Stat,
  LoopStep,
  Testimonial,
  Role,
  Faq,
  Office,
} from "@/lib/types";

export const site = {
  name: "Meptrasoft AI",
  full: "Meptrasoft AI Technologies",
  tagline: "AI Products × Engineering Education",
  whatsapp: "https://wa.me/918668126216",
  email: "hr@meptrasoft.ai",
  /** Job applications route here — intentionally not rendered as visible text anywhere. */
  applicationEmail: "parthasarathysankar03@gmail.com",
  social: {
    instagram: "https://www.instagram.com/meptrasoft_ai_technologies?igsh=MWxseTlmN2kzbzZqYQ==",
    linkedin: "https://www.linkedin.com/in/meptrasoft-ai-technologies-b90442420",
    whatsapp: "https://wa.me/918668126216",
  },
  /**
   * CallMeBot free WhatsApp API — sends lead-form submissions straight to the
   * owner's WhatsApp with no backend. Setup (one-time, from the owner's phone):
   *   1. Save +34 644 51 71 41 as a contact.
   *   2. WhatsApp that number: "I allow callmebot to send me messages".
   *   3. CallMeBot replies with an apikey — paste it below.
   * phone must be the owner's number in international format, no "+" or spaces.
   */
  callmebot: {
    phone: "918668126216",
    apikey: "YOUR_CALLMEBOT_APIKEY",
  },
};

export const nav: NavGroup[] = [
  {
    label: "Home",
    href: "/",
    accent: "teal",
  },
  {
    label: "Solutions",
    href: "/solutions",
    accent: "teal",
    children: [
      { label: "Technology Services", href: "/solutions", desc: "AI, web, app, data, cloud & more" },
      { label: "AI Products", href: "/solutions#products", desc: "SaaS and AI tools we build in-house" },
      { label: "Data & AI", href: "/solutions#data-ai", desc: "Data engineering, BI, ML solutions" },
      { label: "Our Work", href: "/solutions#work", desc: "Case studies and shipped products" },
    ],
  },
  {
    label: "Learn",
    href: "/learn",
    accent: "amber",
    children: [
      { label: "Placement Training", href: "/placement-training", desc: "Aptitude, coding, technical & HR prep" },
      { label: "Internships", href: "/internships", desc: "AI, software & online — free and paid" },
      { label: "AI Course", href: "/courses/ai", desc: "GenAI, ML & agents — ship a real app" },
      { label: "Python Course", href: "/courses/python", desc: "From basics to job-ready projects" },
      { label: "Final-Year Projects", href: "/final-year-projects", desc: "IEEE & custom AI/ML projects" },
      { label: "All courses & internships", href: "/learn", desc: "Placement, courses, internships & projects" },
    ],
  },
  { label: "Blog", href: "/blog", accent: "amber" },
  { label: "Careers", href: "/careers", accent: "navy" },
  { label: "About", href: "/about", accent: "navy" },
];

export const heroStats: Stat[] = [
  { value: 500, suffix: "+", label: "Engineers trained" },
  { value: 10, suffix: "+", label: "Products shipped" },
  { value: 200, suffix: "+", label: "Internships" },
  { value: 50, suffix: "+", label: "AI models deployed" },
];

export const proofStats: Stat[] = [
  { value: 50, suffix: "+", label: "AI models deployed" },
  { value: 500, suffix: "+", label: "Engineers trained" },
  { value: 10, suffix: "+", label: "SaaS products shipped" },
  { value: 200, suffix: "+", label: "Internships completed" },
];

// AI Products — SaaS and AI tools we build and run in-house.
export const products: Product[] = [
  { id: "exam-ai", name: "Exam Intelligence", what: "Generates, delivers, and grades assessments with AI — turning hours of paper-setting into minutes.", span: 1, tag: "SaaS", image: "/assets/exam_intelligence.jpeg" },
  { id: "placement-ai", name: "Placement Prep AI", what: "AI mock interviews, coding practice, and readiness scoring that get students job-ready.", span: 1, tag: "SaaS", image: "/assets/ai_prep.jpeg" },
  { id: "doc-ai", name: "Document Intelligence", what: "OCR and NLP that extract clean, structured data from invoices, forms, and IDs.", span: 1, tag: "AI", image: "/assets/Document_intelligence.jpeg" },
  { id: "resume-ai", name: "AI Resume Builder", what: "Builds recruiter-ready, ATS-optimized resumes from a few prompts — tailored to each role.", span: 1, tag: "SaaS", image: "/assets/ai-resume-builder.jpeg" },
  { id: "chatbot-ai", name: "AI Business Chatbot", what: "A chatbot that answers on your own data and drops into any website or app in minutes.", span: 1, tag: "AI", image: "/assets/chat_bot.jpeg" },
  { id: "easy-apply", name: "Easy Apply", what: "A job app that matches candidates to the right openings and applies in a single tap.", span: 1, tag: "SaaS", image: "/assets/easy-job.jpg" },
  { id: "analytics", name: "Analytics & BI", what: "AI dashboards and reporting layered on your existing data — no rebuild required.", span: 1, tag: "Data", image: "/assets/analytics-bi.jpg" },
];

// Technology Services — engineering we deliver for clients.
export const services: Offering[] = [
  { id: "genai", title: "AI & Generative AI", summary: "Custom LLM apps, copilots, and gen-AI features built on your data and workflows.", accent: "teal", icon: "brain", category: "AI", points: ["LLM apps & copilots", "Fine-tuning & evals", "Built on your data"] },
  { id: "rag", title: "RAG Solutions", summary: "Retrieval-augmented systems that answer accurately over your private knowledge base.", accent: "teal", icon: "database", category: "AI", points: ["Vector search", "Grounded answers", "Source citations"] },
  { id: "ai-automation", title: "AI Automation", summary: "AI agents that automate repetitive workflows and cut manual effort and errors.", accent: "teal", icon: "robot", category: "AI", points: ["Agentic workflows", "Doc & email automation", "Human-in-the-loop"] },
  { id: "web", title: "Web Development", summary: "Fast, modern websites and web apps engineered to convert and scale.", accent: "teal", icon: "code", category: "Build", points: ["Marketing sites", "Web apps & portals", "SEO & performance"] },
  { id: "app", title: "App Development", summary: "Cross-platform mobile and desktop apps, from prototype to store-ready.", accent: "teal", icon: "mobile", category: "Build", points: ["iOS & Android", "Cross-platform", "App store launch"] },
  { id: "data-eng", title: "Data Engineering", summary: "Pipelines and warehouses that make your data usable, not stuck in silos.", accent: "teal", icon: "pipeline", category: "Data", points: ["ETL / ELT pipelines", "Warehouses & lakes", "Real-time streaming"] },
  { id: "data-analytics", title: "Data Analytics & BI", summary: "Dashboards and reporting that turn raw data into decisions.", accent: "teal", icon: "chart", category: "Data", points: ["Dashboards", "KPI reporting", "Self-serve BI"] },
  { id: "cloud", title: "Cloud & DevOps", summary: "Deploy, scale, and monitor on AWS, Azure, or GCP with CI/CD baked in.", accent: "teal", icon: "cloud", category: "Cloud & Ops", points: ["AWS / Azure / GCP", "CI/CD & IaC", "Monitoring & scaling"] },
  { id: "security", title: "Security", summary: "Secure your apps, cloud, and data with audits, hardening, and monitoring.", accent: "teal", icon: "shield", category: "Cloud & Ops", points: ["Security audits", "Hardening", "Threat monitoring"] },
  { id: "finops", title: "FinOps", summary: "Cut cloud spend with cost visibility, tuning, and governance.", accent: "teal", icon: "coins", category: "Cloud & Ops", points: ["Cost visibility", "Rightsizing", "Budget governance"] },
  { id: "marketing", title: "Ads & Marketing", summary: "AI-assisted campaigns, SEO, and content that grow reach and pipeline.", accent: "teal", icon: "bullhorn", category: "Growth", points: ["Paid campaigns", "SEO & content", "Marketing automation"] },
  { id: "consulting", title: "Consulting", summary: "Strategy, architecture, and roadmaps to ship the right thing, faster.", accent: "teal", icon: "idea", category: "Growth", points: ["Tech strategy", "Architecture review", "Delivery roadmaps"] },
];

export const serviceCategories = ["All", "AI", "Build", "Data", "Cloud & Ops", "Growth"] as const;

export const processSteps = [
  { n: "01", title: "Discover", body: "We map your goals, constraints, and data before writing a line of code.", icon: "idea", points: ["Goals & success metrics", "Data & systems audit", "Scope & timeline"] },
  { n: "02", title: "Design", body: "Architecture, scope, and a clear plan you sign off on — no surprises.", icon: "pipeline", points: ["Architecture & tech choices", "Milestones you approve", "Fixed scope upfront"] },
  { n: "03", title: "Build", body: "Ship in fast iterations with demos, not big-bang reveals.", icon: "code", points: ["Weekly demos", "Iterative delivery", "Your feedback in the loop"] },
  { n: "04", title: "Ship & Support", body: "Deploy, monitor, and keep improving after launch.", icon: "gauge", points: ["Deploy & monitor", "Handover & docs", "Ongoing improvements"] },
];

// Data & AI capabilities band.
export const dataCapabilities: Offering[] = [
  { id: "d-eng", title: "Data Engineering", summary: "Pipelines, warehouses, and lakes that unify your data.", accent: "teal", icon: "pipeline" },
  { id: "d-bi", title: "Analytics & BI", summary: "Dashboards and reporting for fast, sharp decisions.", accent: "teal", icon: "chart" },
  { id: "d-ml", title: "Machine Learning", summary: "Predictive models trained on your data, running in production.", accent: "teal", icon: "brain" },
  { id: "d-rag", title: "RAG & Knowledge", summary: "Grounded AI answers over your private knowledge base.", accent: "teal", icon: "database" },
];

// Our Work — shipped case studies.
export const caseStudies = [
  { id: "doc", tag: "Fintech", metric: "80%", metricLabel: "less manual entry", title: "Invoice automation with Document Intelligence", blurb: "An OCR + NLP pipeline that extracts and validates invoice data automatically." },
  { id: "exam", tag: "Ed-Tech", metric: "10×", metricLabel: "faster paper-setting", title: "AI assessment platform", blurb: "Auto-generates and grades exams, cutting hours of work down to minutes." },
  { id: "bi", tag: "Retail", metric: "5", metricLabel: "systems unified", title: "Unified analytics & BI", blurb: "One source of truth with live dashboards across fragmented data sources." },
];

// Business outcomes — why companies work with us.
export const outcomes: Offering[] = [
  { id: "cost", title: "Lower your costs", summary: "Automation and FinOps cut manual effort and cloud spend — measurable savings, not vague promises.", accent: "teal", icon: "coins" },
  { id: "grow", title: "Grow the business", summary: "Data, analytics, and AI that turn insight into revenue and faster, sharper decisions.", accent: "teal", icon: "chart" },
  { id: "secure", title: "Enterprise security", summary: "Audits, hardening, and monitoring keep your apps, cloud, and data safe by default.", accent: "teal", icon: "shield" },
  { id: "automate", title: "Automate the busywork", summary: "AI agents handle repetitive workflows so your team focuses on high-value work.", accent: "teal", icon: "robot" },
  { id: "ai", title: "AI for your business", summary: "Custom LLM apps and copilots built on your own data — practical AI, running in production.", accent: "teal", icon: "brain" },
  { id: "fast", title: "Ship faster", summary: "Iterative delivery with demos over big-bang reveals — value in weeks, not quarters.", accent: "teal", icon: "rocket" },
];

// Flagship: placement-prep program for college students (the recommended track).
export const placementProgram = {
  badge: "Highly Recommended for College Students",
  eyebrow: "Meptrasoft Premium Course",
  title: "Placement Preparation Program",
  tagline:
    "Everything a fresher needs to land their first IT job — all in one structured program.",
  // Risk-free demo — try before you pay.
  demo: {
    headline: "Try Before You Pay",
    body: "Attend our FREE 3-day live demo classes.",
    points: [
      "Experience our teaching style.",
      "Explore the complete curriculum.",
      "Ask your questions live.",
      "If you're satisfied, continue with the program.",
      "If not, you don't pay anything.",
    ],
    tagline: "No Risk. No Pressure.",
  },
  duration: "3 months + support until you finish college",
  tiers: [
    { name: "Live", summary: "Live classes + recordings + materials + unlimited live doubts.", icon: "graduate", accent: "amber" as const },
    { name: "Self-paced", summary: "Recorded sessions + weekly doubt session + materials.", icon: "laptop-code", accent: "amber" as const },
  ],
};

// "Everything You Need to Get Placed" — what the bundle includes.
export const placementIncludes: { label: string; icon: string }[] = [
  { label: "Live Interactive Classes", icon: "graduate" },
  { label: "Lifetime Access to Recorded Sessions", icon: "laptop-code" },
  { label: "Weekly Live Doubt-Clearing Sessions", icon: "chat" },
  { label: "Complete Study Materials & Notes", icon: "database" },
  { label: "Coding Practice", icon: "code" },
  { label: "Mock Tests", icon: "gauge" },
  { label: "Mock Interviews", icon: "phone" },
  { label: "Real Industry Projects", icon: "rocket" },
  { label: "AI Tools Training", icon: "brain" },
  { label: "Resume & Portfolio Support", icon: "pen-ruler" },
  { label: "Continuous Mentor Guidance", icon: "star" },
];

// The placement journey — the exact campus-placement sequence. Each round depends
// on the previous one, so every stage gets equal weight. `learn` powers the
// scroll-revealed "What You'll Learn" map; `why` / `pain` explain the stakes.
export const placementJourney = [
  {
    n: 1,
    title: "Aptitude Round",
    subtitle: "Clear the First Screening Test",
    tag: "Round 1",
    learn: [
      "Quantitative Aptitude",
      "Logical Reasoning",
      "Verbal Ability",
      "Analytical Thinking",
      "Time Management Techniques",
      "Mock Aptitude Tests",
    ],
    why: "Most companies begin their hiring process with an aptitude assessment to shortlist candidates for the next round.",
    pain: "You may be eliminated in the very first round before your technical skills are even evaluated.",
  },
  {
    n: 2,
    title: "Coding Round",
    subtitle: "Programming, SQL & Problem Solving",
    tag: "Round 2",
    learn: [
      "Python Programming",
      "SQL & Database Queries",
      "Programming Fundamentals",
      "Object-Oriented Programming (OOP)",
      "Data Structures & Algorithms (DSA)",
      "Logical Problem Solving",
      "Coding Practice",
      "Mock Coding Tests",
    ],
    why: "The coding round evaluates your programming knowledge, logical thinking, and problem-solving skills under real interview conditions.",
    pain: "Knowing Python or SQL syntax alone isn't enough. Companies expect you to solve problems efficiently using logic, algorithms, and clean coding within strict time limits.",
  },
  {
    n: 3,
    title: "Technical Interview",
    subtitle: "Demonstrate Your Technical Skills & Projects",
    tag: "Round 3",
    learn: [
      "Python Technical Interview Questions",
      "SQL Interview Questions",
      "OOP, DBMS & Core CS Concepts",
      "Project Development Using AI Tools",
      "ChatGPT, Claude & GitHub Copilot",
      "Building Industry-Level Projects",
      "GitHub & Portfolio Preparation",
      "Explaining Projects Confidently",
      "Project-Based Interview Questions",
      "Real-Time Problem Solving",
      "Mock Technical Interviews",
    ],
    why: "Interviewers evaluate much more than programming knowledge. They assess your understanding of concepts, your approach to solving problems, your project experience, and your ability to explain your work confidently.",
    pain: "Even after clearing the coding round, many candidates fail because they cannot explain their projects, answer technical questions confidently, or demonstrate practical problem-solving skills.",
  },
  {
    n: 4,
    title: "HR Interview",
    subtitle: "Convert Your Performance into a Job Offer",
    tag: "Final Round",
    learn: [
      "HR Interview Questions",
      "Self Introduction",
      "Resume Walkthrough",
      "Behavioral Interview Questions",
      "Professional Communication",
      "Confidence Building",
      "Salary & Career Discussions",
      "Workplace Etiquette",
    ],
    why: "The HR interview evaluates your personality, professionalism, communication, confidence, attitude, and overall fit for the organization.",
    pain: "Many candidates lose their job offers in the final round due to poor communication, lack of confidence, or weak interview skills.",
  },
];

// Optional round some companies run between coding and the technical interview.
// Rendered as a highlighted branch inside the roadmap (sits after Round 2).
export const communicationRound = {
  afterStep: 2,
  title: "Communication & Group Discussion",
  tag: "Optional Company Round",
  intro:
    "Some companies conduct a Group Discussion (GD) before the technical interview, while others don't.",
  prepareLabel: "We Prepare You For",
  prepare: [
    "Spoken English",
    "Professional Communication",
    "Group Discussions",
    "Presentation Skills",
    "Confidence Building",
  ],
  why: "Although the GD round is optional depending on the company, English communication is mandatory in every IT career. You'll use it while explaining your code, presenting projects, joining team meetings, working with clients, and collaborating with developers.",
  note: "Strong communication skills are just as important as technical skills.",
};

// "Why We Follow This Order" — the roadmap rationale + how we make it stick.
export const placementOrder = {
  flow: ["Aptitude", "Coding", "Communication", "Technical Interview", "HR Interview"],
  intro:
    "This isn't just a syllabus — it's a placement roadmap. Each stage builds on the previous one, so you can't skip a step and expect to succeed in the next.",
  methods: [
    "Live mentor-led classes",
    "Hands-on coding practice",
    "Weekly assessments",
    "Mock aptitude tests",
    "Mock coding rounds",
    "Mock technical interviews",
    "Mock HR interviews",
    "Real-world projects",
    "AI-powered development tools",
    "Continuous mentor feedback",
  ],
  goal: "Our goal isn't just to teach you. Our goal is to make you placement-ready and help you confidently crack your first IT job.",
};

// Placement Training — dedicated page FAQ (FAQPage schema → Google rich snippets).
export const placementFaqs: Faq[] = [
  {
    question: "What is placement training and why do I need it?",
    answer:
      "Placement training is a structured program that prepares you for every stage of campus recruitment — aptitude tests, coding rounds, technical interviews, and HR interviews. Most colleges don't cover all of these in depth, so students who prepare separately perform significantly better in placement drives.",
  },
  {
    question: "Who is this placement training program for?",
    answer:
      "It's designed for final-year and pre-final-year engineering students, freshers looking for their first IT job, and anyone preparing for campus placements. Any branch — CSE, ECE, EEE, Mechanical, Civil — is welcome. No prior coding experience is required.",
  },
  {
    question: "How long is the placement preparation program?",
    answer:
      "The program runs for 3 months of intensive training, plus continued mentor support until you finish college and get placed. You're not left on your own after the course ends.",
  },
  {
    question: "Is there a free demo before I pay?",
    answer:
      "Yes. You can attend 3 days of free live demo classes. Experience our teaching style, ask questions, and explore the full curriculum. If you're not satisfied, you don't pay anything — no risk, no pressure.",
  },
  {
    question: "What's the difference between Live and Self-paced modes?",
    answer:
      "The Live mode includes live interactive classes, recordings, study materials, and unlimited live doubt-clearing. The Self-paced mode gives you recorded sessions, weekly doubt sessions, and the same materials. Both cover the full placement curriculum.",
  },
  {
    question: "Will I get mock interviews and practice tests?",
    answer:
      "Yes — mock aptitude tests, mock coding rounds, mock technical interviews, and mock HR interviews are all part of the program. Our mock interviews are designed to be tougher than real ones so you walk into your actual interview confident and prepared.",
  },
  {
    question: "Do you teach AI tools like ChatGPT and GitHub Copilot?",
    answer:
      "Yes. We train you to use AI tools like ChatGPT, Claude, and GitHub Copilot to build real industry-level projects. You'll learn to leverage these tools for coding, project development, and productivity — skills that give you a major edge in interviews.",
  },
  {
    question: "What if I'm from a non-CS branch like ECE, Mechanical, or Civil?",
    answer:
      "Our program starts from the fundamentals and builds up. Many of our successful graduates are from non-CS branches. We teach everything from scratch — programming, aptitude, communication, and interview skills — so your branch doesn't matter.",
  },
];

// Target audience for the placement training page — who benefits from this program.
export const placementAudience: { title: string; body: string; icon: string }[] = [
  {
    title: "Final-Year & Pre-Final-Year Students",
    body: "Campus placements are months away. This program covers every round — aptitude, coding, technical, and HR — in the exact sequence companies follow.",
    icon: "graduation",
  },
  {
    title: "Freshers Looking for Their First IT Job",
    body: "No prior experience? We start from the fundamentals and build you up to interview-ready. Resume prep, portfolio, and mock interviews included.",
    icon: "briefcase",
  },
  {
    title: "Students from Any Branch",
    body: "CSE, ECE, EEE, Mechanical, Civil — it doesn't matter. We teach everything from scratch, including programming, so any engineering student can follow along.",
    icon: "users",
  },
  {
    title: "Students Who Struggled in Previous Placement Drives",
    body: "Didn't clear the first round last time? We diagnose exactly where you're falling short and fix it with targeted practice and mock tests.",
    icon: "rocket",
  },
];

export const courseCategories = ["All", "AI", "Programming", "Data", "Web & Mobile", "Cloud & Security", "Career"] as const;

// Fee tiers: standard courses ₹10,000 → ₹7,500; premium flagship ₹15,000 → ₹8,000.
export const courses: Offering[] = [
  { id: "placement", title: "Placement Preparation Program", summary: "Our flagship program — aptitude, coding, technical & HR interviews, and communication — with mentor support that continues until your college ends and you're placed. Everything a fresher needs to land the first IT job.", duration: "6 months + support", accent: "amber", icon: "graduate", category: "Career", languages: ["Tamil", "English"], rating: 4.9, enrolled: "18K", premium: true, feeWas: 20000, feeNow: 8000, offerNote: "Special offer — 1 month only" },
  { id: "fullstack", title: "Full Stack Development", summary: "Front-end to back-end, databases, and deployment — build and ship real web apps you can put on your resume.", duration: "3 months", accent: "amber", icon: "code", category: "Web & Mobile", languages: ["Tamil", "English"], rating: 4.8, enrolled: "12K", feeWas: 10000, feeNow: 7500 },
  { id: "genai", title: "Generative AI", summary: "Work hands-on with LLMs, RAG, prompt engineering, and agents, and ship a working AI application.", duration: "3 months", accent: "amber", icon: "brain", category: "AI", languages: ["Tamil", "English"], rating: 4.9, enrolled: "9K", feeWas: 10000, feeNow: 7500 },
  { id: "agentic", title: "Agentic AI", summary: "Design autonomous AI agents that plan, use tools, and act — the frontier of applied AI.", duration: "3 months", accent: "amber", icon: "robot", category: "AI", languages: ["Tamil", "English"], rating: 4.8, enrolled: "5K", feeWas: 10000, feeNow: 7500 },
  { id: "aiml", title: "AI & Machine Learning", summary: "ML foundations through model training, evaluation, and deployment on real datasets.", duration: "3 months", accent: "amber", icon: "chart", category: "AI", languages: ["Tamil", "English"], rating: 4.8, enrolled: "10K", feeWas: 10000, feeNow: 7500 },
  { id: "ai-tools", title: "AI Tools Mastery", summary: "Get productive with the best AI tools across coding, writing, design, and analysis.", duration: "3 months", accent: "amber", icon: "rocket", category: "AI", languages: ["Tamil", "English"], rating: 4.7, enrolled: "8K", feeWas: 10000, feeNow: 7500 },
  { id: "code-with-ai", title: "Coding with AI", summary: "Ship more and faster using AI copilots and pair-programming workflows.", duration: "3 months", accent: "amber", icon: "laptop-code", category: "AI", languages: ["Tamil", "English"], rating: 4.7, enrolled: "6K", feeWas: 10000, feeNow: 7500 },
  { id: "startup-ai", title: "Startup Building with AI", summary: "Turn an idea into a working MVP fast, using AI end to end — ideate, build, launch.", duration: "3 months", accent: "amber", icon: "idea", category: "AI", languages: ["Tamil", "English"], rating: 4.6, enrolled: "4K", feeWas: 10000, feeNow: 7500 },
  { id: "python", title: "Python Programming", summary: "From fundamentals to automation, data, and real-world projects — the best first language.", duration: "3 months", accent: "amber", icon: "code", category: "Programming", languages: ["Tamil", "English"], rating: 4.9, enrolled: "15K", feeWas: 10000, feeNow: 7500 },
  { id: "java", title: "Java", summary: "Core Java, OOP, and interview-ready problem solving for product and service companies.", duration: "3 months", accent: "amber", icon: "code", category: "Programming", languages: ["Tamil", "English"], rating: 4.8, enrolled: "11K", feeWas: 10000, feeNow: 7500 },
  { id: "c", title: "C Programming", summary: "Master the fundamentals of C — memory, pointers, and logic from the ground up.", duration: "3 months", accent: "amber", icon: "code", category: "Programming", languages: ["Tamil", "English"], rating: 4.7, enrolled: "9K", feeWas: 10000, feeNow: 7500 },
  { id: "cpp", title: "C++", summary: "OOP plus data structures & algorithms with C++ — strong for coding rounds.", duration: "3 months", accent: "amber", icon: "code", category: "Programming", languages: ["Tamil", "English"], rating: 4.7, enrolled: "8K", feeWas: 10000, feeNow: 7500 },
  { id: "sql", title: "SQL", summary: "Query, model, and optimize relational databases — a must-have for every developer.", duration: "3 months", accent: "amber", icon: "database", category: "Data", languages: ["Tamil", "English"], rating: 4.8, enrolled: "10K", feeWas: 10000, feeNow: 7500 },
  { id: "data-eng", title: "Data Engineering", summary: "Build pipelines, warehouses, and big-data workflows that power analytics and AI.", duration: "3 months", accent: "amber", icon: "pipeline", category: "Data", languages: ["Tamil", "English"], rating: 4.8, enrolled: "6K", feeWas: 10000, feeNow: 7500 },
  { id: "data-analytics", title: "Data Analytics", summary: "Turn raw data into dashboards, insights, and clear decisions with real tools.", duration: "3 months", accent: "amber", icon: "chart", category: "Data", languages: ["Tamil", "English"], rating: 4.8, enrolled: "10K", feeWas: 10000, feeNow: 7500 },
  { id: "cloud", title: "Cloud Computing", summary: "AWS, Azure, or GCP with hands-on deployment, CI/CD, and DevOps basics.", duration: "3 months", accent: "amber", icon: "cloud", category: "Cloud & Security", languages: ["Tamil", "English"], rating: 4.7, enrolled: "7K", feeWas: 10000, feeNow: 7500 },
  { id: "cyber", title: "Cyber Security", summary: "Secure systems, networks, and apps with ethical-hacking foundations.", duration: "3 months", accent: "amber", icon: "shield", category: "Cloud & Security", languages: ["Tamil", "English"], rating: 4.8, enrolled: "6K", feeWas: 10000, feeNow: 7500 },
  { id: "uiux", title: "UI/UX Design", summary: "Design usable, beautiful product interfaces — research, wireframes, and prototypes.", duration: "3 months", accent: "amber", icon: "pen-ruler", category: "Web & Mobile", languages: ["Tamil", "English"], rating: 4.7, enrolled: "9K", feeWas: 10000, feeNow: 7500 },
  { id: "flutter", title: "Flutter", summary: "Build cross-platform iOS and Android apps from a single codebase.", duration: "3 months", accent: "amber", icon: "mobile", category: "Web & Mobile", languages: ["Tamil", "English"], rating: 4.7, enrolled: "7K", feeWas: 10000, feeNow: 7500 },
  { id: "career", title: "Career Guidance", summary: "Free 1:1 guidance to plan your path, pick the right skills, and take the next step.", duration: "Free", accent: "amber", icon: "graduate", category: "Career", languages: ["Tamil", "English"], rating: 5.0, enrolled: "20K" },
];

export const internships: Offering[] = [
  { id: "free", title: "Free Internship", summary: "For talented, skilled students — entry via interview or top course performance. Work on real client products based on open roles, with real exposure and a certificate.", duration: "1 month – 1 year", meta: ["Interview-based", "Real client products", "Certificate"], accent: "amber", icon: "briefcase" },
  { id: "paid", title: "Paid Internship", summary: "Not job-ready yet? We teach, guide, and mentor you one-on-one until you can ship — same real work and duration as the free track.", duration: "1 month – 1 year", meta: ["Mentored 1:1", "Real client products", "Certificate"], accent: "amber", icon: "graduate" },
  { id: "short", title: "Short Certifications", summary: "Hands-on internship, workshop, and industrial-visit certifications — from a single day to a month, backed by us and our partners.", duration: "1 day – 1 month", meta: ["Workshop / IV", "Hands-on", "Partner-backed"], accent: "amber", icon: "award" },
];

export const projectOfferings: Offering[] = [
  { id: "ieee", title: "IEEE Projects", summary: "Real IEEE, industry-standard problem statements — not dummy code. AI-powered MVPs that solve current-year, real-world problems.", accent: "amber", icon: "star", points: ["Current-year problems", "AI-powered MVP", "Industry standard"] },
  { id: "custom", title: "Dedicated & Custom Projects", summary: "Tailored, dedicated project builds scoped to your exact requirement and domain.", accent: "amber", icon: "pen-ruler", points: ["Scoped to you", "One-on-one build", "Any domain"] },
  { id: "all-domains", title: "All Software Domains", summary: "Web, mobile, AI, and data — every kind of software project, built fresh. Never recycled old dumps.", accent: "amber", icon: "laptop-code", points: ["Web / mobile / AI", "Fully original", "Real problem solving"] },
];

export const loopSteps: LoopStep[] = [
  { id: "products", node: "products", eyebrow: "01 / 03", title: "We build real AI products.", body: "SaaS and AI tools that paying clients use in production — not demos.", accent: "teal" },
  { id: "learners", node: "learners", eyebrow: "02 / 03", title: "Students build on them.", body: "Interns and trainees ship features on those same live products, not toy exercises.", accent: "amber" },
  { id: "projects", node: "projects", eyebrow: "03 / 03", title: "Their work ships. They get hired.", body: "Real contributions flow back into our products; job-ready engineers flow into the industry — and our team.", accent: "aqua" },
];

export const testimonials: Testimonial[] = [
  { quote: "I interned on a live document-AI product and shipped a feature in week three. That put a real project on my resume.", name: "Aravind K.", role: "Data Science intern → hired", rating: 5 },
  { quote: "The Generative AI course was hands-on the whole way. I built and deployed an app, not slides.", name: "Rahul M.", role: "GenAI course graduate", rating: 5 },
  { quote: "My final year project was IEEE-based and genuinely mine to defend — not a template everyone in class had.", name: "Sneha R.", role: "Final Year Project student", rating: 5 },
  { quote: "The placement program's mock interviews were tougher than the real one. Walked in confident.", name: "Vignesh P.", role: "Placement Program graduate", rating: 5 },
  { quote: "Free internship track still had mentor reviews on every PR. Didn't feel like a lesser tier.", name: "Divya N.", role: "Free Internship, Web Dev", rating: 4 },
  { quote: "Cloud & DevOps course got me deploying real pipelines on AWS by week two, not just slides on IAM.", name: "Karthik S.", role: "Cloud & Security course learner", rating: 5 },
  { quote: "Built and shipped a chatbot during my internship that's still running in production. Great feeling.", name: "Meera V.", role: "AI Automation intern", rating: 5 },
  { quote: "DSA + mock coding tests in the placement track finally made competitive coding click for me.", name: "Suresh B.", role: "Placement Program graduate", rating: 4 },
  { quote: "The data engineering course covered real pipelines and warehousing, not just theory slides.", name: "Anitha K.", role: "Data Engineering course student", rating: 5 },
  { quote: "Paid internship let me work alongside engineers shipping to actual clients. Learned more in 8 weeks than a semester.", name: "Rohit D.", role: "Paid Internship, Data Science", rating: 5 },
  { quote: "My custom final year project used real ML models, not a copy-pasted GitHub repo like half my batch had.", name: "Priyanka T.", role: "Final Year Project student", rating: 5 },
  { quote: "The RAG and LLM app module in the GenAI course was the most practical AI content I've taken anywhere.", name: "Naveen A.", role: "GenAI course graduate", rating: 5 },
  { quote: "Resume and portfolio prep in the placement track got me past the resume-screening stage for the first time.", name: "Lakshmi J.", role: "Placement Program graduate", rating: 4 },
  { quote: "Short certification course on Python was fast but didn't skip the fundamentals. Good for brushing up before interviews.", name: "Arjun M.", role: "Python certification student", rating: 4 },
  { quote: "Internship mentors reviewed my code like I was already a junior engineer, not a student.", name: "Swathi R.", role: "Full Stack intern", rating: 5 },
  { quote: "HR round prep and behavioral question practice made the final interview feel rehearsed in a good way.", name: "Manoj K.", role: "Placement Program graduate", rating: 5 },
  { quote: "The web & mobile course had me shipping a deployed app by the final module, not just a local build.", name: "Deepika S.", role: "Web & Mobile course student", rating: 5 },
  { quote: "Final year project support included actual paper-writing guidance, not just code.", name: "Harish V.", role: "Final Year Project student", rating: 4 },
  { quote: "Communication & GD round prep was the one thing my college placement cell never covered.", name: "Pooja N.", role: "Placement Program graduate", rating: 5 },
  { quote: "Internship gave me a GitHub history of real commits on a live product — recruiters actually asked about it.", name: "Vikram C.", role: "Data Science intern", rating: 5 },
];

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export type Tech = { name: string; logo: string };

export const techStack: Tech[] = [
  { name: "Python", logo: `${DEVICON}/python/python-original.svg` },
  { name: "PyTorch", logo: `${DEVICON}/pytorch/pytorch-original.svg` },
  { name: "LangChain", logo: "https://cdn.simpleicons.org/langchain/1C3C3C" },
  { name: "Spark", logo: `${DEVICON}/apachespark/apachespark-original.svg` },
  { name: "Kafka", logo: `${DEVICON}/apachekafka/apachekafka-original.svg` },
  { name: "Snowflake", logo: `${DEVICON}/snowflake/snowflake-original.svg` },
  { name: "React", logo: `${DEVICON}/react/react-original.svg` },
  { name: "FastAPI", logo: `${DEVICON}/fastapi/fastapi-original.svg` },
  { name: "AWS", logo: `${DEVICON}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
  { name: "Kubernetes", logo: `${DEVICON}/kubernetes/kubernetes-original.svg` },
  { name: "TensorFlow", logo: `${DEVICON}/tensorflow/tensorflow-original.svg` },
  { name: "Postgres", logo: `${DEVICON}/postgresql/postgresql-original.svg` },
];

export const roles: Role[] = [
  {
    id: "ai-engineer",
    title: "AI Engineer",
    type: "Full-time",
    location: "Online",
    experience: "0–1 year",
    duration: "Full-time",
    openings: 1,
    description:
      "Build and ship the RAG, NLP, and OCR pipelines behind our live AI products — not research demos. You'll work on retrieval-augmented systems, document/OCR intelligence, and NLP-driven features, with senior engineers reviewing your code and backing you on production issues.",
    skills: ["RAG", "NLP", "OCR", "Python"],
  },
  {
    id: "ai-engineer-intern",
    title: "AI Engineer Intern",
    type: "Internship",
    location: "Online",
    experience: "Fresher — any level",
    duration: "1–6 months",
    openings: 4,
    description:
      "Get hands-on with real AI products in production — RAG pipelines, NLP features, and OCR/document-intelligence work. Unpaid, unlimited experience level accepted; you'll be mentored, not left to sink or swim.",
    skills: ["AI/ML basics", "Python"],
  },
  {
    id: "web-developer-intern",
    title: "Web Developer Intern",
    type: "Internship",
    location: "Online",
    experience: "Fresher — any level",
    duration: "1–6 months",
    openings: 4,
    description:
      "Ship real features on live client and product websites — not toy exercises. Work across the frontend and backend of our web stack under a mentor's guidance.",
    skills: ["HTML/CSS", "JavaScript", "React"],
  },
  {
    id: "flutter-intern",
    title: "Flutter Intern",
    type: "Internship",
    location: "Online",
    experience: "Fresher — any level",
    duration: "1–6 months",
    openings: 4,
    description:
      "Build cross-platform mobile features in Flutter for real products headed to the App Store and Play Store, with code review and mentorship throughout.",
    skills: ["Flutter", "Dart"],
  },
  {
    id: "digital-marketing-intern",
    title: "Digital Marketing Intern",
    type: "Internship",
    location: "Online",
    experience: "Fresher — any level",
    duration: "1–6 months",
    openings: 4,
    description:
      "Run real campaigns, not case studies — SEO, paid ads, content, and social for Meptrasoft and client brands, with a mentor reviewing your work end to end.",
    skills: ["SEO", "Content", "Paid ads"],
  },
  {
    id: "cloud-engineer-intern",
    title: "Cloud Engineer Intern",
    type: "Internship",
    location: "Online",
    experience: "Fresher — any level",
    duration: "1–6 months",
    openings: 4,
    description:
      "Get real exposure to deployment, CI/CD, and monitoring on AWS/Azure/GCP for products already serving users — not sandbox tutorials.",
    skills: ["AWS/Azure/GCP", "CI/CD", "Linux"],
  },
  {
    id: "sql-developer-intern",
    title: "SQL Developer Intern",
    type: "Internship",
    location: "Online",
    experience: "Fresher — any level",
    duration: "1–6 months",
    openings: 4,
    description:
      "Write and optimize queries, model schemas, and support reporting for live data used by our products and clients, mentored by our data team.",
    skills: ["SQL", "Data modeling"],
  },
];

export const faqs: Faq[] = [
  {
    question: "How long does an AI product engagement take?",
    answer:
      "Most engagements run 6–12 weeks from scoping to a shipped v1, depending on integration complexity. We work in short sprints so you see working software early, not just a plan.",
  },
  {
    question: "Do you only build AI products, or handle web, app & data too?",
    answer:
      "Both. Solutions covers AI & Generative AI, web and app development, data engineering & BI, and cloud/security/DevOps — the same team scopes across all of it, so you're not stitching vendors together.",
  },
  {
    question: "What's included in the training & internship programs?",
    answer:
      "Live instruction, hands-on projects on real client-style codebases, mentor code reviews, and a completion certificate. The placement track adds mock interviews and a structured interview roadmap.",
  },
  {
    question: "Can you work with our existing stack and systems?",
    answer:
      "Yes — we integrate with your existing infrastructure, data sources, and codebase rather than requiring a rebuild. We'll flag early if something needs replacing and why.",
  },
  {
    question: "Do students and interns work on real client projects?",
    answer:
      "Yes. Interns build inside the same codebases we ship to paying clients, under mentor supervision — not on standalone practice exercises written after the fact.",
  },
  {
    question: "Do you provide the final deliverables and documentation?",
    answer:
      "Every engagement ends with source access, deployment docs, and a handover walkthrough, so your team can maintain and extend what we built without depending on us.",
  },
];

// Both are virtual offices today — physical offices in both cities are opening soon.
export const offices: Office[] = [
  {
    city: "Chennai",
    address: "3rd Street, SSBDL – Near Alpha City, Navalur, Chennai, Tamil Nadu 600130",
    status: "Virtual Office",
  },
  {
    city: "Bengaluru",
    address: "GoodWorks Ikon, Jupiter Prestige Technology Park, ORR, Marathahalli, Bengaluru, Karnataka 560037",
    status: "Virtual Office",
  },
];
