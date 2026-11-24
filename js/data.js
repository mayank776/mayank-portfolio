/* ------------------------------------------------------------------
   EDIT ME — everything shown on the inner pages comes from here.
   ------------------------------------------------------------------ */
window.SITE = {
  name: "Mayank Attri",
  role: "Software Engineer · Full-Stack AI-Accelerated Development",
  tagline: "I build production full-stack systems and AI-powered automation.",
  email: "attrimayank16@gmail.com",
  phone: "+91 87505 96624",
  links: [
    { label: "GitHub", href: "https://github.com/mayank776", handle: "mayank776" },
    { label: "LinkedIn", href: "https://linkedin.com/in/mayank-attri-99757a137", handle: "mayank-attri" },
    { label: "X / Twitter", href: "https://x.com/AI_with_Attri", handle: "@AI_with_Attri" },
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

  // The Lab: big ideas, explained for beginners.
  // To add an idea, copy one block below: id (used in the URL), title, hook,
  // color, source, steps (3-6 short cards) and vision. Optional: try (a command to copy).
  lab: [
    {
      id: "neural-nets",
      title: "Neural networks",
      hook: "How a guess, a mistake and a nudge became ChatGPT.",
      color: "#ad4a3b",
      source: { title: "Neural Networks: Zero to Hero", by: "Andrej Karpathy", href: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", cta: "Watch the series" },
      steps: [
        { name: "A neuron, by hand", tags: ["micrograd", "backpropagation"],
          blurb: "A neural network is just a big math function with knobs. Backpropagation tells every knob which way to turn to make fewer mistakes. Build it in about 100 lines of Python and the magic becomes mechanics." },
        { name: "Teaching it to write", tags: ["makemore", "next-letter prediction"],
          blurb: "Show it 32,000 names and let it guess the next letter, again and again. Soon it invents names that never existed. That one trick, predicting what comes next, is the seed of every language model." },
        { name: "Going deeper, staying stable", tags: ["MLP", "BatchNorm", "gradients"],
          blurb: "Stack more layers and things break: signals fade away or blow up. Learn to read a network's vital signs and keep training healthy, the quiet skill that makes deep learning work." },
        { name: "Looking further back", tags: ["WaveNet", "context"],
          blurb: "Better guesses need a longer memory. Arrange the layers like a tree so the model can take in a bigger stretch of text at once." },
        { name: "Building GPT", tags: ["attention", "tokenizer", "GPT-2"],
          blurb: "Attention lets every word look at every other word and decide what matters. Build a GPT from scratch, write its tokenizer, then reproduce GPT-2: the same blueprint behind ChatGPT." },
      ],
      vision: "None of this is magic. The systems changing how we write, code and learn are made of small parts you can build in an afternoon: a guess, a mistake, a nudge, repeated billions of times. Understanding them from scratch is how you stop just using AI and start shaping it.",
    },
    {
      id: "rea",
      title: "Reverse engineering",
      hook: "Ask your AI agent how any app really works.",
      color: "#3d6184",
      source: { title: "REA: Reverse Engineer Anything", by: "rea.tools", href: "https://rea.tools/", cta: "Visit rea.tools" },
      try: "npx rea-agents@latest setup",
      steps: [
        { name: "Every app is a closed box", tags: ["curiosity"],
          blurb: "Every app, game and website runs on instructions you never see. Reverse engineering is the art of opening the box and reading them." },
        { name: "Ask one question", tags: ["coding agents", "Claude Code"],
          blurb: "Pick a single feature, like how fast the Chrome dinosaur game speeds up, and ask your coding agent about it." },
        { name: "Let the agent look inside", tags: ["code", "runtime"],
          blurb: "REA gives the agent tools to read the program's code and watch what it actually does while it runs, instead of guessing." },
        { name: "Get a real answer", tags: ["dino game", "calculator"],
          blurb: "The dino starts at speed 6 and climbs toward 13. Windows Calculator's % key follows two different rules, depending on whether it comes after + or ×. Real rules, found in the real program." },
        { name: "Rebuild it, change it", tags: ["experiments", "RL environments"],
          blurb: "Explain the feature, then try a change. REA can even turn a recorded web app session into a local playground for training and testing AI agents." },
      ],
      vision: "Software stops being a black box. When anyone can ask why a program behaves the way it does and get a real answer, every app becomes a textbook, and learning to build becomes learning by taking things apart.",
    },
    {
      id: "quantum",
      title: "Quantum computing",
      hook: "Computers that work the way nature does.",
      color: "#75496e",
      source: { title: "Quantum computing for the very curious", by: "Andy Matuschak & Michael Nielsen", href: "https://quantum.country/qcvc", cta: "Read the essay" },
      steps: [
        { name: "Bits become qubits", tags: ["qubit", "superposition"],
          blurb: "An ordinary bit is 0 or 1. A qubit can be a blend of both at once, written as a small vector of numbers called its state." },
        { name: "Gates that reshape a qubit", tags: ["NOT gate", "Hadamard"],
          blurb: "Quantum programs are circuits of gates. The NOT gate flips a qubit; the Hadamard gate turns a certain 0 into an even blend of 0 and 1." },
        { name: "Looking changes everything", tags: ["measurement", "probability"],
          blurb: "Measuring a qubit forces it to pick 0 or 1, with odds set by its state. The art is arranging gates so the answer you want becomes the likely one." },
        { name: "Qubits working together", tags: ["CNOT", "universal computing"],
          blurb: "The controlled-NOT gate links two qubits so one steers the other. With a small set of gates like these, you can build any quantum computation." },
        { name: "Learning that sticks", tags: ["spaced repetition", "mnemonic medium"],
          blurb: "The essay is an experiment too: questions woven into the reading come back over days and weeks, so the ideas stay with you for years instead of days." },
      ],
      vision: "The physicist David Deutsch asked whether one machine could simulate any physical system. Quantum computers are that question turning into hardware. Learning their math today is like learning to program when computers still filled whole rooms.",
    },
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
