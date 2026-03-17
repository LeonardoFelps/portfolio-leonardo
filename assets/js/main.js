document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const siteMenu = document.getElementById("site-menu");
  const year = document.getElementById("year");
  const revealItems = document.querySelectorAll(".reveal");
  const visitCounter = document.getElementById("visit-counter");

  const syncHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  const updateVisitCounter = async () => {
    if (!visitCounter) return;

    try {
      const response = await fetch("https://counterapi.com/api/leonardo-justino-portfolio/view/homepage");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const count = typeof data.Count === "number" ? data.Count : typeof data.count === "number" ? data.count : null;

      if (count === null) throw new Error("Invalid counter payload");

      const formatted = new Intl.NumberFormat("pt-BR").format(count);
      visitCounter.textContent = `${formatted} visitas registradas nesta página`;
    } catch {
      visitCounter.textContent = "Contador de visitas indisponível no momento";
    }
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteMenu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  updateVisitCounter();

  if ("IntersectionObserver" in window && revealItems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    });

    revealItems.forEach((item) => {
      const delay = item.dataset.delay ? Number(item.dataset.delay) : 0;
      item.style.setProperty("--reveal-delay", `${delay}ms`);
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
});
