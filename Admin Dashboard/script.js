// ===================================================================
// SwiftCare Cashier Dashboard — interactions
// ===================================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Sidebar: expand/collapse submenus ---------- */
  const navToggles = document.querySelectorAll(".nav-item > button.nav-link");
  navToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".nav-item");
      const submenu = item.querySelector(".submenu");
      if (!submenu) return;
      const isOpen = item.classList.toggle("open");
      submenu.style.display = isOpen ? "flex" : "none";
    });
  });

  /* ---------- Payment method tabs (Cash / POS / Bank Transfer) ---------- */
  document.querySelectorAll(".payment-card").forEach((card) => {
    const tabs = card.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
      });
    });

    /* ---------- Payment method row selection (toggle switches) ---------- */
    const rows = card.querySelectorAll(".method-row");
    rows.forEach((row) => {
      row.addEventListener("click", () => {
        rows.forEach((r) => {
          r.classList.remove("selected", "green");
          const t = r.querySelector(".toggle");
          if (t) t.classList.remove("on", "green", "check");
        });
        row.classList.add("selected");
        const toggle = row.querySelector(".toggle");
        if (toggle) toggle.classList.add("on");
      });
    });
  });

  /* ---------- Bank Account Details collapse ---------- */
  document.querySelectorAll(".card-head-strip").forEach((head) => {
    const chevron = head.querySelector(".fa-chevron-up");
    if (!chevron) return;
    head.style.cursor = "pointer";
    head.addEventListener("click", () => {
      const body = head.nextElementSibling;
      const isHidden = body.style.display === "none";
      body.style.display = isHidden ? "block" : "none";
      chevron.classList.toggle("fa-chevron-up", isHidden);
      chevron.classList.toggle("fa-chevron-down", !isHidden);
    });
  });

  /* ---------- "Patient Marked as Completed" modal close ---------- */
  const modalClose = document.querySelector(".modal-close");
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      const modalSection = modalClose.closest(".page");
      if (modalSection) modalSection.style.display = "none";
    });
  }

  /* ---------- Sidebar hamburger (collapses sidebar on small screens) ---------- */
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  /* ---------- Notification bell (demo click clears badge) ---------- */
  document.querySelectorAll(".bell-wrapper").forEach((bell) => {
    bell.addEventListener("click", () => {
      const badge = bell.querySelector(".badge");
      if (badge) badge.style.display = "none";
    });
  });

});