// === Aurora Tech — Main.js ===
// Código 100% compatível com GitHub Pages
// Inclui: loader, tema, modal, animações e interações visuais

document.addEventListener("DOMContentLoaded", () => {

  // === AOS (Animações de Scroll) ===
  AOS.init({
    duration: 1000,
    once: true,
    easing: "ease-out-cubic",
  });

  // === Parallax leve no scroll ===
  const hero = document.querySelector("#hero");
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      hero.style.transform = `translateY(${scrollY * 0.2}px)`;
    });
  }

  // === Aurora dinâmica (Canvas de fundo) ===
  const canvas = document.getElementById("auroraCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class LightOrb {
      constructor(x, y, color, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
      }

      move() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const colors = [
      "rgba(56, 189, 248, 0.15)",
      "rgba(52, 211, 153, 0.12)",
      "rgba(245, 158, 11, 0.10)",
    ];
    const orbs = [];

    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 200 + 100;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const speedX = (Math.random() - 0.5) * 0.3;
      const speedY = (Math.random() - 0.5) * 0.3;
      orbs.push(new LightOrb(x, y, color, size, speedX, speedY));
    }

    function animateAurora() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach((orb) => {
        orb.move();
        orb.draw();
      });
      requestAnimationFrame(animateAurora);
    }

    animateAurora();

    window.addEventListener("mousemove", (e) => {
      orbs.forEach((orb) => {
        const dx = e.clientX - orb.x;
        const dy = e.clientY - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          orb.x -= dx * 0.02;
          orb.y -= dy * 0.02;
        }
      });
    });
  }

  // === Loader — remove após o carregamento completo ===
  window.addEventListener("load", () => {
    const loader = document.getElementById("aurora-loader");
    if (loader) {
      loader.style.transition = "opacity 0.8s ease";
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 800);
    }
  });

  // === Microinterações em títulos ===
  document.querySelectorAll("h2, h3").forEach((title) => {
    title.addEventListener("mouseenter", () => {
      title.style.textShadow = "0 0 20px rgba(56,189,248,0.7)";
    });
    title.addEventListener("mouseleave", () => {
      title.style.textShadow = "";
    });
  });

  // === Atualiza ano no rodapé ===
  const footer = document.querySelector("footer");
  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `© ${year} Leonardo Justino. Desenvolvido com <span class="text-sky-400">Aurora Tech</span>.`;
  }

  // === Menu Mobile ===
  const menuBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // === Scroll suave ===
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: "smooth",
        });
      }
    });
  });

  // === Glow e Tilt 3D nos cards ===
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / 20) * -1;
      const rotateY = (x - centerX) / 20;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      card.style.boxShadow = `0 0 20px rgba(56,189,248,0.3), ${x / 30}px ${y / 30}px 40px rgba(56,189,248,0.2)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.boxShadow = "";
    });
  });

  // === Modal de Projetos ===
  const projects = {
    "api-automator": {
      title: "API Automator",
      desc: "Plataforma que automatiza integrações RESTful, com painéis de logs e orquestração de fluxos de dados entre sistemas.",
      stack: "PHP • Laravel • MySQL • JavaScript",
      img: "assets/img/api-automator.png",
      github: "https://github.com/LeonardoFelps/api-automator",
      demo: "#",
    },
    datavision: {
      title: "DataVision",
      desc: "Dashboard moderno e performático com visualização de métricas em tempo real, integração MySQL e gráficos Chart.js.",
      stack: "Python • Flask • Chart.js • MySQL",
      img: "assets/img/datavision.png",
      github: "https://github.com/LeonardoFelps/datavision",
      demo: "#",
    },
    secureauth: {
      title: "SecureAuth",
      desc: "Sistema de autenticação JWT com monitoramento de acessos e segurança OWASP.",
      stack: "Node.js • Express • JWT • MongoDB",
      img: "assets/img/secureauth.png",
      github: "https://github.com/LeonardoFelps/secureauth",
      demo: "#",
    },
  };

  const modal = document.getElementById("project-modal");
  const closeModal = document.getElementById("close-modal");

  if (modal && closeModal) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.project;
        const project = projects[id];
        if (!project) return;

        document.getElementById("modal-title").textContent = project.title;
        document.getElementById("modal-desc").textContent = project.desc;
        document.getElementById("modal-stack").textContent = project.stack;
        document.getElementById("modal-img").src = project.img;
        document.getElementById("modal-github").href = project.github;
        document.getElementById("modal-demo").href = project.demo;

        modal.classList.remove("hidden");
      });
    });

    closeModal.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }

  // === Toggle de Tema (Claro / Escuro) ===
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      document.body.style.transition = "background 0.8s ease, color 0.8s ease";

      if (document.body.classList.contains("light-mode")) {
        themeToggle.textContent = "🌙";
        document.body.style.background = "radial-gradient(circle at 30% 30%, #f5f5f5 0%, #eaeaea 50%, #d4d4d8 100%)";
        document.body.style.color = "#0f172a";
      } else {
        themeToggle.textContent = "☀️";
        document.body.style.background = "radial-gradient(circle at 20% 30%, #0f172a 0%, #0b1120 40%, #020617 100%)";
        document.body.style.color = "#e2e8f0";
      }
    });
  }

});
