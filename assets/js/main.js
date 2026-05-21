document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("scroll-ready");
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const siteMenu = document.getElementById("site-menu");
  const year = document.getElementById("year");
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const revealItems = document.querySelectorAll(".reveal");
  const caseTabs = document.querySelectorAll("[data-case]");
  const galleryProjects = document.querySelectorAll("[data-gallery-project]");
  let activeGalleryProject = "agenda";
  let activeGalleryIndex = 0;
  const gallery = {
    root: document.querySelector(".project-gallery"),
    image: document.getElementById("gallery-image"),
    expand: document.getElementById("gallery-expand"),
    thumbs: document.getElementById("gallery-thumbs"),
    label: document.getElementById("gallery-label"),
    title: document.getElementById("gallery-title"),
    text: document.getElementById("gallery-text"),
    points: document.getElementById("gallery-points"),
    stack: document.getElementById("gallery-stack"),
    link: document.getElementById("gallery-link"),
  };
  const lightbox = {
    root: document.getElementById("image-lightbox"),
    image: document.getElementById("lightbox-image"),
    title: document.getElementById("lightbox-title"),
    closeButtons: document.querySelectorAll("[data-lightbox-close]"),
  };
  const spotlight = {
    panel: document.querySelector(".hero-panel"),
    kicker: document.getElementById("spotlight-kicker"),
    name: document.getElementById("spotlight-name"),
    image: document.getElementById("spotlight-image"),
    title: document.getElementById("spotlight-title"),
    text: document.getElementById("spotlight-text"),
    tags: document.getElementById("spotlight-tags"),
  };

  const cases = {
    agenda: {
      kicker: "Case principal",
      name: "AgendaIdeal",
      image: "assets/img/workana/agendaideal/hero-cover.png",
      alt: "Tela principal do AgendaIdeal",
      title: "Produto próprio com agenda, financeiro, operação e gestão.",
      text: "Um SaaS pensado para rotina real: horários, clientes, serviços, repasses, estoque, contas, indicadores e administração.",
      tags: ["Laravel", "React", "MySQL", "API", "SaaS"],
    },
    delivery: {
      kicker: "Delivery SaaS",
      name: "Pedidos Mais",
      image: "assets/img/workana/delivery/admin-dashboard.png",
      alt: "Dashboard administrativo do Pedidos Mais",
      title: "Cardápio digital, pedidos online, CRM e gestão por estabelecimento.",
      text: "Plataforma para restaurantes com produtos, adicionais, pedidos, clientes, assinatura recorrente e operação multiempresa.",
      tags: ["Laravel 12", "Asaas", "CRM", "Pedidos", "Multiempresa"],
    },
    tracking: {
      kicker: "Telemetria",
      name: "Frota Web",
      image: "assets/img/workana/rastreamento/trajeto-rota.png",
      alt: "Tela de trajetos do sistema de rastreamento",
      title: "Mapa, rotas, eventos e histórico para operação de frota.",
      text: "Refatoração de plataforma com dados fictícios para portfólio, mantendo a leitura operacional e protegendo informações sensíveis.",
      tags: ["Mapas", "Rotas", "Eventos", "Histórico", "LGPD"],
    },
  };

  const galleryCases = {
    agenda: {
      label: "SaaS de agendamentos",
      title: "AgendaIdeal",
      text: "Plataforma desenvolvida em Laravel e React para organizar agenda, clientes, serviços, financeiro e operação de pequenos negócios.",
      points: [
        "Agenda semanal, disponibilidade e controle de atendimentos.",
        "Fluxo financeiro com contas, repasses e indicadores.",
        "Arquitetura preparada para evolução de produto SaaS.",
      ],
      stack: ["Laravel", "React", "MySQL", "API"],
      link: "https://app.agendaideal.com.br",
      linkText: "Abrir app",
      images: [
        {
          src: "assets/img/workana/agendaideal/live-freund/01-agenda.png",
          alt: "Tela de agenda operacional do AgendaIdeal",
        },
        {
          src: "assets/img/workana/agendaideal/live-freund/02-profissionais.png",
          alt: "Tela de profissionais do AgendaIdeal",
        },
        {
          src: "assets/img/workana/agendaideal/live-freund/03-servicos.png",
          alt: "Tela de serviços do AgendaIdeal",
        },
        {
          src: "assets/img/workana/agendaideal/live-freund/07-financeiro.png",
          alt: "Dashboard financeiro do AgendaIdeal",
        },
      ],
    },
    delivery: {
      label: "Delivery e cardápio digital",
      title: "Pedidos Mais",
      text: "SaaS para restaurantes com cardápio público, produtos, adicionais, pedidos online, CRM e integração de cobrança recorrente.",
      points: [
        "Dashboard do estabelecimento com indicadores e acesso ao cardápio público.",
        "Catálogo com produtos, tamanhos, sabores, adicionais e status.",
        "Experiência mobile para o cliente montar pedidos com clareza.",
      ],
      stack: ["Laravel 12", "Asaas", "CRM", "Pedidos"],
      link: "https://app.pedidosmais.com.br",
      linkText: "Abrir plataforma",
      images: [
        {
          src: "assets/img/workana/delivery/catalogo-admin.png",
          alt: "Catálogo administrativo do Pedidos Mais",
        },
        {
          src: "assets/img/workana/delivery/admin-dashboard.png",
          alt: "Dashboard administrativo do Pedidos Mais",
        },
        {
          src: "assets/img/workana/delivery/cardapio-mobile.png",
          alt: "Cardápio mobile do Pedidos Mais",
        },
      ],
    },
    tracking: {
      label: "Rastreamento e telemetria",
      title: "Sistema web de frota",
      text: "Refatoração de plataforma de rastreamento com mapa, rotas, eventos, histórico, pontos de interesse e telas ajustadas com dados fictícios para portfólio.",
      points: [
        "Mapa operacional com frota, filtros, painel lateral e informações do equipamento.",
        "Consulta de trajeto por período, pontos registrados, velocidade e distância.",
        "Screenshots anonimizados com dados fictícios para preservar privacidade.",
      ],
      stack: ["Mapas", "Rotas", "Eventos", "LGPD"],
      link: "#servicos",
      linkText: "Ver como aplico",
      images: [
        {
          src: "assets/img/workana/rastreamento/mapa-geral.png",
          alt: "Painel de mapa geral do sistema de rastreamento",
        },
        {
          src: "assets/img/workana/rastreamento/trajeto-rota.png",
          alt: "Tela de trajeto e rota do sistema de rastreamento",
        },
      ],
    },
  };

  const syncScrollExperience = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    const glow = 18 + (progress * 64);
    const glowAlt = 82 - (progress * 42);

    document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
    document.documentElement.style.setProperty("--scroll-glow", `${glow.toFixed(1)}%`);
    document.documentElement.style.setProperty("--scroll-glow-alt", `${glowAlt.toFixed(1)}%`);
    document.documentElement.style.setProperty("--hero-copy-shift", `${(progress * -10).toFixed(1)}px`);

    if (header) {
      header.classList.toggle("is-scrolled", scrollTop > 16);
    }

    if (navLinks.length === 0 || navSections.length === 0) return;

    const navAnchor = Math.min(320, window.innerHeight * 0.38);
    const currentSection = navSections.reduce((current, section) => {
      const box = section.getBoundingClientRect();
      return box.top <= navAnchor ? section : current;
    }, navSections[0]);

    navLinks.forEach((link) => {
      const target = link.getAttribute("href")?.slice(1);
      link.classList.toggle("is-active", target === currentSection.id);
    });
  };

  syncScrollExperience();
  window.addEventListener("scroll", syncScrollExperience, { passive: true });
  window.addEventListener("resize", syncScrollExperience);

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

  const renderCase = (caseKey) => {
    const data = cases[caseKey];
    if (!data || !spotlight.image) return;

    spotlight.panel?.classList.add("is-switching");
    window.setTimeout(() => {
      if (spotlight.kicker) spotlight.kicker.textContent = data.kicker;
      if (spotlight.name) spotlight.name.textContent = data.name;
      if (spotlight.image) {
        spotlight.image.src = data.image;
        spotlight.image.alt = data.alt;
      }
      if (spotlight.title) spotlight.title.textContent = data.title;
      if (spotlight.text) spotlight.text.textContent = data.text;
      if (spotlight.tags) {
        spotlight.tags.innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join("");
      }
      spotlight.panel?.classList.remove("is-switching");
    }, 160);

    caseTabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.case === caseKey);
    });
  };

  const renderGalleryProject = (projectKey, imageIndex = 0) => {
    const data = galleryCases[projectKey];
    if (!data || !gallery.image) return;
    const activeImage = data.images[imageIndex] || data.images[0];
    activeGalleryProject = projectKey;
    activeGalleryIndex = data.images[imageIndex] ? imageIndex : 0;

    gallery.root?.classList.add("is-switching");
    window.setTimeout(() => {
      gallery.image.src = activeImage.src;
      gallery.image.alt = activeImage.alt;
      if (gallery.label) gallery.label.textContent = data.label;
      if (gallery.title) gallery.title.textContent = data.title;
      if (gallery.text) gallery.text.textContent = data.text;
      if (gallery.points) {
        gallery.points.innerHTML = data.points.map((point) => `<li>${point}</li>`).join("");
      }
      if (gallery.stack) {
        gallery.stack.innerHTML = data.stack.map((item) => `<span>${item}</span>`).join("");
      }
      if (gallery.link) {
        gallery.link.href = data.link;
        gallery.link.textContent = data.linkText;
      }
      if (gallery.thumbs) {
        gallery.thumbs.innerHTML = data.images.map((image, index) => `
          <button class="gallery-thumb ${index === imageIndex ? "is-active" : ""}" type="button" data-gallery-index="${index}">
            <img src="${image.src}" alt="${image.alt}">
          </button>
        `).join("");
      }
      gallery.root?.classList.remove("is-switching");
    }, 140);

    galleryProjects.forEach((project) => {
      project.classList.toggle("is-active", project.dataset.galleryProject === projectKey);
    });
  };

  const shiftGalleryImage = (direction) => {
    const data = galleryCases[activeGalleryProject];
    if (!data) return;
    const total = data.images.length;
    const nextIndex = (activeGalleryIndex + direction + total) % total;
    renderGalleryProject(activeGalleryProject, nextIndex);
  };

  const openLightbox = () => {
    if (!lightbox.root || !lightbox.image || !gallery.image) return;
    lightbox.image.src = gallery.image.src;
    lightbox.image.alt = gallery.image.alt;
    if (lightbox.title) {
      lightbox.title.textContent = document.getElementById("gallery-title")?.textContent || "Imagem do projeto";
    }
    lightbox.root.classList.add("is-open");
    lightbox.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    if (!lightbox.root) return;
    lightbox.root.classList.remove("is-open");
    lightbox.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  };

  caseTabs.forEach((tab) => {
    tab.addEventListener("click", () => renderCase(tab.dataset.case));
  });

  galleryProjects.forEach((project) => {
    project.addEventListener("click", () => renderGalleryProject(project.dataset.galleryProject, 0));
  });

  gallery.thumbs?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-index]");
    const activeProject = document.querySelector("[data-gallery-project].is-active")?.dataset.galleryProject || "agenda";
    if (!button) return;
    renderGalleryProject(activeProject, Number(button.dataset.galleryIndex || 0));
  });

  renderGalleryProject("agenda", 0);

  document.querySelectorAll("[data-gallery-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      shiftGalleryImage(Number(button.dataset.galleryDirection || 1));
    });
  });

  gallery.image?.addEventListener("click", openLightbox);
  gallery.expand?.addEventListener("click", openLightbox);
  lightbox.closeButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });
  document.querySelectorAll("[data-lightbox-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      shiftGalleryImage(Number(button.dataset.lightboxDirection || 1));
      window.setTimeout(() => {
        if (!lightbox.root?.classList.contains("is-open") || !lightbox.image || !gallery.image) return;
        lightbox.image.src = gallery.image.src;
        lightbox.image.alt = gallery.image.alt;
      }, 180);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
    if (event.key === "ArrowLeft") {
      shiftGalleryImage(-1);
      if (lightbox.root?.classList.contains("is-open")) {
        window.setTimeout(openLightbox, 180);
      }
    }
    if (event.key === "ArrowRight") {
      shiftGalleryImage(1);
      if (lightbox.root?.classList.contains("is-open")) {
        window.setTimeout(openLightbox, 180);
      }
    }
  });

  document.querySelectorAll(".service-card, .hero-panel, .profile-card, .testimonial").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
      card.style.transform = `translateY(-5px) rotateX(${y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

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
