// Per-route SEO manifest. Single source for <head>, JSON-LD, and sitemap.
// New landing/location/blog routes get appended here as they are built.
import {
  ORIGIN,
  organizationSchema,
  websiteSchema,
  faqSchema,
  courseSchema,
  serviceSchema,
  breadcrumbSchema,
  articleSchema,
  localBusinessSchema,
} from "./config.mjs";
import { landings } from "../data/landings.mjs";
import { locations } from "../data/locations.mjs";
import { posts } from "../data/blog.mjs";

const HOME_CRUMB = { name: "Home", path: "/" };

// Kept in sync with src/data/content.ts faqs (home). Duplicated here so the
// build-time head injector can emit static FAQPage JSON-LD without importing TS.
const homeFaqs = [
  {
    question: "How long does an AI product engagement take?",
    answer:
      "Most engagements run 6–12 weeks from scoping to a shipped v1, depending on integration complexity. We work in short sprints so you see working software early, not just a plan.",
  },
  {
    question: "Do you only build AI products, or handle web, app & data too?",
    answer:
      "Both. We deliver AI & Generative AI, web and app development, data engineering & BI, and cloud/security/DevOps — one team scopes across all of it.",
  },
  {
    question: "What's included in the training & internship programs?",
    answer:
      "Live instruction, hands-on projects on real client-style codebases, mentor code reviews, and a completion certificate. The placement track adds mock interviews and a structured interview roadmap.",
  },
  {
    question: "Do students and interns work on real client projects?",
    answer:
      "Yes. Interns build inside the same codebases we ship to paying clients, under mentor supervision — not standalone practice exercises.",
  },
];

/** @type {import('./config').RouteSeo[]} */
const baseRoutes = [
  {
    path: "/",
    title: "Meptrasoft AI Technologies | AI Products, Internships & Courses in Tamil Nadu",
    description:
      "Meptrasoft AI Technologies builds AI products for businesses and trains the engineers who build them — online internships, AI & Python courses, final-year projects, and placement training across Tamil Nadu.",
    keywords: [
      "Meptrasoft AI",
      "Meptrasoft AI Technologies",
      "meptrasoftai.in",
      "AI company Tamil Nadu",
      "online internship",
      "AI internship",
      "placement training",
    ],
    priority: 1.0,
    changefreq: "weekly",
    schema: [organizationSchema(), websiteSchema(), faqSchema(homeFaqs)],
  },
  {
    path: "/solutions",
    title: "AI, Software & Data Solutions for Business | Meptrasoft AI Technologies",
    description:
      "Custom AI & Generative AI, RAG, web & app development, data engineering, BI, and cloud/DevOps — technology services and in-house AI products built to ship, from Tamil Nadu.",
    keywords: [
      "AI development company",
      "generative AI services",
      "RAG solutions",
      "web development",
      "app development",
      "data engineering",
      "cloud DevOps",
    ],
    priority: 0.9,
    changefreq: "monthly",
    breadcrumbs: [HOME_CRUMB, { name: "Solutions", path: "/solutions" }],
    schema: [
      serviceSchema({
        name: "AI & Software Development Services",
        description:
          "Custom AI, generative AI, web, app, data engineering, and cloud services for businesses.",
        path: "/solutions",
        serviceType: "Software & AI Development",
      }),
      breadcrumbSchema([HOME_CRUMB, { name: "Solutions", path: "/solutions" }]),
    ],
  },
  {
    path: "/learn",
    title: "Internships, Courses & Placement Training | Meptrasoft AI Technologies",
    description:
      "Job-focused courses, online internships, IEEE final-year projects, and a placement preparation program for college students in Tamil Nadu. Learn by building on real AI products.",
    keywords: [
      "online internship",
      "AI course",
      "Python course",
      "placement training",
      "final year projects",
      "industrial training",
      "internship Tamil Nadu",
    ],
    priority: 0.9,
    changefreq: "weekly",
    breadcrumbs: [HOME_CRUMB, { name: "Learn", path: "/learn" }],
    schema: [
      courseSchema({
        name: "Placement Preparation Program",
        description:
          "Aptitude, coding, technical & HR interview preparation with mentor support until you're placed.",
        path: "/learn",
      }),
      breadcrumbSchema([HOME_CRUMB, { name: "Learn", path: "/learn" }]),
    ],
  },
  {
    path: "/placement-training",
    title: "Placement Training for College Students — Aptitude, Coding & Interview Prep | Meptrasoft AI",
    description:
      "Complete placement preparation program for college students in Tamil Nadu — aptitude training, coding rounds, technical & HR interview prep, mock tests, resume building, and AI tools training. 3-day free demo available.",
    keywords: [
      "placement training",
      "placement preparation",
      "campus placement training",
      "aptitude training for placements",
      "coding interview preparation",
      "technical interview prep",
      "HR interview preparation",
      "mock interviews",
      "placement training for college students",
      "placement training Tamil Nadu",
      "placement training Chennai",
      "IT job preparation",
      "fresher job training",
      "campus recruitment preparation",
      "placement training online",
    ],
    priority: 0.9,
    changefreq: "weekly",
    breadcrumbs: [HOME_CRUMB, { name: "Learn", path: "/learn" }, { name: "Placement Training", path: "/placement-training" }],
    schema: [
      courseSchema({
        name: "Placement Preparation Program",
        description:
          "Comprehensive placement training covering aptitude, coding, technical & HR interview preparation for college students. Includes mock tests, AI tools training, resume building, and mentor support until placed.",
        path: "/placement-training",
      }),
      faqSchema([
        {
          question: "What is placement training and why do I need it?",
          answer:
            "Placement training is a structured program that prepares you for every stage of campus recruitment — aptitude tests, coding rounds, technical interviews, and HR interviews. Most colleges don't cover all of these in depth, so students who prepare separately perform significantly better in placement drives.",
        },
        {
          question: "Who is this placement training program for?",
          answer:
            "It's designed for final-year and pre-final-year engineering students, freshers looking for their first IT job, and anyone preparing for campus placements. Any branch — CSE, ECE, EEE, Mechanical, Civil — is welcome.",
        },
        {
          question: "How long is the placement preparation program?",
          answer:
            "The program runs for 3 months of intensive training, plus continued mentor support until you finish college and get placed.",
        },
        {
          question: "Is there a free demo before I pay?",
          answer:
            "Yes. You can attend 3 days of free live demo classes. Experience our teaching style, ask questions, and explore the full curriculum. If you're not satisfied, you don't pay anything.",
        },
        {
          question: "Will I get mock interviews and practice tests?",
          answer:
            "Yes — mock aptitude tests, mock coding rounds, mock technical interviews, and mock HR interviews are all part of the program.",
        },
        {
          question: "Do you teach AI tools like ChatGPT and GitHub Copilot?",
          answer:
            "Yes. We train you to use AI tools like ChatGPT, Claude, and GitHub Copilot to build real industry-level projects.",
        },
        {
          question: "What if I'm from a non-CS branch like ECE, Mechanical, or Civil?",
          answer:
            "Our program starts from the fundamentals. Many of our successful graduates are from non-CS branches. We teach everything from scratch.",
        },
      ]),
      breadcrumbSchema([HOME_CRUMB, { name: "Learn", path: "/learn" }, { name: "Placement Training", path: "/placement-training" }]),
    ],
  },
  {
    path: "/careers",
    title: "Careers & Internship Openings | Meptrasoft AI Technologies",
    description:
      "Join Meptrasoft AI Technologies. Open roles and online internships in AI engineering, web development, Flutter, cloud, SQL, and digital marketing — work on real products.",
    keywords: ["AI jobs", "internship openings", "web developer intern", "AI engineer job", "careers Tamil Nadu"],
    priority: 0.7,
    changefreq: "weekly",
    breadcrumbs: [HOME_CRUMB, { name: "Careers", path: "/careers" }],
    schema: [breadcrumbSchema([HOME_CRUMB, { name: "Careers", path: "/careers" }])],
  },
  {
    path: "/about",
    title: "About Meptrasoft AI Technologies | AI Products × Engineering Education",
    description:
      "One company bridging industry and education: we build AI products for businesses and train the engineers who build them. Learn about Meptrasoft AI Technologies.",
    keywords: ["about Meptrasoft", "Meptrasoft AI Technologies", "AI education company"],
    priority: 0.6,
    changefreq: "monthly",
    breadcrumbs: [HOME_CRUMB, { name: "About", path: "/about" }],
    schema: [breadcrumbSchema([HOME_CRUMB, { name: "About", path: "/about" }])],
  },
  {
    path: "/contact",
    title: "Contact Meptrasoft AI Technologies | WhatsApp, Call & Email",
    description:
      "Talk to Meptrasoft AI Technologies. Students, businesses, and job seekers — reach us on WhatsApp, call +91 93459 84804, or email. We reply fast.",
    keywords: ["contact Meptrasoft", "Meptrasoft AI contact", "AI company contact Tamil Nadu"],
    priority: 0.6,
    changefreq: "monthly",
    breadcrumbs: [HOME_CRUMB, { name: "Contact", path: "/contact" }],
    schema: [breadcrumbSchema([HOME_CRUMB, { name: "Contact", path: "/contact" }])],
  },
];

// Landing pages: derive SEO route entries from the shared content module so
// title/description/schema never drift from what the page renders.
const landingRoutes = landings.map((l) => {
  const isCourse = l.path.startsWith("/courses/");
  const mid = l.path.startsWith("/internships/")
    ? { name: "Internships", path: "/internships" }
    : { name: "Learn", path: "/learn" };
  const crumbs = [HOME_CRUMB, mid, { name: l.eyebrow, path: l.path }];
  const primary = isCourse
    ? courseSchema({ name: l.h1, description: l.subtitle, path: l.path })
    : serviceSchema({ name: l.h1, description: l.subtitle, path: l.path });
  return {
    path: l.path,
    title: `${l.h1} | Meptrasoft AI Technologies`,
    description: l.subtitle,
    keywords: [l.eyebrow, ...l.related.map((r) => r.label)],
    priority: 0.8,
    changefreq: "weekly",
    breadcrumbs: crumbs,
    schema: [primary, faqSchema(l.faqs), breadcrumbSchema(crumbs)],
  };
});

// Internships hub — canonical parent of /internships/*.
const internshipChildren = landings.filter((l) => l.path.startsWith("/internships/"));
const internshipsCrumbs = [HOME_CRUMB, { name: "Learn", path: "/learn" }, { name: "Internships", path: "/internships" }];
const internshipsHubRoute = {
  path: "/internships",
  title: "Internships in Tamil Nadu — AI, Software, Python & Data Science | Meptrasoft AI",
  description:
    "Online AI, software, web development, free and paid internships on real client projects for students in Chennai, Cuddalore, and across Tamil Nadu. Mentored, remote, certificate-backed.",
  keywords: [
    "AI internship",
    "software internship",
    "Python internship",
    "data science internship",
    "machine learning internship",
    "web development internship",
    "online internship",
    "free internship",
    "internship in Chennai",
    "internship in Cuddalore",
    "internship in Tamil Nadu",
  ],
  priority: 0.9,
  changefreq: "weekly",
  breadcrumbs: internshipsCrumbs,
  schema: [
    serviceSchema({
      name: "Internship Programs",
      description:
        "Online AI, software, web development, free and paid internships on real client products across Tamil Nadu.",
      path: "/internships",
      serviceType: "Internship program",
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Internship tracks",
      itemListElement: internshipChildren.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.h1,
        url: `${ORIGIN}${l.path}`,
      })),
    },
    faqSchema([
      {
        question: "What internships does Meptrasoft AI offer?",
        answer:
          "AI, software, web development, free, paid, and online internships — all on real client products with mentor code reviews. More specializations (Python, data science, machine learning, generative AI, cloud, full stack) are added based on demand.",
      },
      {
        question: "Are the internships online and available across Tamil Nadu?",
        answer:
          "Yes. Every internship is remote and open to students across Chennai, Cuddalore, and all Tamil Nadu districts, delivered in Tamil and English.",
      },
      {
        question: "Is there a free internship option?",
        answer:
          "Yes — a merit-based free track and a mentored paid track. Both work on real products and end with a verifiable certificate.",
      },
    ]),
    breadcrumbSchema(internshipsCrumbs),
  ],
};

// Location pages (local SEO).
const locationsIndexRoute = {
  path: "/locations",
  title: "Where We Work — AI Training & Software Across Tamil Nadu | Meptrasoft AI",
  description:
    "Meptrasoft AI Technologies serves students and businesses across Tamil Nadu and Puducherry — Chennai, Cuddalore, Villupuram, Tiruvannamalai, Kallakurichi, and more.",
  keywords: ["AI company Tamil Nadu", "internship Tamil Nadu", "AI course Tamil Nadu", "areas we serve"],
  priority: 0.6,
  changefreq: "monthly",
  breadcrumbs: [HOME_CRUMB, { name: "Locations", path: "/locations" }],
  schema: [breadcrumbSchema([HOME_CRUMB, { name: "Locations", path: "/locations" }])],
};

// Short + alias name from "Tiruchirappalli (Trichy)" → ["Tiruchirappalli","Trichy"].
const cityNames = (full) => {
  const m = full.match(/^(.*?)\s*\((.*?)\)\s*$/);
  return m ? [m[1].trim(), m[2].trim()] : [full];
};

const locationFaqs = (name, region) => [
  {
    question: `Do you offer online internships and courses in ${name}?`,
    answer: `Yes. Every program — AI, software and Python courses, data science, web development, generative AI training, internships, projects, and placement training — is delivered online in Tamil and English to students across ${name}, ${region}.`,
  },
  {
    question: `Can students in ${name} do a free internship?`,
    answer: `Yes. Our free internship is merit-based (interview or top course performance), and a mentored paid track is available if you're not job-ready yet. Both work on real client products.`,
  },
  {
    question: `Do you help with final-year and college projects in ${name}?`,
    answer: `Yes. We build original IEEE, AI, ML, and deep-learning final-year and college projects for ${name} students, with source code, documentation, and viva support.`,
  },
];

const locationRoutes = locations.map((c) => {
  const path = `/locations/${c.slug}`;
  const [name, alias] = cityNames(c.city);
  const crumbs = [HOME_CRUMB, { name: "Locations", path: "/locations" }, { name: c.city, path }];
  const intents = [
    `AI internship in ${name}`,
    `free internship in ${name}`,
    `software internship in ${name}`,
    `Python course in ${name}`,
    `AI course in ${name}`,
    `data science course in ${name}`,
    `web development course in ${name}`,
    `generative AI training in ${name}`,
    `final year projects in ${name}`,
    `college projects in ${name}`,
    `industrial training in ${name}`,
    `placement training in ${name}`,
  ];
  return {
    path,
    title: `AI Internship, Courses & Final-Year Projects in ${name} | Meptrasoft AI`,
    description: `${c.lead} Online AI & free internships, Python, AI, data science, web development & generative AI courses, final-year & college projects, industrial training, and placement training for students in ${name}, ${c.region}.`,
    keywords: alias ? [...intents, `internship in ${alias}`, `AI course in ${alias}`] : intents,
    priority: 0.7,
    changefreq: "monthly",
    breadcrumbs: crumbs,
    schema: [
      localBusinessSchema({ city: name, region: c.region, path, areas: [name, ...(alias ? [alias] : []), c.region] }),
      serviceSchema({
        name: `AI training, internships & software in ${name}`,
        description: `Online AI/software internships, AI, Python, data science, web development and generative AI courses, final-year & college projects, industrial and placement training for ${name}, ${c.region}.`,
        path,
        serviceType: "Education & software services",
        areas: [name, c.region],
      }),
      faqSchema(locationFaqs(name, c.region)),
      breadcrumbSchema(crumbs),
    ],
  };
});

// Blog.
const blogIndexRoute = {
  path: "/blog",
  title: "Blog — Internships, AI Courses, Projects & Placements | Meptrasoft AI",
  description:
    "Guides and tips on online internships, AI and Python courses, final-year projects, and IT placement preparation for students in Tamil Nadu.",
  keywords: ["internship guide", "AI course tips", "final year project ideas", "placement preparation", "Python roadmap"],
  priority: 0.6,
  changefreq: "weekly",
  breadcrumbs: [HOME_CRUMB, { name: "Blog", path: "/blog" }],
  schema: [breadcrumbSchema([HOME_CRUMB, { name: "Blog", path: "/blog" }])],
};

const blogRoutes = posts.map((p) => {
  const path = `/blog/${p.slug}`;
  const crumbs = [HOME_CRUMB, { name: "Blog", path: "/blog" }, { name: p.title, path }];
  return {
    path,
    title: `${p.title} | Meptrasoft AI Technologies`,
    description: p.description,
    keywords: p.tags,
    priority: 0.6,
    changefreq: "monthly",
    ogType: "article",
    ogImage: p.image?.startsWith("http") ? p.image : `${ORIGIN}${p.image}`,
    breadcrumbs: crumbs,
    schema: [
      articleSchema({
        title: p.title,
        description: p.description,
        path,
        image: p.image,
        date: p.date,
        author: p.author,
      }),
      breadcrumbSchema(crumbs),
    ],
  };
});

export const routes = [
  ...baseRoutes,
  internshipsHubRoute,
  ...landingRoutes,
  locationsIndexRoute,
  ...locationRoutes,
  blogIndexRoute,
  ...blogRoutes,
];

const byPath = new Map(routes.map((r) => [r.path, r]));

/** Look up route SEO; falls back to home. */
export function getRoute(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return byPath.get(clean) || byPath.get("/");
}

export { ORIGIN };
