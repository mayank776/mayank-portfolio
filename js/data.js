/* ------------------------------------------------------------------
   EDIT ME — everything shown on the inner pages comes from here.
   ------------------------------------------------------------------ */
window.SITE = {
  name: "Mayank Attri",
  role: "Software Engineer · Full-Stack AI-Accelerated Development",
  tagline: "I build production full-stack systems and AI-powered automation.",
  email: "attrimayank16@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/mayank776" },
    { label: "LinkedIn", href: "https://linkedin.com/in/mayank-attri-99757a137" },
  ],

  projects: [
    {
      name: "Shubh Patrika",
      year: "2026",
      status: "Live",
      blurb:
        "Invitations that guests love to open. Every wedding, birthday or griha pravesh gets its own webpage: pick a template, fill in names, dates and venues, and share one link. Guests RSVP, get directions and see the gift list. ₹100 per invite, no subscription.",
      tags: ["JavaScript", "Express", "HTML / CSS", "QR codes"],
      links: [{ label: "Live", href: "https://shubh-patrika-delta.vercel.app" }],
    },
    {
      name: "The Road to Doomsday",
      year: "2026",
      status: "Live",
      blurb:
        "A visual, evidence-labelled guide to the MCU threads leading into Avengers: Doomsday: a ten-stop timeline, a Doctor Doom dossier, a 3D connections map you can orbit, and flip-card clues, each tagged confirmed, supported or fan theory.",
      tags: ["Next.js", "TypeScript", "Three.js / R3F", "GSAP", "Tailwind"],
      links: [
        { label: "Live", href: "https://road-to-doomsday-nu.vercel.app" },
        { label: "Code", href: "https://github.com/mayank776/road-to-doomsday" },
      ],
    },
  ],

  experience: [
    {
      role: "AI Product Developer",
      org: "Vonazon",
      period: "Dec 2025 — now",
      note: "Client-facing AI consulting — project specifics withheld per NDA.",
      points: [
        "AI-accelerated development: daily use of Claude Code and LLM APIs to architect, generate, debug and ship production code within Agile/Scrum sprints.",
        "MCP server authoring: built custom Model Context Protocol servers wrapping authenticated third-party APIs, so AI agents can use enterprise services as structured tools.",
        "Agentic workflows: designed multi-step agent pipelines combining LLM reasoning with external tools, APIs and data sources; orchestrated business processes with n8n.",
        "Full-stack delivery across React frontends, Node.js backends, REST API layers and cloud infrastructure.",
        "Integration engineering: bidirectional API integrations with OAuth 2.0, webhook listeners, retry/backoff logic and data-sync strategies for CRM platforms.",
      ],
    },
    {
      role: "Full-Stack Developer",
      org: "Eupheus Learning",
      period: "May 2022 — Feb 2025",
      points: [
        "Payment infrastructure: multi-gateway integrations (RazorPay, Paytm, BillDesk, SmartPay) processing ₹5 Cr+ monthly at a 99.98% success rate across 100,000+ monthly transactions.",
        "High-volume pipeline: a Redis-backed receipt system generating 30,000+ unique documents daily, improving fee-collection efficiency by 20%.",
        "Designed and maintained 200+ REST APIs for 1,000+ schools serving 3–5 lakh students; cut report-generation lag by 63%.",
        "Full-stack ownership of the Transport, Expense Ledger, Inventory Management and School Shop modules — from DB schema to Angular UI.",
        "Managed AWS/GCP deployments, built SMTP event-driven notifications, and led an intern team on integrations, contributing to a 50% pricing-tier increase.",
      ],
    },
    {
      role: "Graduate Trainee",
      org: "Nektar.ai",
      period: "Jan 2022 — May 2022",
      points: [
        "Built React/TypeScript UI components with Styled-Components and framer-motion; integrated Sentry.io for real-time frontend and backend error monitoring.",
      ],
    },
    {
      role: "Software Engineer Intern",
      org: "FunctionUp",
      period: "Aug 2021 — Jan 2022",
      points: [
        "Built RESTful APIs in Node.js with MongoDB/Mongoose: JWT auth, RBAC, middleware pipelines and aggregation-based query optimisations.",
      ],
    },
  ],

  // The Lab: AI agents and experiments.
  lab: [
    {
      name: "Ambient Email Agent",
      stack: ["LangGraph", "Gmail API", "LangSmith"],
      blurb:
        "An autonomous agent that triages and drafts replies to 100+ emails a day, saving about 80% of the manual effort. Adaptive memory improved response quality by 40% over time.",
    },
    {
      name: "DocChat — Multi-Agent RAG",
      stack: ["ADK", "Mistral", "BM25", "ChromaDB"],
      blurb:
        "Hybrid BM25 + vector retrieval with a self-correcting agent loop that cuts hallucinations when answering over complex document sets.",
    },
  ],
  certifications: [
    "Agentic AI with LangChain & LangGraph — IBM",
    "Advanced RAG with Vector Databases — IBM",
    "Build Multimodal GenAI Apps — IBM",
    "Fundamentals of Building AI Agents",
  ],
  education: { degree: "B.Tech — Metallurgical & Materials Engineering", school: "NIT Rourkela", period: "2017 — 2021" },

  toolkit: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Python"] },
    { group: "Frontend", items: ["React 19", "Next.js 15", "Angular", "Tailwind"] },
    { group: "Backend", items: ["Node.js", "FastAPI", "Express", "REST APIs"] },
    { group: "Databases", items: ["MongoDB", "Redis"] },
    { group: "Cloud & DevOps", items: ["AWS", "Docker", "CI/CD", "nginx", "Git"] },
    { group: "AI & agents", items: ["MCP servers", "LangGraph", "RAG", "ADK"] },
    { group: "AI dev tools", items: ["Claude Code", "Cursor", "OpenClaw"] },
    { group: "Integrations", items: ["OAuth 2.0", "OpenAPI", "Webhooks", "n8n"] },
  ],
};
