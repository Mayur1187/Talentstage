const TALENTSTAGE_STORE_KEY = "talentstage.freelancer.v1";

function cloneTalentStageData(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildInitialTalentStageState() {
  return {
    currentUser: {
      name: "Alex Morgan",
      role: "both",
      email: "alex@example.com",
      title: "Full-Stack Creator",
      bio: "Building beautiful products at the intersection of design and code. 5+ years shipping SaaS and marketplace experiences.",
      skills: ["React", "Flask", "Figma", "Python"],
      hourlyRate: 75,
      availability: "Available",
      education: "B.S. Computer Science",
      experience: "Senior Developer at TechFlow (2022-2025)\nUI Engineer at Creative Labs (2019-2022)",
      completeness: 78,
      badges: ["Verified React Developer"],
    },
    portfolio: [
      { id: 1, title: "FinTech Dashboard", desc: "Redesigned analytics dashboard - 34% faster task completion.", tools: ["Figma", "React"], category: "Design", link: "https://example.com/fintech", image: "" },
      { id: 2, title: "Health App UI Kit", desc: "Complete mobile design system with 40+ components.", tools: ["Figma", "Principle"], category: "Design", link: "https://example.com/health-kit", image: "" },
      { id: 3, title: "E-learning Platform", desc: "End-to-end UX for 50k+ monthly active learners.", tools: ["Figma", "User Research"], category: "UX", link: "https://example.com/learning", image: "" },
    ],
    proposals: [],
    contracts: [
      { id: 1, title: "Landing Page Build", client: "StartupXYZ", freelancer: "Alex Morgan", status: "In Progress", progress: 65, value: 3000, dueDate: "2026-06-05", files: ["wireframes.pdf"], messages: [{ from: "Client", text: "Latest designs are in the shared folder." }, { from: "Freelancer", text: "Thanks! Reviewing now." }], deliverables: [{ name: "Wireframes", done: true }, { name: "Hi-fi mockups", done: true }, { name: "React components", done: false }] },
      { id: 2, title: "Brand Video Pack", client: "Bloom Retail", freelancer: "Alex Morgan", status: "Review", progress: 90, value: 1800, dueDate: "2026-05-29", files: ["storyboard.pdf", "draft-video.mp4"], messages: [{ from: "Client", text: "Revision notes attached for video 2." }], deliverables: [{ name: "Storyboard", done: true }, { name: "3 edited videos", done: true }, { name: "Final export", done: false }] },
    ],
    earnings: { total: 28450, pending: 2200, withdrawn: 26250, commission: 2845 },
    withdrawals: cloneTalentStageData(MOCK_DATA.withdrawals || []),
    reviews: cloneTalentStageData(MOCK_DATA.reviews || []),
    projects: cloneTalentStageData(MOCK_DATA.projects || []),
  };
}

function getTalentStageState() {
  const saved = localStorage.getItem(TALENTSTAGE_STORE_KEY);
  if (!saved) {
    const initial = buildInitialTalentStageState();
    localStorage.setItem(TALENTSTAGE_STORE_KEY, JSON.stringify(initial));
    return initial;
  }
  return Object.assign(buildInitialTalentStageState(), JSON.parse(saved));
}

function saveTalentStageState(state) {
  localStorage.setItem(TALENTSTAGE_STORE_KEY, JSON.stringify(state));
  return state;
}

window.TalentStageStore = {
  get: getTalentStageState,
  save: saveTalentStageState,
  reset() {
    localStorage.removeItem(TALENTSTAGE_STORE_KEY);
    return getTalentStageState();
  },
  money(value) {
    return `$${Number(value || 0).toLocaleString()}`;
  },
  stars(rating) {
    return "★".repeat(Number(rating || 0));
  },
  splitCSV(value) {
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  },
};
