const CART_KEY = "steamgrid-cart";
const THEME_KEY = "steamgrid-theme";
let products = [];
let selectedGenre = "Todos";

function getCategories(product) {
  return Array.isArray(product.genero) ? product.genero : [product.genero];
}

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
      <a href="produto.html?id=${product.id}"><img class="product-image" src="${product.capa}" alt="Capa de ${product.nome}"></a>
      <div class="card-body">
        <div class="card-meta"><span>${getCategories(product).join(" / ")}</span><span>${product.anoLancamento}</span></div>
        <h3><a href="produto.html?id=${product.id}">${product.nome}</a></h3>
        <p class="card-description">${product.descricao}</p>
        <div class="card-footer"><span class="price">${formatPrice(product.preco)}</span><a class="cta" href="produto.html?id=${product.id}">Ver jogo</a></div>
      </div>
    </article>`).join("");
}

function applyFilters() {
  const searchTerm = (document.querySelector("#search-input")?.value || "").toLowerCase();
  const filtered = products.filter((product) => {
    const categories = getCategories(product);
    const matchesGenre = selectedGenre === "Todos" || categories.includes(selectedGenre);
    const matchesSearch = `${product.nome} ${categories.join(" ")} ${product.descricao}`.toLowerCase().includes(searchTerm);
    return matchesGenre && matchesSearch;
  });
  renderProducts(filtered);
}

function setupFilters() {
  const container = document.querySelector("#genre-filters");
  if (!container) return;
  const genres = ["Todos", ...new Set(products.flatMap(getCategories))];
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
  const gallery = [product.capa, ...(product.galeria || [])];
  detail.innerHTML = `
    <div class="detail-media">
      <img class="detail-image" id="detail-main-image" src="${product.capa}" alt="Capa de ${product.nome}">
      <div class="detail-gallery" aria-label="Galeria de imagens de ${product.nome}">
        ${gallery.map((image, index) => `<button class="gallery-thumb${index === 0 ? " active" : ""}" type="button" aria-label="Ver imagem ${index + 1} de ${product.nome}" data-image="${image}"><img src="${image}" alt=""></button>`).join("")}
      </div>
    </div>
    <div><a class="back-link" href="index.html">← Voltar para a loja</a><p class="eyebrow">${getCategories(product).join(" / ")} / ${product.anoLancamento}</p><h1>${product.nome}</h1><p class="detail-description">${product.descricao}</p><div class="detail-price">${formatPrice(product.preco)}</div><button class="cta" id="add-to-cart" type="button">Adicionar ao Carrinho</button><div class="specs"><div class="spec"><strong>Requisitos mínimos</strong><span>${product.requisitos.minimos}</span></div><div class="spec"><strong>Requisitos recomendados</strong><span>${product.requisitos.recomendados}</span></div></div></div>`;
  const mainImage = document.querySelector("#detail-main-image");
  document.querySelectorAll(".gallery-thumb").forEach((thumbnail) => thumbnail.addEventListener("click", () => {
    mainImage.src = thumbnail.dataset.image;
    document.querySelectorAll(".gallery-thumb").forEach((item) => item.classList.toggle("active", item === thumbnail));
  }));
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
  list.innerHTML = cartProducts.length ? cartProducts.map((product) => `<div class="cart-item"><img src="${product.capa}" alt="Capa de ${product.nome}"><div class="cart-item-main"><h3>${product.nome}</h3><p>${getCategories(product).join(" / ")} · ${formatPrice(product.preco)}</p></div><button class="remove-button" data-remove="${product.id}" type="button">Remover</button></div>`).join("") : '<div class="empty-state"><h3>Seu carrinho está vazio</h3><p>Escolha uma aventura na loja.</p></div>';
  list.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
    saveCartIds(getCartIds().filter((id) => id !== Number(button.dataset.remove)));
    renderCart();
  }));
}

function setupCheckout() {
  const form = document.querySelector(".form");
  if (!form) return;
  const paymentSelect = form.querySelector("[name=pagamento]");
  const details = document.querySelector("#payment-details");
  let pixTimer;
  const getTotal = () => products.filter((product) => getCartIds().includes(product.id)).reduce((total, product) => total + product.preco, 0);
  const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const getInterestRate = (count) => count === 1 ? 0 : Math.min(0.02 * (count - 1), 0.22);
  const formatCardNumber = (value) => value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const updateBoletoCustomer = () => {
    if (paymentSelect.value !== "boleto") return;
    const customerName = form.elements.nome.value.trim();
    const customerEmail = form.elements.email.value.trim();
    if (!customerName || !customerEmail) {
      details.innerHTML = `<div class="payment-panel boleto-required"><strong>Preencha seu nome e e-mail para gerar o boleto.</strong></div>`;
      return;
    }
    if (!details.querySelector("#boleto")) {
      renderPaymentDetails();
      return;
    }
    const name = details.querySelector("#boleto-name");
    const email = details.querySelector("#boleto-email");
    if (name) name.textContent = customerName;
    if (email) email.textContent = customerEmail;
  };

  const renderPaymentDetails = () => {
    clearInterval(pixTimer);
    details.innerHTML = "";
    if (paymentSelect.value === "cartao") {
      const total = getTotal();
      details.innerHTML = `<div class="payment-panel card-panel"><h2>Dados do cartão</h2><label>Número do cartão<input required type="text" inputmode="numeric" name="numero-cartao" placeholder="0000 0000 0000 0000" maxlength="19"></label><div class="form-row"><label>Validade<input required type="text" name="validade-cartao" placeholder="MM/AA" maxlength="5"></label><label>CVV<input required type="text" name="cvv-cartao" inputmode="numeric" placeholder="123" maxlength="4"></label></div><div class="installment-control"><label for="installments">Quantidade de parcelas</label><div class="installment-input-row"><input id="installments" type="number" name="parcelas" min="1" max="12" value="1" required><span>de 1 a 12 parcelas</span></div><div class="installment-summary" id="installment-summary"></div></div></div>`;
      const cardNumber = details.querySelector("[name=numero-cartao]");
      const expiry = details.querySelector("[name=validade-cartao]");
      const cvv = details.querySelector("[name=cvv-cartao]");
      cardNumber.addEventListener("input", () => { cardNumber.value = formatCardNumber(cardNumber.value); });
      expiry.addEventListener("input", () => { expiry.value = formatExpiry(expiry.value); });
      cvv.addEventListener("input", () => { cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4); });
      const installments = details.querySelector("#installments");
      const summary = details.querySelector("#installment-summary");
      const updateInstallmentSummary = () => {
        const count = Math.min(12, Math.max(1, Number(installments.value) || 1));
        installments.value = count;
        const rate = getInterestRate(count);
        const finalTotal = total * (1 + rate);
        summary.innerHTML = `<strong>${count}x de ${formatPrice(finalTotal / count)}</strong><span>${rate ? `${(rate * 100).toFixed(0)}% de juros` : "Sem juros"} · Total: ${formatPrice(finalTotal)}</span>`;
      };
      installments.addEventListener("input", updateInstallmentSummary);
      updateInstallmentSummary();
      return;
    }
    if (paymentSelect.value === "pix") {
      let secondsLeft = 300;
      details.innerHTML = `<div class="payment-panel pix-panel"><h2>Pagamento via Pix</h2><div class="qr-code" role="img" aria-label="QR Code genérico para pagamento Pix"><span></span></div><p class="payment-code">PIX-GENERICO-STEAMGRID-2026</p><p>Escaneie o código ou use o código acima.</p><div class="pix-timer"><span>Tempo para pagar</span><strong id="pix-countdown">05:00</strong></div></div>`;
      const countdown = details.querySelector("#pix-countdown");
      pixTimer = setInterval(() => {
        secondsLeft -= 1;
        countdown.textContent = formatTime(Math.max(secondsLeft, 0));
        if (secondsLeft <= 0) {
          clearInterval(pixTimer);
          details.querySelector(".payment-code").textContent = "Prazo Pix encerrado. Gere um novo código.";
        }
      }, 1000);
      return;
    }
    if (paymentSelect.value === "boleto") {
      const customerName = form.elements.nome.value.trim();
      const customerEmail = form.elements.email.value.trim();
      if (!customerName || !customerEmail) {
        updateBoletoCustomer();
        return;
      }
      details.innerHTML = `<div class="payment-panel boleto-panel" id="boleto"><h2>Boleto bancário</h2><div class="boleto-customer"><p><strong>Nome:</strong> <span id="boleto-name">${customerName}</span></p><p><strong>E-mail:</strong> <span id="boleto-email">${customerEmail}</span></p></div><p>Vencimento: ${new Date(Date.now() + 86400000).toLocaleDateString("pt-BR")}</p><p>Valor: <strong>${formatPrice(getTotal())}</strong></p><p class="barcode">|||| ||| |||| | ||| || ||||</p><p class="payment-code">34191.79001 01043.510047 91020.150008 1 98760000000000</p><button class="secondary-button" id="print-boleto" type="button">Imprimir boleto</button></div>`;
      details.querySelector("#print-boleto").addEventListener("click", () => window.print());
    }
  };

  paymentSelect.addEventListener("change", renderPaymentDetails);
  form.elements.nome.addEventListener("input", updateBoletoCustomer);
  form.elements.email.addEventListener("input", updateBoletoCustomer);
  form.addEventListener("submit", () => {
    saveCartIds([]);
    clearInterval(pixTimer);
  });
  renderPaymentDetails();
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
    setupCheckout();
  } catch (error) {
    const target = document.querySelector("#product-grid, #product-detail, #cart-list");
    if (target) target.innerHTML = `<div class="empty-state"><h3>Não foi possível carregar o catálogo.</h3><p>${error.message}</p></div>`;
  }
}

setupTheme();
updateCartCount();
loadProducts();