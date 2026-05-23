const TALENTSTAGE_STORE_KEY = "talentstage.freelancer.v1";

function cloneTalentStageData(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildInitialTalentStageState() {
  return {
    currentUser: {
      name: "Alex Morgan",
      role: localStorage.getItem('talentstage_role') || "both",
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
      verifyStatus: "none",
      verifyMethod: null,
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
    savedFreelancers: [],
    milestones: cloneTalentStageData(MOCK_DATA.milestones || []),
    feed: cloneTalentStageData(MOCK_DATA.feed || []),
    challenges: cloneTalentStageData(MOCK_DATA.challenges || []),
    mentors: cloneTalentStageData(MOCK_DATA.mentors || []),
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

/* Compute profile completeness percentage */
function computeProfileCompleteness() {
  const state = getTalentStageState();
  const user = state.currentUser;
  const weights = {
    name: 10,
    title: 10,
    bio: 15,
    skills: 15,
    hourlyRate: 5,
    education: 5,
    experience: 10,
    portfolio: 15,
    verify: 15,
  };
  let score = 0;
  if (user.name && user.name.trim()) score += weights.name;
  if (user.title && user.title.trim()) score += weights.title;
  if (user.bio && user.bio.trim().length >= 20) score += weights.bio;
  if (user.skills && user.skills.length >= 3) score += weights.skills;
  if (user.hourlyRate && Number(user.hourlyRate) > 0) score += weights.hourlyRate;
  if (user.education && user.education.trim()) score += weights.education;
  if (user.experience && user.experience.trim()) score += weights.experience;
  if (state.portfolio && state.portfolio.length > 0) score += weights.portfolio;
  if (user.verifyStatus === 'verified' || user.verifyStatus === 'pending') score += weights.verify;
  return Math.min(100, score);
}

/* Get list of incomplete profile nudges */
function getProfileNudges() {
  const state = getTalentStageState();
  const user = state.currentUser;
  const nudges = [];
  if (!user.name || !user.name.trim()) nudges.push({ icon: '👤', label: 'Add your display name', link: '/profile/edit' });
  if (!user.title || !user.title.trim()) nudges.push({ icon: '💼', label: 'Add a professional title', link: '/profile/edit' });
  if (!user.bio || user.bio.trim().length < 20) nudges.push({ icon: '✍️', label: 'Write a compelling bio (20+ chars)', link: '/profile/edit' });
  if (!user.skills || user.skills.length < 3) nudges.push({ icon: '🏷️', label: 'Add at least 3 skills', link: '/profile/edit' });
  if (!user.hourlyRate || Number(user.hourlyRate) <= 0) nudges.push({ icon: '💰', label: 'Set your hourly rate', link: '/profile/edit' });
  if (!user.education || !user.education.trim()) nudges.push({ icon: '🎓', label: 'Add your education', link: '/profile/edit' });
  if (!user.experience || !user.experience.trim()) nudges.push({ icon: '📋', label: 'Add work experience', link: '/profile/edit' });
  if (!state.portfolio || state.portfolio.length === 0) nudges.push({ icon: '📂', label: 'Upload a portfolio project', link: '/upload' });
  if (user.verifyStatus !== 'verified' && user.verifyStatus !== 'pending') nudges.push({ icon: '🔒', label: 'Verify your identity', link: '/verify' });
  return nudges;
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
  computeCompleteness: computeProfileCompleteness,
  getNudges: getProfileNudges,
};
