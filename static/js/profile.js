document.addEventListener("DOMContentLoaded", () => {
  const id = parseInt(document.body.dataset.talentId || "1", 10);
  const t = getFreelancer(id);
  
  const nameEl = document.getElementById("profile-name");
  if (nameEl) {
    nameEl.innerHTML = `
      ${t.name}
      ${(t.badges || []).includes('Top Rated') ? '<span class="badge" style="background:linear-gradient(135deg, #F59E0B, #D97706); color:white; font-size:0.75rem;">🏆 Top Rated</span>' : ''}
    `;
  }
  
  const titleEl = document.getElementById("profile-title");
  if (titleEl) titleEl.textContent = t.title;
  
  const locEl = document.getElementById("profile-location");
  if (locEl) locEl.textContent = `📍 ${t.location || "Remote"}`;

  const avatarEl = document.getElementById("profile-avatar");
  if (avatarEl) avatarEl.textContent = t.avatar;
  
  const statsEl = document.getElementById("profile-stats");
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="public-stat"><span class="public-stat-val">${t.jobSuccess ? t.jobSuccess + '%' : 'N/A'}</span><span class="public-stat-label">Job Success</span></div>
      <div class="public-stat"><span class="public-stat-val">${t.totalEarned || '$0'}</span><span class="public-stat-label">Total Earned</span></div>
      <div class="public-stat"><span class="public-stat-val">${t.completedJobs || 0}</span><span class="public-stat-label">Jobs</span></div>
      <div class="public-stat"><span class="public-stat-val">${t.hoursWorked || 0}</span><span class="public-stat-label">Hours</span></div>
    `;
  }

  const bioEl = document.getElementById("profile-bio");
  if (bioEl) bioEl.textContent = t.bio || `Hi, I'm ${t.name}. Let's work together!`;

  const skillsEl = document.getElementById("profile-skills");
  if (skillsEl) {
    skillsEl.innerHTML = t.skills.map(s => `<span class="tag">${s}</span>`).join("");
  }
  
  const rateEl = document.getElementById("profile-rate");
  if (rateEl) rateEl.textContent = `$${t.rate}/hr`;
  
  const respEl = document.getElementById("profile-response");
  if (respEl) respEl.textContent = t.responseTime || "< 24 hrs";
  
  const availEl = document.getElementById("profile-availability");
  if (availEl) availEl.textContent = t.availability || "Available";
  
  const langEl = document.getElementById("profile-languages");
  if (langEl) {
    langEl.innerHTML = (t.languages || ["English (Fluent)"]).map(l => `<li><span class="meta-value">${l}</span></li>`).join("");
  }
  
  const verifyEl = document.getElementById("profile-verifications");
  if (verifyEl) {
    verifyEl.innerHTML = `
      <li><span class="meta-value" style="display:flex; align-items:center; gap:0.4rem;">✔️ Identity Verified</span></li>
      <li><span class="meta-value" style="display:flex; align-items:center; gap:0.4rem;">✔️ Payment Verified</span></li>
      ${t.verified.map(v => `<li><span class="meta-value" style="display:flex; align-items:center; gap:0.4rem;">✨ Skill: ${v}</span></li>`).join("")}
    `;
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
  
  const reviewsEl = document.getElementById("reviews-list");
  if (reviewsEl) reviewsEl.innerHTML = MOCK_DATA.reviews.map(r => `
    <div class="glass-card">
      <div class="review-stars" style="color:var(--role-accent-light); margin-bottom:0.5rem;">${"★".repeat(r.rating)}</div>
      <p style="font-size:0.95rem; line-height:1.5;">"${r.text}"</p>
      <p class="text-sm text-muted mt-1" style="font-weight:600;">${r.client} <span style="font-weight:400;">· ${r.date}</span></p>
    </div>`).join("");
});
