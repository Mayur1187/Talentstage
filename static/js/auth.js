document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".role-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".role-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      localStorage.setItem("talentstage_role", btn.dataset.role);
    });
  });

  const form = document.querySelector(".auth-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const role = localStorage.getItem("talentstage_role") || "freelancer";
      showToast("Welcome to TalentStage!");
      setTimeout(() => {
        window.location.href = role === "client" ? "/client/dashboard" : "/dashboard";
      }, 800);
    });
  }
});
