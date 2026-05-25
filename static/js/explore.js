document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("talent-grid");
  const search = document.getElementById("talent-search");
  const category = document.getElementById("filter-category");
  if (!grid) return;

  function render(list) {
    grid.innerHTML = list.map(t => `
      <a href="/talent/${t.id}" class="glass-card talent-card reveal" style="text-decoration:none; color:var(--text-primary); display:flex; flex-direction:column; gap:1rem;">
        <div class="card-header" style="display:flex; gap:1rem; align-items:flex-start;">
          <div class="avatar" style="width:48px; height:48px; flex-shrink:0;">${t.avatar}</div>
          <div class="card-meta">
            <h3 style="margin:0 0 0.25rem; display:flex; align-items:center; gap:0.5rem; font-family:var(--font-heading);">
              ${t.name}
              ${(t.badges || []).includes('Top Rated') ? '<span class="badge" style="background:linear-gradient(135deg, #F59E0B, #D97706); color:white;">🏆 Top Rated</span>' : ''}
              ${t.verified.length ? '<span class="badge badge-verified" style="padding:0.15rem 0.4rem; font-size:0.65rem;">✓ Verified</span>' : ""}
            </h3>
            <p class="text-sm text-muted" style="margin:0;">${t.title}</p>
            <p class="text-sm text-muted" style="margin:0.25rem 0 0; font-size:0.8rem;">📍 ${t.location || 'Remote'}</p>
          </div>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0; border-top:1px solid var(--glass-border); border-bottom:1px solid var(--glass-border);">
          <div style="text-align:center;">
            <div style="font-weight:700; color:var(--text-primary);">${t.rate ? `$${t.rate}` : 'N/A'}</div>
            <div style="font-size:0.7rem; color:var(--text-dim);">HOURLY</div>
          </div>
          <div style="text-align:center;">
            <div style="font-weight:700; color:var(--text-primary);">${t.jobSuccess ? `${t.jobSuccess}%` : 'N/A'}</div>
            <div style="font-size:0.7rem; color:var(--text-dim);">JOB SUCCESS</div>
          </div>
          <div style="text-align:center;">
            <div style="font-weight:700; color:var(--text-primary);">${t.totalEarned || '$0'}</div>
            <div style="font-size:0.7rem; color:var(--text-dim);">EARNED</div>
          </div>
        </div>
        
        <div style="flex:1;">
          <p style="font-size:0.85rem; color:var(--text-muted); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:1rem;">
            ${t.bio || ''}
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${t.skills.slice(0,4).map(s => `<span class="tag" style="font-size:0.75rem; padding:0.2rem 0.5rem;">${s}</span>`).join("")}
            ${t.skills.length > 4 ? `<span class="tag" style="font-size:0.75rem; padding:0.2rem 0.5rem;">+${t.skills.length - 4}</span>` : ''}
          </div>
        </div>
      </a>`).join("");
  }

  function filter() {
    const q = (search?.value || "").toLowerCase();
    const cat = category?.value || "";
    let list = MOCK_DATA.freelancers;
    if (q) list = list.filter(t => t.name.toLowerCase().includes(q) || t.skills.some(s => s.toLowerCase().includes(q)));
    if (cat) list = list.filter(t => t.category === cat);
    render(list);
  }

  render(MOCK_DATA.freelancers);
  search?.addEventListener("input", filter);
  category?.addEventListener("change", filter);
});
