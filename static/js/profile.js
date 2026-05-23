document.addEventListener("DOMContentLoaded", () => {
  const id = parseInt(document.body.dataset.talentId || "1", 10);
  const t = getFreelancer(id);
  const nameEl = document.getElementById("profile-name");
  if (nameEl) nameEl.textContent = t.name;
  const titleEl = document.getElementById("profile-title");
  if (titleEl) titleEl.textContent = t.title;
  const avatarEl = document.getElementById("profile-avatar");
  if (avatarEl) avatarEl.textContent = t.avatar;
  const skillsEl = document.getElementById("profile-skills");
  if (skillsEl) {
    skillsEl.innerHTML = t.skills.map(s => `<span class="tag">${s}</span>`).join("") +
      t.verified.map(s => `<span class="badge badge-verified">Verified ${s}</span>`).join(" ");
  }
  const portfolioEl = document.getElementById("portfolio-grid");
  if (portfolioEl) {
    portfolioEl.innerHTML = MOCK_DATA.portfolio.map(p => `
      <div class="glass-card portfolio-item">
        <div class="thumb">◆</div>
        <h4>${p.title}</h4>
        <p class="text-sm text-muted">${p.desc}</p>
        <p class="text-xs mt-1">${p.tools.join(" · ")}</p>
      </div>`).join("");
  }
});
