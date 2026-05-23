document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("challenges-grid");
  if (grid) {
    grid.innerHTML = MOCK_DATA.challenges.map(ch => `
      <a href="/competitions/${ch.id}" class="glass-card reveal">
        <h3>${ch.title}</h3>
        <p class="challenge-prize">${ch.prize}</p>
        <p class="text-muted text-sm">${ch.entries} entries · ${ch.ends}</p>
        <p class="text-sm mt-1">Featured: ${ch.featured}</p>
      </a>`).join("");
  }
});
