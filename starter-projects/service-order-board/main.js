const STORAGE_KEY = "service-order-board:v1";

const columns = [
  { id: "backlog", label: "Backlog" },
  { id: "analysis", label: "Em analise" },
  { id: "progress", label: "Em execucao" },
  { id: "done", label: "Concluido" },
];

const defaultOrders = [
  { id: 1, title: "Cadastro de clientes", owner: "Leonardo", client: "Studio Prime", priority: "Alta", status: "analysis" },
  { id: 2, title: "Webhook de pagamento", owner: "Leonardo", client: "AgendaIdeal", priority: "Alta", status: "progress" },
  { id: 3, title: "Painel de assinaturas", owner: "Maria", client: "Jupiter Tech", priority: "Media", status: "backlog" },
  { id: 4, title: "Ajuste de estoque", owner: "Caio", client: "Barber House", priority: "Baixa", status: "done" },
  { id: 5, title: "Filtro por profissional", owner: "Leonardo", client: "AgendaIdeal", priority: "Media", status: "progress" },
  { id: 6, title: "Relatorio financeiro", owner: "Ana", client: "Finance Ops", priority: "Alta", status: "analysis" },
];

const board = document.getElementById("board");
const search = document.getElementById("search");
const priorityFilter = document.getElementById("priority-filter");
const form = document.getElementById("order-form");
const summary = document.getElementById("summary");
let draggedId = null;
let orders = loadOrders();

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultOrders;
  } catch {
    return defaultOrders;
  }
}

function saveOrders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function nextId() {
  return orders.length ? Math.max(...orders.map((item) => item.id)) + 1 : 1;
}

function getFilteredOrders() {
  const term = search.value.toLowerCase();
  const priority = priorityFilter.value;

  return orders.filter((item) => {
    const textMatch = [item.title, item.owner, item.client].some((value) => value.toLowerCase().includes(term));
    const priorityMatch = priority === "all" || item.priority === priority;
    return textMatch && priorityMatch;
  });
}

function renderSummary() {
  const total = orders.length;
  const high = orders.filter((item) => item.priority === "Alta").length;
  const inProgress = orders.filter((item) => item.status === "progress").length;
  const done = orders.filter((item) => item.status === "done").length;

  summary.innerHTML = `
    <article class="summary-item"><div><strong>${total}</strong><small>Total de ordens</small></div></article>
    <article class="summary-item"><div><strong>${high}</strong><small>Alta prioridade</small></div></article>
    <article class="summary-item"><div><strong>${inProgress}</strong><small>Em execucao</small></div></article>
    <article class="summary-item"><div><strong>${done}</strong><small>Concluidas</small></div></article>
  `;
}

function render(items) {
  board.innerHTML = columns.map((column) => {
    const columnItems = items.filter((item) => item.status === column.id);
    const cards = columnItems.map((item) => `
      <article class="card" draggable="true" data-id="${item.id}">
        <div class="card-header">
          <strong>${item.title}</strong>
          <button class="danger-btn" type="button" data-delete="${item.id}">Excluir</button>
        </div>
        <p>${item.client}</p>
        <small>Responsavel: ${item.owner}</small>
        <div class="tag-row">
          <span class="tag ${item.priority}">${item.priority}</span>
        </div>
        <div class="card-meta">
          <select class="card-inline" data-status="${item.id}">
            ${columns.map((status) => `<option value="${status.id}" ${status.id === item.status ? "selected" : ""}>${status.label}</option>`).join("")}
          </select>
          <select class="card-inline" data-priority="${item.id}">
            ${["Alta", "Media", "Baixa"].map((priority) => `<option value="${priority}" ${priority === item.priority ? "selected" : ""}>${priority}</option>`).join("")}
          </select>
        </div>
      </article>
    `).join("");

    return `
      <section class="column" data-column="${column.id}">
        <div class="column-head">
          <h2>${column.label}</h2>
          <span class="count-badge">${columnItems.length}</span>
        </div>
        <div class="column-list" data-dropzone="${column.id}">${cards || `<small class="empty-state">Solte uma ordem aqui.</small>`}</div>
      </section>
    `;
  }).join("");

  attachBoardEvents();
  renderSummary();
}

function attachBoardEvents() {
  board.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("dragstart", () => {
      draggedId = Number(card.dataset.id);
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      draggedId = null;
      card.classList.remove("dragging");
      board.querySelectorAll(".column").forEach((column) => column.classList.remove("drop-target"));
    });
  });

  board.querySelectorAll("[data-dropzone]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.closest(".column").classList.add("drop-target");
    });

    zone.addEventListener("dragleave", () => {
      zone.closest(".column").classList.remove("drop-target");
    });

    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      const columnId = zone.dataset.dropzone;
      const order = orders.find((item) => item.id === draggedId);
      if (!order) return;
      order.status = columnId;
      saveOrders();
      render(getFilteredOrders());
    });
  });

  board.querySelectorAll("[data-status]").forEach((select) => {
    select.addEventListener("change", () => {
      const order = orders.find((item) => item.id === Number(select.dataset.status));
      if (!order) return;
      order.status = select.value;
      saveOrders();
      render(getFilteredOrders());
    });
  });

  board.querySelectorAll("[data-priority]").forEach((select) => {
    select.addEventListener("change", () => {
      const order = orders.find((item) => item.id === Number(select.dataset.priority));
      if (!order) return;
      order.priority = select.value;
      saveOrders();
      render(getFilteredOrders());
    });
  });

  board.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      orders = orders.filter((item) => item.id !== Number(button.dataset.delete));
      saveOrders();
      render(getFilteredOrders());
    });
  });
}

function applyFilters() {
  render(getFilteredOrders());
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  orders.unshift({
    id: nextId(),
    title: formData.get("title").toString().trim(),
    client: formData.get("client").toString().trim(),
    owner: formData.get("owner").toString().trim(),
    priority: formData.get("priority").toString(),
    status: formData.get("status").toString(),
  });
  saveOrders();
  form.reset();
  form.elements.priority.value = "Media";
  form.elements.status.value = "backlog";
  render(getFilteredOrders());
});

search.addEventListener("input", applyFilters);
priorityFilter.addEventListener("change", applyFilters);
render(getFilteredOrders());
