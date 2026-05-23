document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 80 * i);
  });

  document.querySelectorAll("[data-tabs]").forEach(container => {
    const tabs = container.querySelectorAll(".tab");
    const panels = container.querySelectorAll(".tab-panel");
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        if (panels[i]) panels[i].classList.add("active");
      });
    });
    if (tabs[0]) tabs[0].click();
  });

  const role = localStorage.getItem("talentstage_role") || "freelancer";
  document.querySelectorAll("[data-role-nav]").forEach(nav => {
    nav.querySelectorAll("[data-show-role]").forEach(item => {
      const roles = item.dataset.showRole.split(",");
      item.style.display = roles.includes(role) || roles.includes("both") ? "" : "none";
    });
  });

  const completeness = document.querySelector(".completeness-ring");
  if (completeness && MOCK_DATA?.currentUser) {
    const pct = MOCK_DATA.currentUser.completeness;
    completeness.style.setProperty("--pct", pct + "%");
    completeness.dataset.pct = pct + "%";
  }
});

function showToast(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

window.showToast = showToast;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".modal-overlay")?.classList.remove("open"));
  });
});
