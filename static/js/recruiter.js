document.addEventListener("DOMContentLoaded", () => {
  const user = window.TalentStageStore ? TalentStageStore.get().currentUser : { name: "Client" };
  
  // Welcome message
  const welcomeEl = document.getElementById("client-dashboard-welcome");
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome back, ${user.name.split(' ')[0]}`;
  }

  // Stats Row
  const statsEl = document.getElementById("client-dash-stats");
  if (statsEl) {
    const openProjects = MOCK_DATA.projects.filter(p => p.status === "Open").length;
    const activeContracts = MOCK_DATA.contracts.length;
    const totalProposals = MOCK_DATA.projects.reduce((sum, p) => sum + p.proposals, 0);
    const totalSpent = 12450; // Mock total spent

    statsEl.innerHTML = `
      <div class="glass-card stat-card"><div class="stat-value">${openProjects}</div><div class="stat-label">Open Projects</div></div>
      <div class="glass-card stat-card"><div class="stat-value">${totalProposals}</div><div class="stat-label">New Proposals<span class="inbox-badge">3</span></div></div>
      <div class="glass-card stat-card"><div class="stat-value">${activeContracts}</div><div class="stat-label">Active Contracts</div></div>
      <div class="glass-card stat-card"><div class="stat-value">$${totalSpent.toLocaleString()}</div><div class="stat-label">Total Spent</div></div>
    `;
  }

  // Projects Grid
  const projectsEl = document.getElementById("client-projects");
  if (projectsEl) {
    projectsEl.innerHTML = MOCK_DATA.projects.map(p => `
      <a href="/client/projects/${p.id}" class="glass-card project-card" style="text-decoration:none; color:var(--text-primary);">
        <h4 style="margin-bottom:0.25rem;">${p.title}</h4>
        <p class="budget">$${p.budgetMin.toLocaleString()} – $${p.budgetMax.toLocaleString()} · ${p.type}</p>
        <p class="deadline text-muted">${p.proposals} proposals · Due ${p.deadline}</p>
        <div class="mt-1">${p.skills.map(s => `<span class="tag">${s}</span>`).join("")}</div>
      </a>`).join("");
  }

  // Recent Proposals
  const proposalsEl = document.getElementById("client-recent-proposals");
  if (proposalsEl) {
    proposalsEl.innerHTML = MOCK_DATA.proposals.map(p => {
      const project = MOCK_DATA.projects.find(proj => proj.id === p.projectId) || { title: "Unknown Project" };
      return `
      <div class="glass-card proposal-card ${p.recommended ? 'recommended' : ''}">
        <strong>${p.freelancer}</strong>
        <p class="text-sm text-muted mt-1">For: ${project.title}</p>
        <p class="text-sm text-muted mt-1">$${p.bid.toLocaleString()} · ${p.timeline}</p>
        ${p.recommended ? `<div class="mt-2"><span class="badge badge-ai">✨ Recommended</span></div>` : ''}
      </div>`;
    }).join("");
  }

  const scopeBtn = document.getElementById("btn-scope-ai");
  if (scopeBtn) scopeBtn.addEventListener("click", () => {
    const brief = document.getElementById("vague-brief")?.value || "";
    if (typeof runAI === "function") runAI("scope", { brief });
  });
});
