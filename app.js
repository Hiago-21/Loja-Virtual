const CART_KEY = "steamgrid-cart";
const THEME_KEY = "steamgrid-theme";
let products = [];
let selectedGenre = "Todos";

// Formata os valores em reais para manter a apresentação de preços consistente.
function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

// O LocalStorage guarda apenas os IDs; os detalhes continuam vindo do JSON.
function getCartIds() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCartIds(ids) {
  localStorage.setItem(CART_KEY, JSON.stringify(ids));
  updateCartCount();
}

function updateCartCount() {
  const count = document.querySelector("#cart-count");
  if (count) count.textContent = getCartIds().length;
}

function addToCart(id) {
  const cart = getCartIds();
  if (!cart.includes(id)) cart.push(id);
  saveCartIds(cart);
}

function setupTheme() {
  const toggle = document.querySelector("#theme-toggle");
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "dark") document.body.classList.add("dark-mode");
  if (!toggle) return;
  toggle.textContent = document.body.classList.contains("dark-mode") ? "☾" : "☼";
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    toggle.textContent = isDark ? "☾" : "☼";
  });
}

// Cards são injetados dinamicamente para demonstrar o fluxo de uma vitrine headless.
function renderProducts(list) {
  const grid = document.querySelector("#product-grid");
  const count = document.querySelector("#result-count");
  if (!grid) return;
  count.textContent = `${list.length} ${list.length === 1 ? "jogo encontrado" : "jogos encontrados"}`;
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state"><h3>Nenhum jogo encontrado</h3><p>Tente outro termo ou gênero.</p></div>';
    return;
  }
  grid.innerHTML = list.map((product) => `
    <article class="product-card">
      <a href="produto.html?id=${product.id}"><img class="product-image" src="${product.imagem}" alt="Capa de ${product.nome}"></a>
      <div class="card-body">
        <div class="card-meta"><span>${product.genero}</span><span>${product.anoLancamento}</span></div>
        <h3><a href="produto.html?id=${product.id}">${product.nome}</a></h3>
        <p class="card-description">${product.descricao}</p>
        <div class="card-footer"><span class="price">${formatPrice(product.preco)}</span><a class="cta" href="produto.html?id=${product.id}">Ver jogo</a></div>
      </div>
    </article>`).join("");
}

function applyFilters() {
  const searchTerm = (document.querySelector("#search-input")?.value || "").toLowerCase();
  const filtered = products.filter((product) => {
    const matchesGenre = selectedGenre === "Todos" || product.genero === selectedGenre;
    const matchesSearch = `${product.nome} ${product.genero} ${product.descricao}`.toLowerCase().includes(searchTerm);
    return matchesGenre && matchesSearch;
  });
  renderProducts(filtered);
}

function setupFilters() {
  const container = document.querySelector("#genre-filters");
  if (!container) return;
  const genres = ["Todos", ...new Set(products.map((product) => product.genero))];
  container.innerHTML = genres.map((genre) => `<button class="filter-button ${genre === "Todos" ? "active" : ""}" data-genre="${genre}" type="button">${genre}</button>`).join("");
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-genre]");
    if (!button) return;
    selectedGenre = button.dataset.genre;
    container.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
    applyFilters();
  });
  document.querySelector("#search-input")?.addEventListener("input", applyFilters);
}

function renderProductDetail() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const product = products.find((item) => item.id === id);
  const detail = document.querySelector("#product-detail");
  if (!detail) return;
  if (!product) {
    detail.innerHTML = '<div class="empty-state"><h1>Jogo não encontrado</h1><a class="cta" href="index.html">Voltar à loja</a></div>';
    return;
  }
  detail.innerHTML = `
    <img class="detail-image" src="${product.imagem}" alt="Capa de ${product.nome}">
    <div><a class="back-link" href="index.html">← Voltar para a loja</a><p class="eyebrow">${product.genero} / ${product.anoLancamento}</p><h1>${product.nome}</h1><p class="detail-description">${product.descricao}</p><div class="detail-price">${formatPrice(product.preco)}</div><button class="cta" id="add-to-cart" type="button">Adicionar ao Carrinho</button><div class="specs"><div class="spec"><strong>Requisitos mínimos</strong><span>${product.requisitos.minimos}</span></div><div class="spec"><strong>Requisitos recomendados</strong><span>${product.requisitos.recomendados}</span></div></div></div>`;
  document.querySelector("#add-to-cart").addEventListener("click", () => {
    addToCart(product.id);
    window.location.href = "carrinho.html";
  });
}

function renderCart() {
  const list = document.querySelector("#cart-list");
  if (!list) return;
  const cartProducts = products.filter((product) => getCartIds().includes(product.id));
  const total = cartProducts.reduce((sum, product) => sum + product.preco, 0);
  document.querySelector("#cart-total").textContent = formatPrice(total);
  document.querySelector("#checkout-link").style.display = cartProducts.length ? "inline-flex" : "none";
  list.innerHTML = cartProducts.length ? cartProducts.map((product) => `<div class="cart-item"><img src="${product.imagem}" alt="Capa de ${product.nome}"><div class="cart-item-main"><h3>${product.nome}</h3><p>${product.genero} · ${formatPrice(product.preco)}</p></div><button class="remove-button" data-remove="${product.id}" type="button">Remover</button></div>`).join("") : '<div class="empty-state"><h3>Seu carrinho está vazio</h3><p>Escolha uma aventura na loja.</p></div>';
  list.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
    saveCartIds(getCartIds().filter((id) => id !== Number(button.dataset.remove)));
    renderCart();
  }));
}

async function loadProducts() {
  try {
    // fetch simula uma API de Headless Commerce e mantém os dados fora do HTML.
    const response = await fetch("products.json");
    if (!response.ok) throw new Error("Falha ao carregar catálogo");
    products = await response.json();
    setupFilters();
    renderProducts(products);
    renderProductDetail();
    renderCart();
  } catch (error) {
    const target = document.querySelector("#product-grid, #product-detail, #cart-list");
    if (target) target.innerHTML = `<div class="empty-state"><h3>Não foi possível carregar o catálogo.</h3><p>${error.message}</p></div>`;
  }
}

setupTheme();
updateCartCount();
loadProducts();