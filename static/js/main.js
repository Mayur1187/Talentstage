document.addEventListener("DOMContentLoaded", () => {
  /* ---- Scroll-reveal ---- */
  document.querySelectorAll(".reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 80 * i);
  });

  /* ---- Tab panels ---- */
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

  /* ---- Role-aware sidebar ---- */
  const role = localStorage.getItem("talentstage_role") || "both";
  document.querySelectorAll("[data-role-nav]").forEach(nav => {
    nav.querySelectorAll("[data-show-role]").forEach(item => {
      const roles = item.dataset.showRole.split(",");
      item.style.display = (roles.includes(role) || role === "both") ? "" : "none";
    });
  });

  /* ---- Active sidebar link ---- */
  const path = window.location.pathname;
  document.querySelectorAll(".sidebar-nav a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  /* ---- Navbar profile & completeness ---- */
  if (window.TalentStageStore) {
    const state = TalentStageStore.get();
    const user = state.currentUser;

    // Avatar initials
    const navAvatar = document.getElementById('navAvatar');
    if (navAvatar) {
      navAvatar.textContent = user.name.split(' ').map(p => p[0]).join('').slice(0, 2);
    }

    // Completeness ring in navbar
    const navCompleteness = document.getElementById('navCompleteness');
    if (navCompleteness) {
      const pct = TalentStageStore.computeCompleteness ? TalentStageStore.computeCompleteness() : 0;
      navCompleteness.style.setProperty('--pct', pct + '%');
      navCompleteness.dataset.pct = pct + '%';
    }

    // Verify dot in navbar
    const navVerifyDot = document.getElementById('navVerifyDot');
    if (navVerifyDot) {
      const vs = user.verifyStatus || 'none';
      navVerifyDot.className = 'nav-verify-dot ' + vs;
      const titles = { verified: 'Verified', pending: 'Verification Pending', none: 'Not Verified' };
      navVerifyDot.title = titles[vs] || 'Not Verified';
    }
  }

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.navbar-nav');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => navList.classList.toggle('open'));
  }

  /* ---- Modal close ---- */
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".modal-overlay")?.classList.remove("open"));
  });
});

/* ---- Toast utility ---- */
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
