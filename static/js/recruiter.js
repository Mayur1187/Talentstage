document.addEventListener("DOMContentLoaded", () => {
  const projectsEl = document.getElementById("client-projects");
  if (projectsEl) {
    projectsEl.innerHTML = MOCK_DATA.projects.map(p => `
      <a href="/client/projects/${p.id}" class="glass-card project-card">
        <h4>${p.title}</h4>
        <p class="text-sm text-muted">${p.client}</p>
        <p class="budget mt-1">$${p.budgetMin.toLocaleString()} – $${p.budgetMax.toLocaleString()} · ${p.type}</p>
        <p class="deadline">${p.proposals} proposals · Due ${p.deadline}</p>
        <div class="mt-1">${p.skills.map(s => `<span class="tag">${s}</span>`).join("")}</div>
      </a>`).join("");
  }
  const scopeBtn = document.getElementById("btn-scope-ai");
  if (scopeBtn) scopeBtn.addEventListener("click", () => {
    const brief = document.getElementById("vague-brief")?.value || "";
    if (typeof runAI === "function") runAI("scope", { brief });
  });
});
