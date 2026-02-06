/* =========================
   TEC-08 Wireframe UI
   Drawer "Vistas" for map-first landing
   ========================= */

(function () {
  const btn = document.getElementById("btnViews");
  const backdrop = document.getElementById("drawerBackdrop");
  const drawer = document.getElementById("drawer");

  if (!btn || !backdrop || !drawer) return;

  function openDrawer() {
    document.body.classList.add("drawer-open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    document.body.classList.remove("drawer-open");
    drawer.setAttribute("aria-hidden", "true");
  }

  function toggleDrawer() {
    if (document.body.classList.contains("drawer-open")) closeDrawer();
    else openDrawer();
  }

  btn.addEventListener("click", toggleDrawer);
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDrawer();
    }
  });

  backdrop.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
})();
