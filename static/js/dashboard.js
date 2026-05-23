document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  }
  const path = window.location.pathname;
  document.querySelectorAll(".sidebar-nav a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
});
