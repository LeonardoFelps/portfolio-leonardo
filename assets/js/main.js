// === Inicialização de animações ===
// Usamos o AOS para revelar os elementos ao rolar a página.
AOS.init({
  duration: 1000,
  once: true,
  easing: 'ease-out-cubic',
});

// === Efeito de parallax leve no scroll ===
// O herói se move levemente conforme o scroll, criando profundidade.
window.addEventListener('scroll', () => {
  const hero = document.querySelector('#hero');
  if (hero) {
    const scrollY = window.scrollY;
    hero.style.transform = `translateY(${scrollY * 0.2}px)`;
  }
});

// === Aurora dinâmica com partículas ===
// Este efeito cria uma “aurora viva” de cores translúcidas e suaves em movimento.
const canvas = document.getElementById("auroraCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // === Classe de orbes luminosos ===
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

      // Rebater nas bordas
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

  // === Criação dos orbes coloridos ===
  const colors = [
    "rgba(56, 189, 248, 0.15)", // azul
    "rgba(52, 211, 153, 0.12)", // verde
    "rgba(245, 158, 11, 0.10)", // laranja
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

  // === Loop de animação ===
  function animateAurora() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    orbs.forEach((orb) => {
      orb.move();
      orb.draw();
    });

    requestAnimationFrame(animateAurora);
  }

  animateAurora();

  // === Movimento suave com o mouse ===
  // Os orbes se “afastam” levemente do cursor.
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

// === Microinterações visuais ===
// Efeito de brilho nos títulos ao passar o mouse
document.querySelectorAll('h2, h3').forEach((title) => {
  title.addEventListener('mouseenter', () => {
    title.style.textShadow = '0 0 20px rgba(56,189,248,0.7)';
  });
  title.addEventListener('mouseleave', () => {
    title.style.textShadow = '';
  });
});


document.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector("footer");
    const year = new Date().getFullYear();
    footer.innerHTML = `© ${year} Leonardo Justino. Desenvolvido com <span class="text-sky-400">Aurora Tech</span>.`;
});

// === Menu mobile toggle ===
const menuBtn = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// === Scroll suave entre seções ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60, // Ajuste conforme a altura do header
        behavior: 'smooth'
      });
    }
  });
});

// === Cabeçalho dinâmico ===
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// === Botão "Voltar ao Topo" ===
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.remove('hidden');
    backToTop.style.opacity = 1;
  } else {
    backToTop.style.opacity = 0;
    setTimeout(() => backToTop.classList.add('hidden'), 300);
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Glow dinâmico nos cards ===
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.boxShadow = `0 0 20px rgba(56,189,248,0.3), ${x / 30}px ${y / 30}px 40px rgba(56,189,248,0.2)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// === MODAL DOS PROJETOS ===
const projects = {
  "api-automator": {
    title: "API Automator",
    desc: "Plataforma que automatiza integrações RESTful, com painéis de logs e orquestração de fluxos de dados entre sistemas.",
    stack: "Tecnologias: PHP, Laravel, MySQL, JavaScript",
    img: "assets/img/api-automator.png",
    github: "https://github.com/LeonardoFelps/api-automator",
    demo: "#"
  },
  "datavision": {
    title: "DataVision",
    desc: "Dashboard moderno e performático com visualização de métricas em tempo real, integração MySQL e gráficos Chart.js.",
    stack: "Tecnologias: Python, Flask, Chart.js, MySQL",
    img: "assets/img/datavision.png",
    github: "https://github.com/LeonardoFelps/datavision",
    demo: "#"
  },
  "secureauth": {
    title: "SecureAuth",
    desc: "Sistema de autenticação JWT com verificação de sessão e monitoramento de acessos, seguindo práticas OWASP.",
    stack: "Tecnologias: Node.js, Express, JWT, MongoDB",
    img: "assets/img/secureauth.png",
    github: "https://github.com/LeonardoFelps/secureauth",
    demo: "#"
  }
};

const modal = document.getElementById("project-modal");
const closeModal = document.getElementById("close-modal");

document.querySelectorAll(".project-card").forEach(card => {
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

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Fecha modal ao clicar fora do conteúdo
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// === FILTROS DE CATEGORIA ===
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");

    // Atualiza estado ativo
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Mostra ou oculta projetos
    projectCards.forEach(card => {
      if (filter === "all" || card.dataset.category === filter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// === EFEITO TILT 3D LEVE ===
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / 20) * -1;
    const rotateY = (x - centerX) / 20;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
});

// === AURORA LOADER ===
window.addEventListener("load", () => {
  const loader = document.getElementById("aurora-loader");
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 1000);
  }, 800);
});

// === TRANSIÇÃO SUAVE ENTRE SEÇÕES ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    }
  });
});

// === TOGGLE DE TEMA (Header Aurora) ===
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.style.transition = "background 1.2s ease, color 0.8s ease";

    // Alterna ícone suavemente
    if (document.body.classList.contains("light-mode")) {
      themeToggle.textContent = "🌙";
    } else {
      themeToggle.textContent = "☀️";
    }
  });
}

