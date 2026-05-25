document.addEventListener("DOMContentLoaded", () => {
  /* ---- Role card selection (signup wizard) ---- */
  document.querySelectorAll(".role-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".role-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      localStorage.setItem("talentstage_role", card.dataset.role);
    });
  });

  /* ---- Legacy role-option support ---- */
  document.querySelectorAll(".role-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".role-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      localStorage.setItem("talentstage_role", btn.dataset.role);
    });
  });

  /* ---- Login form ---- */
  const loginForm = document.querySelector(".auth-form");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const emailInput = loginForm.querySelector("input[type='email']");
      const email = emailInput ? emailInput.value.trim() : "alex@example.com";
      
      // Set auth state
      localStorage.setItem("talentstage_logged_in", "true");
      localStorage.setItem("talentstage_user_email", email);
      
      // Use the role selected on the login tab (already persisted by tab click)
      const role = localStorage.getItem("talentstage_role") || "freelancer";

      // Update state store role
      if (window.TalentStageStore) {
        const state = TalentStageStore.get();
        state.currentUser.role = role;
        TalentStageStore.save(state);
      }

      const redirect = sessionStorage.getItem("talentstage_redirect");
      sessionStorage.removeItem("talentstage_redirect");
      
      const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
      showToast(`Welcome back! Logged in as ${roleLabel}`);
      setTimeout(() => {
        window.location.href = redirect || (role === "client" ? "/client/dashboard" : "/dashboard");
      }, 800);
    });
  }
});

/* ---- Auth guard ---- */
(function() {
  const publicPaths = ["/", "/login", "/signup", "/explore"];
  const currentPath = window.location.pathname;
  
  // Allow public pages without login
  if (publicPaths.includes(currentPath)) return;
  // Allow talent detail pages publicly (for SEO / sharing)
  if (currentPath.startsWith("/talent/")) return;
  // Allow competition listing publicly
  if (currentPath === "/competitions") return;
  
  const isLoggedIn = localStorage.getItem("talentstage_logged_in") === "true";
  if (!isLoggedIn) {
    // Save the page they tried to visit
    sessionStorage.setItem("talentstage_redirect", currentPath);
    window.location.href = "/login";
    return;
  }

  /* ---- Soft role gating ---- */
  const role = localStorage.getItem("talentstage_role") || "freelancer";
  
  // "both" role bypasses all gating
  if (role === "both") return;

  // Freelancer trying to access client pages
  if (role === "freelancer" && currentPath.startsWith("/client/")) {
    sessionStorage.setItem("talentstage_role_gate_msg", "That page is for clients. Switch to Client mode from the sidebar to access it.");
    window.location.href = "/dashboard";
    return;
  }

  // Client trying to access freelancer-only pages
  const freelancerOnlyPaths = ["/proposals", "/contracts", "/earnings", "/skill-verifier", "/portfolio-reviewer", "/upload"];
  if (role === "client" && freelancerOnlyPaths.some(p => currentPath.startsWith(p))) {
    sessionStorage.setItem("talentstage_role_gate_msg", "That page is for freelancers. Switch to Freelancer mode from the sidebar to access it.");
    window.location.href = "/client/dashboard";
    return;
  }
})();

/* ---- Show role gate toast after redirect ---- */
document.addEventListener("DOMContentLoaded", () => {
  const gateMsg = sessionStorage.getItem("talentstage_role_gate_msg");
  if (gateMsg) {
    sessionStorage.removeItem("talentstage_role_gate_msg");
    setTimeout(() => showToast(gateMsg), 300);
  }
});

/* ---- Logout utility ---- */
function logoutTalentStage() {
  localStorage.removeItem("talentstage_logged_in");
  localStorage.removeItem("talentstage_user_email");
  showToast("Logged out successfully");
  setTimeout(() => {
    window.location.href = "/";
  }, 600);
}

window.logoutTalentStage = logoutTalentStage;
