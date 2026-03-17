const STORAGE_KEY = "webhook-inspector-lite:v1";

const defaultEvents = [
  {
    id: "evt_1901",
    source: "agendaideal/subscription",
    name: "subscription.updated",
    status: "success",
    time: "09:42",
    duration: 142,
    payload: { tenant: "Jupiter Tech", status: "active", plan: "pro" },
  },
  {
    id: "evt_1902",
    source: "agendaideal/billing",
    name: "invoice.paid",
    status: "success",
    time: "10:11",
    duration: 118,
    payload: { invoice: "INV-2026-03", total: 199.9, gateway: "asaas" },
  },
  {
    id: "evt_1903",
    source: "workflows/notifications",
    name: "notification.failed",
    status: "warning",
    time: "11:06",
    duration: 201,
    payload: { channel: "email", retry: true, reason: "smtp timeout" },
  },
  {
    id: "evt_1904",
    source: "crm/leads",
    name: "lead.created",
    status: "success",
    time: "11:49",
    duration: 91,
    payload: { origin: "landing-page", owner: "sales", score: 78 },
  },
  {
    id: "evt_1905",
    source: "erp/orders",
    name: "order.sync_error",
    status: "error",
    time: "12:27",
    duration: 344,
    payload: { order: 584, reason: "validation mismatch", queue: "orders" },
  },
];

const listEl = document.getElementById("event-list");
const payloadEl = document.getElementById("payload-view");
const searchEl = document.getElementById("search");
const filterEl = document.getElementById("status-filter");
const form = document.getElementById("event-form");
const resultsCountEl = document.getElementById("results-count");
let selectedId = null;
let events = loadEvents();

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultEvents;
  } catch {
    return defaultEvents;
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function nextId() {
  return `evt_${Date.now()}`;
}

function getFilteredEvents() {
  const term = searchEl.value.toLowerCase();
  const status = filterEl.value;

  return events.filter((item) => {
    const matchesText = item.name.toLowerCase().includes(term) || item.source.toLowerCase().includes(term);
    const matchesStatus = status === "all" || item.status === status;
    return matchesText && matchesStatus;
  });
}

function updateStats(items) {
  const successItems = items.filter((item) => item.status === "success").length;
  const avg = items.length ? Math.round(items.reduce((sum, item) => sum + item.duration, 0) / items.length) : 0;
  document.getElementById("total-events").textContent = String(items.length);
  document.getElementById("success-rate").textContent = items.length ? `${Math.round((successItems / items.length) * 100)}%` : "0%";
  document.getElementById("avg-time").textContent = `${avg} ms`;
  document.getElementById("active-source").textContent = String(new Set(items.map((item) => item.source)).size);
}

function selectEvent(id, visibleItems) {
  const event = visibleItems.find((item) => item.id === id) || visibleItems[0] || null;
  selectedId = event ? event.id : null;
  payloadEl.textContent = event ? JSON.stringify(event.payload, null, 2) : "{}";
}

function render(items) {
  resultsCountEl.textContent = `${items.length} resultados`;
  listEl.innerHTML = items.map((item) => `
    <article class="event-card ${item.id === selectedId ? "active" : ""}" data-id="${item.id}">
      <header>
        <strong>${item.name}</strong>
        <span class="badge ${item.status}">${item.status}</span>
      </header>
      <p>${item.source}</p>
      <div class="event-meta">
        <small>${item.id}</small>
        <small>${item.time} • ${item.duration} ms</small>
      </div>
      <div class="event-actions">
        <button class="mini-btn" type="button" data-clone="${item.id}">Duplicar</button>
        <button class="mini-btn danger-btn" type="button" data-delete="${item.id}">Excluir</button>
      </div>
    </article>
  `).join("");

  selectEvent(selectedId, items);
  updateStats(items);
  attachEvents(items);
}

function attachEvents(items) {
  listEl.querySelectorAll(".event-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectEvent(card.dataset.id, items);
      render(items);
    });
  });

  listEl.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      events = events.filter((item) => item.id !== button.dataset.delete);
      saveEvents();
      selectedId = null;
      render(getFilteredEvents());
    });
  });

  listEl.querySelectorAll("[data-clone]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const source = events.find((item) => item.id === button.dataset.clone);
      if (!source) return;
      const clone = {
        ...source,
        id: nextId(),
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      events.unshift(clone);
      saveEvents();
      selectedId = clone.id;
      render(getFilteredEvents());
    });
  });
}

function applyFilters() {
  render(getFilteredEvents());
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  let payload = {};

  try {
    payload = JSON.parse(formData.get("payload").toString());
  } catch {
    alert("Payload invalido. Use JSON valido.");
    return;
  }

  const newEvent = {
    id: nextId(),
    source: formData.get("source").toString().trim(),
    name: formData.get("name").toString().trim(),
    status: formData.get("status").toString(),
    time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    duration: Number(formData.get("duration")),
    payload,
  };

  events.unshift(newEvent);
  saveEvents();
  form.reset();
  form.elements.status.value = "success";
  form.elements.duration.value = "120";
  selectedId = newEvent.id;
  render(getFilteredEvents());
});

searchEl.addEventListener("input", applyFilters);
filterEl.addEventListener("change", applyFilters);
render(getFilteredEvents());
