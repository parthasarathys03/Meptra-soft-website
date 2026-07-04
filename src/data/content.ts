import type {
  NavGroup,
  Offering,
  Product,
  Stat,
  LoopStep,
  Testimonial,
  Role,
} from "@/lib/types";

export const site = {
  name: "Meptrasoft AI",
  full: "Meptrasoft AI Technologies",
  tagline: "AI Products × Engineering Education",
  whatsapp: "https://wa.me/919345984804",
  email: "supportteam@meptrasoft.ai",
  social: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    whatsapp: "https://wa.me/919345984804",
  },
};

export const nav: NavGroup[] = [
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
      { label: "Placement Program", href: "/learn#placement", desc: "Recommended track for freshers" },
      { label: "Courses", href: "/learn#courses", desc: "AI, programming, data, cloud & more" },
      { label: "Internships", href: "/learn#internships", desc: "Free, paid, and short certifications" },
      { label: "Projects", href: "/learn#projects", desc: "IEEE & custom, AI-powered projects" },
    ],
  },
  { label: "Careers", href: "/careers", accent: "navy" },
  { label: "About", href: "/about", accent: "navy" },
];

export const heroStats: Stat[] = [
  { value: 500, suffix: "+", label: "Engineers trained" },
  { value: 10, suffix: "+", label: "Products shipped" },
  { value: 200, suffix: "+", label: "Internships" },
];

export const proofStats: Stat[] = [
  { value: 50, suffix: "+", label: "AI models deployed" },
  { value: 500, suffix: "+", label: "Engineers trained" },
  { value: 10, suffix: "+", label: "SaaS products shipped" },
  { value: 200, suffix: "+", label: "Internships completed" },
];

// NOTE: images are temporary Unsplash placeholders — swap for real product screenshots later.
const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

// AI Products — SaaS and AI tools we build and run in-house.
export const products: Product[] = [
  { id: "exam-ai", name: "Exam Intelligence", what: "Generates, delivers, and grades assessments with AI — turning hours of paper-setting into minutes.", span: 1, tag: "SaaS", image: img("photo-1551288049-bebda4e38f71") },
  { id: "placement-ai", name: "Placement Prep AI", what: "AI mock interviews, coding practice, and readiness scoring that get students job-ready.", span: 1, tag: "SaaS", image: img("photo-1517245386807-bb43f82c33c4") },
  { id: "doc-ai", name: "Document Intelligence", what: "OCR and NLP that extract clean, structured data from invoices, forms, and IDs.", span: 1, tag: "AI", image: img("photo-1554224155-6726b3ff858f") },
  { id: "resume-ai", name: "AI Resume Builder", what: "Builds recruiter-ready, ATS-optimized resumes from a few prompts — tailored to each role.", span: 1, tag: "SaaS", image: img("photo-1586281380349-632531db7ed4") },
  { id: "chatbot-ai", name: "AI Business Chatbot", what: "A chatbot that answers on your own data and drops into any website or app in minutes.", span: 1, tag: "AI", image: img("photo-1531482615713-2afd69097998") },
  { id: "easy-apply", name: "Easy Apply", what: "A job app that matches candidates to the right openings and applies in a single tap.", span: 1, tag: "SaaS", image: img("photo-1460925895917-afdab827c52f") },
  { id: "analytics", name: "Analytics & BI", what: "AI dashboards and reporting layered on your existing data — no rebuild required.", span: 1, tag: "Data", image: img("photo-1543286386-713bdd548da4") },
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
  badge: "Meptrasoft Recommended",
  eyebrow: "For College Students",
  title: "Placement Preparation Program",
  tagline: "Everything a fresher needs to land their first IT job — in one bundle.",
  demo: "Free demo class first. Attend, decide, then pay — not a single rupee upfront.",
  duration: "3 months + support until you finish college",
  batches: "Join any live batch during your access period",
  includes: [
    "Python + SQL foundations",
    "Gen AI skills & modern AI tools",
    "Coding practice for coding rounds",
    "Aptitude & reasoning (Round 1)",
    "English & Group Discussion prep",
    "Technical interview preparation",
    "Soft skills for HR interviews",
    "Unlimited live doubt-clearing",
    "Weekly motivation calls with placed engineers",
    "Hands-on practice, projects & evaluation",
  ],
  tiers: [
    { name: "Live", summary: "Live classes + recordings + materials + unlimited live doubts.", icon: "graduate", accent: "amber" as const },
    { name: "Self-paced", summary: "Recorded sessions + weekly doubt session + materials.", icon: "laptop-code", accent: "amber" as const },
  ],
};

// The placement journey — ordered steps, why each matters, and the pain of skipping it.
export const placementJourney = [
  { n: 1, title: "Programming Foundations", skills: "Python + SQL", why: "Every IT role starts with solid coding and data basics.", pain: "Without this, you're filtered out before the first round." },
  { n: 2, title: "Coding & DSA Practice", skills: "Coding rounds", why: "The coding round is the first real elimination filter.", pain: "Weak here means rejected before any interview." },
  { n: 3, title: "Aptitude & Reasoning", skills: "Round 1 tests", why: "Most companies open with an aptitude test.", pain: "Miss the cutoff and you never reach the coding round." },
  { n: 4, title: "Gen AI & AI Tools", skills: "Modern AI skills", why: "Today's hiring expects real AI fluency, not just theory.", pain: "Without it you look outdated next to other freshers." },
  { n: 5, title: "English & Group Discussion", skills: "Communication", why: "GD rounds judge how you speak and think aloud.", pain: "Strong coders still get cut for weak communication." },
  { n: 6, title: "Technical Interview", skills: "Core + project depth", why: "The panel tests how deeply you understand your work.", pain: "Freeze on fundamentals and the offer slips away." },
  { n: 7, title: "HR & Soft Skills", skills: "Final round", why: "The last round decides your offer and salary.", pain: "Many candidates lose the job at the very last step." },
  { n: 8, title: "Real Projects & Evaluation", skills: "Hands-on + mentor review", why: "Real projects give you a resume and genuine confidence.", pain: "No projects means no proof — and no callbacks." },
];

export const courseCategories = ["All", "AI", "Programming", "Data", "Web & Mobile", "Cloud & Security", "Career"] as const;

export const courses: Offering[] = [
  { id: "fullstack", title: "Full Stack Development", summary: "Front-end to back-end, databases, and deployment — build and ship real web apps you can put on your resume.", duration: "4–6 months", accent: "amber", icon: "code", category: "Web & Mobile" },
  { id: "genai", title: "Generative AI", summary: "Work hands-on with LLMs, RAG, prompt engineering, and agents, and ship a working AI application.", duration: "2–4 months", accent: "amber", icon: "brain", category: "AI" },
  { id: "agentic", title: "Agentic AI", summary: "Design autonomous AI agents that plan, use tools, and act — the frontier of applied AI.", duration: "2–3 months", accent: "amber", icon: "robot", category: "AI" },
  { id: "aiml", title: "AI & Machine Learning", summary: "ML foundations through model training, evaluation, and deployment on real datasets.", duration: "3–5 months", accent: "amber", icon: "chart", category: "AI" },
  { id: "ai-tools", title: "AI Tools Mastery", summary: "Get productive with the best AI tools across coding, writing, design, and analysis.", duration: "1–2 months", accent: "amber", icon: "rocket", category: "AI" },
  { id: "code-with-ai", title: "Coding with AI", summary: "Ship more and faster using AI copilots and pair-programming workflows.", duration: "1–2 months", accent: "amber", icon: "laptop-code", category: "AI" },
  { id: "startup-ai", title: "Startup Building with AI", summary: "Turn an idea into a working MVP fast, using AI end to end — ideate, build, launch.", duration: "2–3 months", accent: "amber", icon: "idea", category: "AI" },
  { id: "python", title: "Python Programming", summary: "From fundamentals to automation, data, and real-world projects — the best first language.", duration: "1–3 months", accent: "amber", icon: "code", category: "Programming" },
  { id: "java", title: "Java", summary: "Core Java, OOP, and interview-ready problem solving for product and service companies.", duration: "2–4 months", accent: "amber", icon: "code", category: "Programming" },
  { id: "c", title: "C Programming", summary: "Master the fundamentals of C — memory, pointers, and logic from the ground up.", duration: "1–2 months", accent: "amber", icon: "code", category: "Programming" },
  { id: "cpp", title: "C++", summary: "OOP plus data structures & algorithms with C++ — strong for coding rounds.", duration: "2–3 months", accent: "amber", icon: "code", category: "Programming" },
  { id: "sql", title: "SQL", summary: "Query, model, and optimize relational databases — a must-have for every developer.", duration: "1–2 months", accent: "amber", icon: "database", category: "Data" },
  { id: "data-eng", title: "Data Engineering", summary: "Build pipelines, warehouses, and big-data workflows that power analytics and AI.", duration: "3–5 months", accent: "amber", icon: "pipeline", category: "Data" },
  { id: "data-analytics", title: "Data Analytics", summary: "Turn raw data into dashboards, insights, and clear decisions with real tools.", duration: "2–4 months", accent: "amber", icon: "chart", category: "Data" },
  { id: "cloud", title: "Cloud Computing", summary: "AWS, Azure, or GCP with hands-on deployment, CI/CD, and DevOps basics.", duration: "2–4 months", accent: "amber", icon: "cloud", category: "Cloud & Security" },
  { id: "cyber", title: "Cyber Security", summary: "Secure systems, networks, and apps with ethical-hacking foundations.", duration: "3–5 months", accent: "amber", icon: "shield", category: "Cloud & Security" },
  { id: "uiux", title: "UI/UX Design", summary: "Design usable, beautiful product interfaces — research, wireframes, and prototypes.", duration: "2–3 months", accent: "amber", icon: "pen-ruler", category: "Web & Mobile" },
  { id: "flutter", title: "Flutter", summary: "Build cross-platform iOS and Android apps from a single codebase.", duration: "2–4 months", accent: "amber", icon: "mobile", category: "Web & Mobile" },
  { id: "career", title: "Career Guidance", summary: "Free 1:1 guidance to plan your path, pick the right skills, and take the next step.", duration: "Free", accent: "amber", icon: "graduate", category: "Career" },
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
  { quote: "I interned on a live document-AI product and shipped a feature in week three. That put a real project on my resume.", name: "Aravind K.", role: "Data Science intern → hired", avatar: "https://i.pravatar.cc/120?img=12" },
  { quote: "We needed OCR for invoices fast. Meptrasoft shipped a working pipeline that cut our manual entry sharply.", name: "Priya S.", role: "Operations Lead, client", avatar: "https://i.pravatar.cc/120?img=45" },
  { quote: "The Generative AI course was hands-on the whole way. I built and deployed an app, not slides.", name: "Rahul M.", role: "GenAI course graduate", avatar: "https://i.pravatar.cc/120?img=33" },
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
  { id: "ai-engineer", title: "AI Engineer", type: "Full-time", location: "Hybrid" },
  { id: "data-scientist", title: "Data Scientist", type: "Full-time", location: "Hybrid" },
  { id: "fullstack", title: "Full Stack Developer", type: "Full-time", location: "Remote" },
  { id: "data-engineer", title: "Data Engineer", type: "Full-time", location: "Hybrid" },
];
