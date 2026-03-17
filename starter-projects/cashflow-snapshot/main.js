const STORAGE_KEY = "cashflow-snapshot:v1";

const defaultEntries = [
  { id: 1, label: "Assinaturas recorrentes", type: "income", value: 4200, date: "2026-03-02", category: "SaaS" },
  { id: 2, label: "Projetos avulsos", type: "income", value: 2800, date: "2026-03-06", category: "Freelas" },
  { id: 3, label: "Infraestrutura", type: "expense", value: 420, date: "2026-03-08", category: "Tecnologia" },
  { id: 4, label: "Marketing", type: "expense", value: 980, date: "2026-03-10", category: "Aquisição" },
  { id: 5, label: "Repasse parceiros", type: "expense", value: 1400, date: "2026-03-12", category: "Operação" },
  { id: 6, label: "Consultoria técnica", type: "income", value: 3600, date: "2026-03-14", category: "Serviço" },
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const listEl = document.getElementById("entry-list");
const categoryEl = document.getElementById("category-list");
const typeFilter = document.getElementById("type-filter");
const form = document.getElementById("entry-form");
let entries = loadEntries();

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultEntries;
  } catch {
    return defaultEntries;
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function nextId() {
  return entries.length ? Math.max(...entries.map((item) => item.id)) + 1 : 1;
}

function getFilteredEntries() {
  const value = typeFilter.value;
  return value === "all" ? entries : entries.filter((entry) => entry.type === value);
}

function renderStats(items) {
  const income = items.filter((item) => item.type === "income").reduce((sum, item) => sum + item.value, 0);
  const outcome = items.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.value, 0);
  const balance = income - outcome;
  const margin = income ? `${Math.round((balance / income) * 100)}%` : "0%";

  document.getElementById("income").textContent = currency.format(income);
  document.getElementById("outcome").textContent = currency.format(outcome);
  document.getElementById("balance").textContent = currency.format(balance);
  document.getElementById("margin").textContent = margin;
}

function renderEntries(items) {
  listEl.innerHTML = items.map((item) => `
    <article class="entry-item">
      <header>
        <strong>${item.label}</strong>
        <strong class="${item.type === "income" ? "pos" : "neg"}">${item.type === "income" ? "+ " : "- "}${currency.format(item.value)}</strong>
      </header>
      <small>${item.category} | ${item.date}</small>
      <div class="entry-actions">
        <select class="mini-btn" data-type="${item.id}">
          <option value="income" ${item.type === "income" ? "selected" : ""}>Entrada</option>
          <option value="expense" ${item.type === "expense" ? "selected" : ""}>Saída</option>
        </select>
        <button class="mini-btn danger-btn" type="button" data-delete="${item.id}">Excluir</button>
      </div>
    </article>
  `).join("");

  attachEntryActions();
}

function renderCategories(items) {
  const grouped = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.value;
    return acc;
  }, {});
  const values = Object.values(grouped);
  const max = values.length ? Math.max(...values) : 1;

  categoryEl.innerHTML = Object.entries(grouped).map(([name, value]) => `
    <article class="category-item">
      <div>
        <strong>${name}</strong>
        <div class="bar"><span style="width:${(value / max) * 100}%"></span></div>
      </div>
      <strong>${currency.format(value)}</strong>
    </article>
  `).join("") || "<small>Nenhuma categoria no filtro atual.</small>";
}

function attachEntryActions() {
  listEl.querySelectorAll("[data-type]").forEach((select) => {
    select.addEventListener("change", () => {
      const entry = entries.find((item) => item.id === Number(select.dataset.type));
      if (!entry) return;
      entry.type = select.value;
      saveEntries();
      applyFilter();
    });
  });

  listEl.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      entries = entries.filter((item) => item.id !== Number(button.dataset.delete));
      saveEntries();
      applyFilter();
    });
  });
}

function applyFilter() {
  const filtered = getFilteredEntries();
  renderStats(filtered);
  renderEntries(filtered);
  renderCategories(filtered);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  entries.unshift({
    id: nextId(),
    label: formData.get("label").toString().trim(),
    type: formData.get("type").toString(),
    value: Number(formData.get("value")),
    category: formData.get("category").toString().trim(),
    date: formData.get("date").toString(),
  });
  saveEntries();
  form.reset();
  applyFilter();
});

typeFilter.addEventListener("change", applyFilter);
applyFilter();
