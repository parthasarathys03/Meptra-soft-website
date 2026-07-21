// Blog content. Plain ESM (shared with routes.mjs / seo-build.mjs).
// Types in blog.d.ts. Body = ordered blocks: {h2}, {p}, {ul}, {cta}.

/** @type {import('./blog').BlogPost[]} */
export const posts = [
  {
    slug: "free-vs-paid-internship-which-to-choose",
    title: "Free vs Paid Internship: Which Should You Choose?",
    description:
      "The real difference between free and paid internships, who each one suits, and how to pick the track that gets you hired faster.",
    date: "2026-06-18",
    author: "Meptrasoft AI Technologies",
    image: "/assets/blogs new one/6th one re.png",
    tags: ["Internships", "Careers"],
    body: [
      { p: "\"Should I take a free internship or a paid one?\" is one of the most common questions we hear from students. The honest answer: it depends on where you are right now, not on which sounds better." },
      { h2: "What a free internship really means" },
      { p: "A good free internship is merit-based. You clear a short interview or perform well in a course, and you join because you can already contribute. You work on real client products, get code reviews, and earn a certificate — at no cost. The catch is that you need to be job-ready enough to add value from early on." },
      { h2: "What a paid internship really means" },
      { p: "A paid internship is an investment in mentorship. If you're not job-ready yet, the fee pays for intensive one-on-one teaching that takes you from fundamentals to shipping real work. You do the same real projects and get the same certificate — the difference is the structured guidance that gets you there." },
      { h2: "How to choose" },
      { ul: [
        "Can you already build small projects and clear a technical interview? Aim for the free track.",
        "Are you starting out or switching fields and need structured teaching? The paid track will move you faster.",
        "Either way, insist on real projects, mentor code reviews, and a verifiable certificate — avoid 'internships' that are just recorded videos.",
      ] },
      { p: "At Meptrasoft AI Technologies, both tracks work on the same live products for the same duration. The only difference is how much mentorship you need to get productive." },
      { cta: { label: "Compare our internship tracks", to: "/internships/online" } },
    ],
    related: [
      { label: "Online Internship", to: "/internships/online" },
      { label: "Free Internship", to: "/internships/free" },
      { label: "Paid Internship", to: "/internships/paid" },
    ],
  },
  {
    slug: "how-to-choose-best-ai-course-tamil-nadu",
    title: "How to Choose the Best AI Course in Tamil Nadu (2026)",
    description:
      "A practical checklist for picking an AI course in Tamil Nadu — what to look for, what to avoid, and the skills that actually get you hired.",
    date: "2026-06-25",
    author: "Meptrasoft AI Technologies",
    image: "/assets/blogs new one/5th one re.png",
    tags: ["AI", "Courses"],
    body: [
      { p: "AI courses are everywhere now, and quality varies wildly. If you're a student in Tamil Nadu deciding where to spend your time and money, here's how to separate a course that builds real skills from one that just hands out a certificate." },
      { h2: "1. Does it end with something you built?" },
      { p: "The single best signal of a good AI course is a deployed project. If you finish with a working LLM or machine-learning application you can demo and explain, the course did its job. If you finish with only slides and a certificate, it didn't." },
      { h2: "2. Does it cover modern AI, not just 2018 theory?" },
      { p: "In 2026, a serious AI course covers large language models, retrieval-augmented generation (RAG), prompt engineering, evaluation, and agents — alongside machine-learning foundations. These are the skills employers ask about today." },
      { h2: "3. Is it taught in a language you learn best in?" },
      { p: "Concepts land faster in your strongest language. Courses taught in Tamil and English let you grasp hard ideas without a language barrier — a real advantage for many students in the state." },
      { h2: "4. Is there mentorship and an internship path?" },
      { ul: [
        "Mentor reviews mean someone checks your work and unblocks you.",
        "An internship path lets you apply the course on real products immediately.",
        "Placement support turns skills into a job.",
      ] },
      { p: "Our AI course is built around all four: a deployed AI app, modern GenAI content, Tamil-and-English instruction, and a direct path into an AI internship." },
      { cta: { label: "See the AI course", to: "/courses/ai" } },
    ],
    related: [
      { label: "AI Course", to: "/courses/ai" },
      { label: "AI Internship", to: "/internships/ai" },
      { label: "Python Course", to: "/courses/python" },
    ],
  },
  {
    slug: "modern-ai-ml-final-year-project-ideas",
    title: "20 Modern AI & ML Final-Year Project Ideas (2026)",
    description:
      "Fresh, defendable final-year project ideas across AI, machine learning, and deep learning — with tips to make yours stand out.",
    date: "2026-07-01",
    author: "Meptrasoft AI Technologies",
    image: "/assets/blogs new one/4 th one re .png",
    tags: ["Projects", "AI"],
    body: [
      { p: "A strong final-year project can set your resume apart — but only if it's original and you can defend it. Here are modern AI, ML, and deep-learning ideas worth building in 2026, grouped by area." },
      { h2: "Natural language & LLMs" },
      { ul: [
        "A RAG assistant that answers questions over your college's documents",
        "Automatic exam/answer-script evaluation with NLP",
        "Resume screening and job-matching with embeddings",
        "Regional-language (Tamil) text summarization",
      ] },
      { h2: "Computer vision & deep learning" },
      { ul: [
        "Crop disease detection from leaf images",
        "Real-time helmet / seatbelt violation detection",
        "Medical image classification (e.g., X-ray screening)",
        "Sign-language to text translation",
      ] },
      { h2: "Machine learning & data" },
      { ul: [
        "Student dropout / performance prediction",
        "Fraud or anomaly detection on transactions",
        "Demand forecasting for a small business",
        "Recommendation system for courses or products",
      ] },
      { h2: "What makes a project stand out" },
      { p: "Use real data, evaluate your model honestly, and ship a working demo. Examiners can tell the difference between a copied GitHub repo and a project you actually built and understand. Original scope plus a clear explanation of your results beats a flashy but borrowed build every time." },
      { cta: { label: "Get an original final-year project", to: "/final-year-projects/ai-ml" } },
    ],
    related: [
      { label: "AI & ML Projects", to: "/final-year-projects/ai-ml" },
      { label: "Deep Learning Projects", to: "/final-year-projects/deep-learning" },
      { label: "All Final-Year Projects", to: "/final-year-projects" },
    ],
  },
  {
    slug: "python-roadmap-for-beginners",
    title: "Python Roadmap for Beginners: From Zero to Job-Ready (2026)",
    description:
      "A complete, step-by-step Python roadmap for beginners — what to learn, code examples, project ideas, learning timeline, and how to land software & AI roles.",
    date: "2026-07-04",
    author: "Meptrasoft AI Technologies",
    image: "/assets/blogs new one/3rd one re.png",
    tags: ["Python", "Programming", "Roadmap"],
    body: [
      { p: "Python is undisputed as the most versatile and beginner-friendly programming language in modern software development. Whether your goal is building backend web applications, automating routine workflows, or diving into artificial intelligence and data science, Python is your entry point." },
      { p: "However, the biggest hurdle for beginners isn't learning to write code — it's knowing what to learn first, what to skip, and how to bridge the gap between basic syntax and real-world job readiness." },

      { h2: "The High-Level Learning Roadmap" },
      { p: "Here is the architectural overview of how a beginner progresses from writing their first 'Hello, World!' script to landing a job as a Python developer or AI engineer:" },
      { code: "┌─────────────────────────────────────────────────────────────┐\n│                     PYTHON ROADMAP 2026                      │\n├─────────────────────────────────────────────────────────────┤\n│ PHASE 1: Syntax & Core Fundamentals (Weeks 1 - 3)           │\n│ ──> Variables, Data Types, Control Flow, Functions          │\n├─────────────────────────────────────────────────────────────┤\n│ PHASE 2: Data Structures & OOP Mastery (Weeks 4 - 7)        │\n│ ──> Lists/Dicts, Classes, Error Handling, File & API I/O    │\n├─────────────────────────────────────────────────────────────┤\n│ PHASE 3: Domain Specialization (Weeks 8 - 10)               │\n│ ──> Choice A: Data Science & AI (Pandas, PyTorch, OpenAI)    │\n│ ──> Choice B: Web Backend (FastAPI, Django, PostgreSQL)     │\n├─────────────────────────────────────────────────────────────┤\n│ PHASE 4: Portfolio & Job Readiness (Weeks 11 - 12)          │\n│ ──> Deployed Projects, GitHub Commits, Placement Mock Rounds│\n└─────────────────────────────────────────────────────────────┘" },

      { h2: "Phase 1: Syntax & Core Fundamentals (Weeks 1–3)" },
      { p: "Start with the absolute essentials. Your objective in Phase 1 is to become comfortable reading and writing basic logic without constantly looking up syntax for simple operations." },

      { h3: "1. Variables & Data Types" },
      { p: "Understand how Python handles integers, floats, strings, booleans, and type conversion. Python uses dynamic typing, meaning variables infer their type automatically." },
      { code: "# Python Variables & Data Types\nname = \"Meptrasoft Student\"\nage = 21\nis_enrolled = True\nskills = [\"Python\", \"SQL\", \"Git\"]\n\n# Dynamic String Formatting (f-strings)\nprint(f\"Student {name} (Age: {age}) is enrolled: {is_enrolled}\")" },

      { h3: "2. Control Flow (Conditionals & Loops)" },
      { p: "Control flow determines how code executes decisions and repetitions. Master if/elif/else statements, for loops, and while loops." },
      { code: "# Conditional logic & looping over collections\nstudent_marks = {\"Alice\": 85, \"Bob\": 92, \"Charlie\": 78}\n\nfor student, score in student_marks.items():\n    if score >= 90:\n        grade = \"A+\"\n    elif score >= 80:\n        grade = \"A\"\n    else:\n        grade = \"B\"\n    print(f\"{student}: {score} -> Grade {grade}\")" },

      { h3: "3. Functions & Scope" },
      { p: "Functions organize code into reusable blocks. Learn positional parameters, keyword arguments, default parameters, and variable scope." },
      { code: "# Functions with Type Hints & Default Parameters\ndef calculate_stipend(base_pay: float, bonus: float = 1500.0) -> float:\n    \"\"\"Calculates total monthly stipend for an intern.\"\"\"\n    total = base_pay + bonus\n    return round(total, 2)\n\nmonthly_payout = calculate_stipend(10000.0)\nprint(f\"Monthly Stipend: ₹{monthly_payout}\")" },

      { h2: "Phase 2: Data Structures, OOP & System I/O (Weeks 4–7)" },
      { p: "Once basic syntax feels natural, shift your attention to managing structured data, object-oriented programming (OOP), file operations, and external web APIs." },

      { h3: "1. Built-in Data Structures" },
      { ul: [
        "Lists: Ordered, mutable sequences for sequential data.",
        "Tuples: Immutable sequences for fixed values and coordinates.",
        "Dictionaries: Key-value hash maps for fast O(1) lookups.",
        "Sets: Unordered collections of unique elements for deduplication."
      ] },
      { code: "# List Comprehensions & Dictionary Lookups\nraw_scores = [45, 88, 92, 67, 95, 73]\n# Filter scores >= 80 using list comprehension\ntop_performers = [score for score in raw_scores if score >= 80]\nprint(f\"Top Scores: {top_performers}\")" },

      { h3: "2. Object-Oriented Programming (OOP)" },
      { p: "Python is an object-oriented language. You must understand classes, instances, methods, inheritance, and encapsulation to build real applications." },
      { code: "# Object-Oriented Programming Example\nclass CourseStudent:\n    def __init__(self, name: str, course: str):\n        self.name = name\n        self.course = course\n        self.completed_modules = []\n\n    def complete_module(self, module_name: str):\n        self.completed_modules.append(module_name)\n        print(f\"{self.name} finished module: {module_name}\")\n\nstudent = CourseStudent(\"Karthik\", \"Python Developer Track\")\nstudent.complete_module(\"Data Structures & OOP\")" },

      { h3: "3. File Handling & REST API Requests" },
      { p: "Modern applications interact with disk files and web APIs. Practice reading/writing JSON files and using the requests module to fetch web data." },
      { code: "import json\nimport requests\n\n# Fetching JSON data from an external REST API\ndef fetch_github_user(username: str):\n    url = f\"https://api.github.com/users/{username}\"\n    response = requests.get(url)\n    if response.status_code == 200:\n        data = response.json()\n        return {\"name\": data.get(\"name\"), \"repos\": data.get(\"public_repos\")}\n    return None\n\nuser_info = fetch_github_user(\"octocat\")\nprint(f\"Fetched User Profile: {json.dumps(user_info, indent=2)}\")" },

      { h2: "Phase 3: Domain Specialization Choices (Weeks 8–10)" },
      { p: "Do not attempt to learn everything at once. Choose ONE primary branch based on your target career path:" },

      { h3: "Option A: Artificial Intelligence & Data Science" },
      { p: "If you want to build intelligent agents, machine learning models, or data analytics pipelines, focus on:" },
      { ul: [
        "NumPy & Pandas: Efficient tabular data manipulation and analytics.",
        "Matplotlib & Seaborn: Data visualization and distribution plots.",
        "Scikit-Learn: Classification, regression, and clustering algorithms.",
        "PyTorch / TensorFlow & LangChain: Neural networks, deep learning, and Generative AI applications."
      ] },
      { cta: { label: "Explore the AI & Machine Learning Course", to: "/courses/ai" } },

      { h3: "Option B: Backend Web Development" },
      { p: "If you prefer building robust server-side microservices, REST APIs, and database-driven web platforms, focus on:" },
      { ul: [
        "FastAPI / Flask: Lightweight, ultra-fast asynchronous Python web frameworks.",
        "Django: Full-featured battery-included web framework with built-in ORM and admin dashboard.",
        "PostgreSQL & SQLAlchemy: Relational databases, SQL queries, and ORM schemas."
      ] },
      { cta: { label: "Explore the Full-Stack & Software Track", to: "/courses/python" } },

      { h2: "Phase 4: Capstone Projects & Portfolio Building (Weeks 11–12)" },
      { p: "Resume screeners and recruiters prioritize proof of work over passive course certificates. Build and deploy 2–3 portfolio projects to GitHub." },

      { h3: "Recommended Portfolio Projects" },
      { ul: [
        "Project 1: Automated PDF / Excel Data Extractor & Report Generator (Automation & Scripting)",
        "Project 2: RESTful API for E-Commerce or EdTech using FastAPI & PostgreSQL (Backend Engineering)",
        "Project 3: AI Document Q&A Assistant using Retrieval-Augmented Generation (RAG) & Python (Artificial Intelligence)",
        "Project 4: Real-time Web Scraper & Price Tracker with Email Alerts (Web Scraping & System Operations)"
      ] },

      { h2: "Recommended Learning Resources" },
      { ul: [
        "Official Documentation: docs.python.org (The ultimate authority on standard library modules).",
        "Interactive Practice: LeetCode & HackerRank (Essential for clearing technical coding rounds).",
        "Version Control: Git & GitHub Documentation (Critical for managing project commits).",
        "Structured Mentored Courses: Meptrasoft AI's hands-on Python and AI training programs with live code reviews."
      ] },

      { h2: "How to Transition from Beginner to Hired" },
      { p: "Writing code in your code editor is only half the battle. To turn Python skills into a high-paying job offer, pair your technical learning with:" },
      { ul: [
        "Industry Internships: Work on real product repositories alongside senior developers.",
        "Verifiable GitHub Portfolio: Clean code, detailed READMEs, and deployed demo links.",
        "Placement Training: Structured aptitude, technical mock interviews, and resume preparation."
      ] },
      { cta: { label: "Explore Online Internships", to: "/internships/online" } },

      { h2: "Frequently Asked Questions (FAQs)" },

      { h3: "Is Python enough to get a job as a fresher?" },
      { p: "Python is a strong foundation, but you need to pair it with core software engineering tools: Git, SQL databases, basic HTML/CSS/JS or data frameworks, and problem-solving skills." },

      { h3: "How many hours a day should I practice Python?" },
      { p: "Consistency beats intensity. 1.5 to 2 hours of active coding daily for 90 days will yield vastly superior results compared to 10 hours once a week." },

      { h3: "Should I learn Python 2 or Python 3?" },
      { p: "Always learn Python 3. Python 2 reached its end-of-life in 2020 and is no longer supported in modern industrial environments." },

      { h3: "What internships can I apply for after learning Python?" },
      { p: "You can apply for Python Developer Internships, AI/ML Internships, Backend Engineering Internships, and Data Analyst Internships." }
    ],
    related: [
      { label: "Python Course", to: "/courses/python" },
      { label: "AI & ML Course", to: "/courses/ai" },
      { label: "Software Internships", to: "/internships/software" },
      { label: "Free Internships", to: "/internships/free" },
      { label: "Placement Training", to: "/placement-training" },
    ],
  },
  {
    slug: "it-placement-preparation-guide-freshers",
    title: "IT Placement Preparation: A Complete Fresher's Guide",
    description:
      "A stage-by-stage placement preparation guide for freshers — aptitude, coding, technical, and HR rounds, and how to prepare for each.",
    date: "2026-07-07",
    author: "Meptrasoft AI Technologies",
    image: "/assets/blogs new one/2nd one re.png",
    tags: ["Placement", "Careers"],
    body: [
      { p: "Landing your first IT job is less about talent and more about a system. Companies hire in stages, and each stage rewards a different kind of preparation. Here's the roadmap." },
      { h2: "1. Aptitude" },
      { p: "Quantitative, logical, and verbal reasoning under time pressure. Practice mock tests until speed and accuracy become automatic — this round filters out most candidates." },
      { h2: "2. Coding round" },
      { p: "Data structures and algorithms, solved cleanly within the time limit. Practice on real problems and get comfortable explaining your approach, not just producing an answer." },
      { h2: "3. Technical interview" },
      { ul: ["Core subjects and your chosen language", "Your final-year project — be ready to defend every decision", "Problem-solving out loud"] },
      { h2: "4. HR interview" },
      { p: "Communication, confidence, and fit. Many candidates lose offers here through weak communication, so prepare your introduction, resume walkthrough, and behavioral answers." },
      { h2: "The one thing colleges skip" },
      { p: "Communication and group-discussion skills. You'll use English to explain code, present projects, and work with clients — it's as important as the technical rounds. A structured placement program drills all of this with mock rounds and feedback." },
      { cta: { label: "Explore placement training", to: "/placement-training" } },
    ],
    related: [
      { label: "Placement Training", to: "/placement-training" },
      { label: "Python Course", to: "/courses/python" },
      { label: "Online Internship", to: "/internships/online" },
    ],
  },
  {
    slug: "online-internships-for-college-students-guide",
    title: "Online Internships for College Students: A Practical Guide",
    description:
      "How online internships work, how to spot a real one, and how to turn a remote internship into a job offer.",
    date: "2026-07-08",
    author: "Meptrasoft AI Technologies",
    image: "/assets/blogs new one/1st one re.png",
    tags: ["Internships", "Careers"],
    body: [
      { p: "Online internships opened real industry experience to students everywhere — no relocation, no gatekeeping by city. But not all of them are worth your time. Here's how to make one count." },
      { h2: "How a real online internship works" },
      { p: "You onboard remotely, get assigned real tasks on a live product, attend reviews, and ship your work — all online. A mentor reviews your code and unblocks you. At the end, you have a certificate and, more importantly, a history of real contributions." },
      { h2: "How to spot a fake one" },
      { ul: [
        "It's only pre-recorded videos with a certificate at the end — that's a course, not an internship.",
        "There's no mentor, no code review, and no real project.",
        "You never touch anything that goes live.",
      ] },
      { h2: "Turning an internship into an offer" },
      { p: "Treat it like a job. Communicate proactively, take reviews seriously, and go slightly beyond your assigned scope. Interns who build a visible track record of real commits are the ones who get hired — recruiters actually ask about them." },
      { cta: { label: "Apply for an online internship", to: "/internships/online" } },
    ],
    related: [
      { label: "Online Internship", to: "/internships/online" },
      { label: "AI Internship", to: "/internships/ai" },
      { label: "Web Development Internship", to: "/internships/web-development" },
    ],
  },
];

const bySlug = new Map(posts.map((p) => [p.slug, p]));
export const getPost = (slug) => bySlug.get(slug);
