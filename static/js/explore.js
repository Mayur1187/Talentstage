document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("talent-grid");
  const search = document.getElementById("talent-search");
  const category = document.getElementById("filter-category");
  if (!grid) return;

  function render(list) {
    grid.innerHTML = list.map(t => `
      <a href="/talent/${t.id}" class="glass-card talent-card reveal">
        <div class="card-header">
          <div class="avatar">${t.avatar}</div>
          <div class="card-meta">
            <h3>${t.name} ${t.verified.length ? '<span class="badge badge-verified">Verified</span>' : ""}</h3>
            <p class="text-sm text-muted">${t.title}</p>
          </div>
        </div>
        <p class="rate">$${t.rate}/hr · ${t.rating} ★ · ${t.availability}</p>
        <div>${t.skills.map(s => `<span class="tag">${s}</span>`).join("")}</div>
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
