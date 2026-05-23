const MOCK_DATA = {
  stats: { freelancers: 12400, projects: 3200, paidOut: 8.2, countries: 67 },
  freelancers: [
    { id: 1, name: "Priya Sharma", title: "Senior UI/UX Designer", skills: ["Figma", "React", "Design Systems"], rate: 65, rating: 4.9, verified: ["React", "Figma"], availability: "Available", completeness: 92, avatar: "PS", category: "Design" },
    { id: 2, name: "Marcus Chen", title: "Full-Stack Developer", skills: ["Python", "Flask", "PostgreSQL"], rate: 85, rating: 4.8, verified: ["Python"], availability: "Busy", completeness: 88, avatar: "MC", category: "Development" },
    { id: 3, name: "Elena Vasquez", title: "Brand & Motion Designer", skills: ["After Effects", "Illustrator", "Branding"], rate: 55, rating: 4.95, verified: [], availability: "Available", completeness: 76, avatar: "EV", category: "Design" },
    { id: 4, name: "Jordan Blake", title: "Video Editor & Producer", skills: ["Premiere Pro", "DaVinci", "YouTube"], rate: 45, rating: 4.7, verified: ["Video"], availability: "Available", completeness: 84, avatar: "JB", category: "Video" },
    { id: 5, name: "Aisha Okonkwo", title: "Technical Content Writer", skills: ["SEO", "API Docs", "Blogging"], rate: 50, rating: 4.85, verified: ["Writing"], availability: "Limited", completeness: 90, avatar: "AO", category: "Writing" },
    { id: 6, name: "Sam Rivera", title: "Frontend Developer", skills: ["JavaScript", "CSS", "Vue"], rate: 70, rating: 4.6, verified: [], availability: "Available", completeness: 70, avatar: "SR", category: "Development" },
  ],
  projects: [
    { id: 1, title: "SaaS Dashboard Redesign", client: "Nova Analytics", skills: ["Figma", "React"], budgetMin: 2500, budgetMax: 4500, type: "Fixed", deadline: "2026-06-15", proposals: 12, status: "Open" },
    { id: 2, title: "E-commerce Product Videos", client: "Bloom Retail", skills: ["Premiere Pro", "Motion"], budgetMin: 800, budgetMax: 1500, type: "Fixed", deadline: "2026-05-30", proposals: 8, status: "Open" },
    { id: 3, title: "API Documentation Sprint", client: "DevStack Inc", skills: ["Technical Writing", "OpenAPI"], budgetMin: 40, budgetMax: 60, type: "Hourly", deadline: "2026-06-01", proposals: 5, status: "Open" },
    { id: 4, title: "Mobile App MVP", client: "FitPulse", skills: ["React Native", "Firebase"], budgetMin: 5000, budgetMax: 9000, type: "Fixed", deadline: "2026-07-20", proposals: 18, status: "Open" },
  ],
  proposals: [
    { id: 101, projectId: 1, freelancer: "Priya Sharma", bid: 3800, timeline: "5 weeks", message: "I've redesigned 3 B2B dashboards with measurable UX wins.", relevance: 94, clarity: 92, value: 89, recommended: true },
    { id: 102, projectId: 1, freelancer: "Marcus Chen", bid: 4200, timeline: "6 weeks", message: "Full design-to-code delivery with component library.", relevance: 87, clarity: 90, value: 85, recommended: true },
    { id: 103, projectId: 1, freelancer: "Sam Rivera", bid: 2900, timeline: "4 weeks", message: "Quick turnaround on UI implementation.", relevance: 72, clarity: 68, value: 91, recommended: false },
  ],
  contracts: [
    { id: 1, title: "Landing Page Build", client: "StartupXYZ", freelancer: "Priya Sharma", status: "In Progress", progress: 65, deliverables: [{ name: "Wireframes", done: true }, { name: "Hi-fi mockups", done: true }, { name: "React components", done: false }] },
    { id: 2, title: "Brand Video Pack", client: "Bloom Retail", freelancer: "Jordan Blake", status: "Review", progress: 90, deliverables: [{ name: "Storyboard", done: true }, { name: "3 edited videos", done: true }, { name: "Final export", done: false }] },
  ],
  milestones: [
    { id: 1, contractId: 1, name: "Discovery & Wireframes", amount: 800, status: "paid" },
    { id: 2, contractId: 1, name: "Design Delivery", amount: 1200, status: "approved" },
    { id: 3, contractId: 1, name: "Development Handoff", amount: 1000, status: "pending" },
  ],
  earnings: { total: 28450, pending: 2200, withdrawn: 26250, commission: 2845 },
  withdrawals: [
    { date: "2026-05-01", amount: 3500, status: "Completed" },
    { date: "2026-04-01", amount: 4200, status: "Completed" },
    { date: "2026-03-01", amount: 2800, status: "Completed" },
  ],
  reviews: [
    { client: "Nova Analytics", rating: 5, text: "Exceptional design quality and communication throughout.", date: "2026-04-10" },
    { client: "StartupXYZ", rating: 5, text: "Delivered ahead of schedule with pixel-perfect UI.", date: "2026-03-22" },
  ],
  portfolio: [
    { title: "FinTech Dashboard", desc: "Redesigned analytics dashboard — 34% faster task completion.", tools: ["Figma", "React"], category: "Design" },
    { title: "Health App UI Kit", desc: "Complete mobile design system with 40+ components.", tools: ["Figma", "Principle"], category: "Design" },
    { title: "E-learning Platform", desc: "End-to-end UX for 50k+ monthly active learners.", tools: ["Figma", "User Research"], category: "UX" },
  ],
  challenges: [
    { id: 1, title: "Design a Dashboard in Figma", prize: "$500", entries: 234, ends: "3 days left", featured: "Priya Sharma" },
    { id: 2, title: "30-Second Product Explainer", prize: "$300", entries: 89, ends: "5 days left", featured: "Jordan Blake" },
    { id: 3, title: "Write a Killer Landing Page", prize: "$200", entries: 156, ends: "1 week left", featured: "Aisha Okonkwo" },
  ],
  feed: [
    { author: "Marcus Chen", avatar: "MC", time: "2h ago", text: "Just shipped a Flask + vanilla JS marketplace shell for our hackathon. Zero frameworks, maximum vibes.", likes: 42, comments: 8 },
    { author: "Elena Vasquez", avatar: "EV", time: "5h ago", text: "Tip: Add measurable outcomes to every portfolio piece. Clients hire results, not tools.", likes: 89, comments: 15 },
    { author: "Jordan Blake", avatar: "JB", time: "1d ago", text: "Won the weekly video challenge! Grateful for this community.", likes: 124, comments: 23 },
  ],
  mentors: [
    { name: "David Kim", expertise: "Senior Engineering Lead", rate: 0, type: "Free", sessions: 12 },
    { name: "Lisa Park", expertise: "Creative Director", rate: 75, type: "Paid", sessions: 28 },
    { name: "James Wright", expertise: "Freelance Business Coach", rate: 50, type: "Paid", sessions: 45 },
  ],
  notifications: [
    { id: 1, text: "New proposal on SaaS Dashboard Redesign", time: "10m ago", unread: true },
    { id: 2, text: "Milestone approved — $1,200 pending release", time: "1h ago", unread: true },
    { id: 3, text: "Priya Sharma verified React Developer badge", time: "3h ago", unread: false },
  ],
  messages: [
    { id: 1, name: "Nova Analytics", preview: "Can we schedule a kickoff call?", time: "2:30 PM", unread: true },
    { id: 2, name: "Bloom Retail", preview: "Revision notes attached for video 2", time: "Yesterday", unread: false },
  ],
  testimonials: [
    { text: "TalentStage's AI matching found us the perfect designer in under an hour.", author: "Sarah M.", role: "Startup Founder" },
    { text: "The skill verifier badge helped me land 3x more client inquiries.", author: "Priya S.", role: "Freelance Designer" },
    { text: "Milestone payments made our agency workflow finally predictable.", author: "Tom R.", role: "Agency Owner" },
  ],
  currentUser: { name: "Alex Morgan", role: "both", email: "alex@example.com", completeness: 78 },
};

function getFreelancer(id) {
  return MOCK_DATA.freelancers.find(f => f.id === parseInt(id, 10)) || MOCK_DATA.freelancers[0];
}

function getProject(id) {
  return MOCK_DATA.projects.find(p => p.id === parseInt(id, 10)) || MOCK_DATA.projects[0];
}

function renderStars(rating) {
  return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(rating));
}
