const CART_KEY = "gamegrid-cart";
const ORDER_KEY = "gamegrid-last-order";
const SOLD_KEY = "gamegrid-sold";
const THEME_KEY = "gamegrid-theme";
let products = [];
let selectedGenre = "Todos";
let visibleProductCount = 9;

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

function getDiscountRate(itemCount) {
  if (itemCount >= 3) return 0.15;
  if (itemCount === 2) return 0.10;
  return 0;
}

function getCartSummary(cartProducts) {
  const subtotal = cartProducts.reduce((sum, product) => sum + product.preco, 0);
  const discountRate = getDiscountRate(cartProducts.length);
  const discount = subtotal * discountRate;
  return { subtotal, discountRate, discount, total: subtotal - discount };
}

function saveOrder(order) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

function getSoldIds() {
  return JSON.parse(localStorage.getItem(SOLD_KEY) || "[]");
}

function saveSoldIds(ids) {
  localStorage.setItem(SOLD_KEY, JSON.stringify(ids));
}

function getAvailableProducts() {
  const soldIds = new Set(getSoldIds());
  return products.filter((product) => !soldIds.has(product.id));
}

function handleImageError(event) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = "true";
  image.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="460" height="215" viewBox="0 0 460 215"><rect width="460" height="215" fill="#26394a"/><path d="M0 175 115 92l86 60 72-78 187 101H0Z" fill="#36556b"/><circle cx="350" cy="64" r="27" fill="#65b8e8"/><text x="230" y="125" fill="#edf4fa" font-family="sans-serif" font-size="18" text-anchor="middle">Imagem indisponível</text></svg>`)}`;
  image.classList.add("image-fallback");
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

function updateBrandLogo() {
  const isDark = document.body.classList.contains("dark-mode");
  document.querySelectorAll(".brand-logo").forEach((logo) => {
    logo.src = isDark ? "GameGridEscuro.png" : "GameGridClaro.png";
    logo.alt = isDark ? "Logo GameGrid em tema escuro" : "Logo GameGrid em tema claro";
  });
}

function setupTheme() {
  const toggle = document.querySelector("#theme-toggle");
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "dark") document.body.classList.add("dark-mode");
  updateBrandLogo();
  if (!toggle) return;
  toggle.textContent = document.body.classList.contains("dark-mode") ? "☾" : "☼";
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    toggle.textContent = isDark ? "☾" : "☼";
    updateBrandLogo();
  });
}

// Cards são injetados dinamicamente para demonstrar o fluxo de uma vitrine headless.
function renderProducts(list, resetCount = false) {
  const grid = document.querySelector("#product-grid");
  const count = document.querySelector("#result-count");
  const loadMore = document.querySelector("#load-more");
  const listEndMessage = document.querySelector("#list-end-message");
  if (!grid) return;
  if (resetCount) visibleProductCount = 9;
  if (!list.length) {
    count.textContent = "0 jogos encontrados";
    grid.innerHTML = '<div class="empty-state"><h3>Nenhum jogo encontrado</h3><p>Tente outro termo ou gênero.</p></div>';
    if (loadMore) loadMore.hidden = true;
    if (listEndMessage) listEndMessage.hidden = true;
    return;
  }
  const visibleProducts = list.slice(0, visibleProductCount);
  count.textContent = visibleProducts.length === list.length
    ? `${list.length} ${list.length === 1 ? "jogo encontrado" : "jogos encontrados"}`
    : `${visibleProducts.length} de ${list.length} jogos`;
  grid.innerHTML = visibleProducts.map((product, index) => `
    <article class="product-card">
      <a href="produto.html?id=${product.id}"><img class="product-image" src="${product.capa}" alt="Capa de ${product.nome}" width="460" height="215" loading="${index < 4 ? "eager" : "lazy"}" decoding="async" onerror="handleImageError(event)"></a>
      <div class="card-body">
        <div class="card-meta"><span>${getCategories(product).join(" / ")}</span><span>${product.anoLancamento}</span></div>
        <h3><a href="produto.html?id=${product.id}">${product.nome}</a></h3>
        <p class="card-description">${product.descricao}</p>
        <div class="card-footer"><span class="price">${formatPrice(product.preco)}</span><a class="cta" href="produto.html?id=${product.id}">Ver jogo</a></div>
      </div>
    </article>`).join("");
  if (loadMore) loadMore.hidden = visibleProducts.length >= list.length;
  if (listEndMessage) listEndMessage.hidden = visibleProducts.length < list.length;
}

function setupLoadMore() {
  const loadMore = document.querySelector("#load-more");
  if (!loadMore) return;
  loadMore.addEventListener("click", () => {
    visibleProductCount += 9;
    applyFilters(false);
  });
}

function applyFilters(resetCount = true) {
  const searchTerm = (document.querySelector("#search-input")?.value || "").toLowerCase();
  const filtered = getAvailableProducts().filter((product) => {
    const categories = getCategories(product);
    const matchesGenre = selectedGenre === "Todos" || categories.includes(selectedGenre);
    const matchesSearch = `${product.nome} ${categories.join(" ")} ${product.descricao}`.toLowerCase().includes(searchTerm);
    return matchesGenre && matchesSearch;
  });
  renderProducts(filtered, resetCount);
}

function setupFilters() {
  const container = document.querySelector("#genre-filters");
  if (!container) return;
  const trigger = document.querySelector("#category-trigger");
  const panel = document.querySelector("#category-panel");
  const closeButton = document.querySelector("#category-close");
  const genres = ["Todos", ...new Set(getAvailableProducts().flatMap(getCategories))];
  container.innerHTML = genres.map((genre) => `<button class="filter-button ${genre === "Todos" ? "active" : ""}" data-genre="${genre}" type="button">${genre}</button>`).join("");
  const closePanel = () => {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  };
  trigger.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    trigger.setAttribute("aria-expanded", String(!panel.hidden));
  });
  closeButton.addEventListener("click", closePanel);
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-genre]");
    if (!button) return;
    selectedGenre = button.dataset.genre;
    container.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
    trigger.textContent = selectedGenre === "Todos" ? "Pesquisar por categorias" : `Categoria: ${selectedGenre}`;
    applyFilters();
    closePanel();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".category-picker")) closePanel();
  });
  document.querySelector("#search-input")?.addEventListener("input", applyFilters);
}

function renderProductDetail() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const product = getAvailableProducts().find((item) => item.id === id);
  const detail = document.querySelector("#product-detail");
  if (!detail) return;
  if (!product) {
    detail.innerHTML = '<div class="empty-state"><h1>Jogo não encontrado</h1><p>Este jogo já foi comprado e saiu da loja.</p><a class="cta" href="index.html">Voltar à loja</a></div>';
    return;
  }
  const gallery = [product.capa, ...(product.galeria || [])];
  detail.innerHTML = `
    <div class="detail-media">
      <img class="detail-image" id="detail-main-image" src="${product.capa}" alt="Capa de ${product.nome}" width="460" height="215" decoding="async" onerror="handleImageError(event)">
      <div class="detail-gallery" aria-label="Galeria de imagens de ${product.nome}">
        ${gallery.map((image, index) => `<button class="gallery-thumb${index === 0 ? " active" : ""}" type="button" aria-label="Ver imagem ${index + 1} de ${product.nome}" data-image="${image}"><img src="${image}" alt="" width="1920" height="1080" loading="lazy" decoding="async" onerror="handleImageError(event)"></button>`).join("")}
      </div>
    </div>
    <div class="detail-info"><a class="back-link" href="index.html">← Voltar para a loja</a><p class="eyebrow">${getCategories(product).join(" / ")} / ${product.anoLancamento}</p><h1>${product.nome}</h1><p class="detail-description">${product.descricao}</p><div class="detail-price">${formatPrice(product.preco)}</div><button class="cta" id="add-to-cart" type="button">Adicionar ao Carrinho</button><div class="specs"><div class="spec"><strong>Requisitos mínimos</strong><span>${product.requisitos.minimos}</span></div><div class="spec"><strong>Requisitos recomendados</strong><span>${product.requisitos.recomendados}</span></div></div></div>`;
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
  const summary = getCartSummary(cartProducts);
  document.querySelector("#cart-subtotal").textContent = formatPrice(summary.subtotal);
  document.querySelector("#cart-discount").textContent = summary.discount ? `- ${formatPrice(summary.discount)}` : "R$ 0,00";
  document.querySelector("#cart-total").textContent = formatPrice(summary.total);
  document.querySelector("#discount-message").textContent = summary.discountRate ? `${summary.discountRate * 100}% de desconto aplicado` : cartProducts.length === 1 ? "Adicione mais um jogo e ganhe 10% de desconto." : "Adicione 2 jogos e ganhe 10% de desconto.";
  document.querySelector("#checkout-link").style.display = cartProducts.length ? "inline-flex" : "none";
  list.innerHTML = cartProducts.length ? cartProducts.map((product) => `<div class="cart-item"><img src="${product.capa}" alt="Capa de ${product.nome}" width="460" height="215" loading="lazy" decoding="async" onerror="handleImageError(event)"><div class="cart-item-main"><h3>${product.nome}</h3><p>${getCategories(product).join(" / ")} · ${formatPrice(product.preco)}</p></div><button class="remove-button" data-remove="${product.id}" type="button">Remover</button></div>`).join("") : '<div class="empty-state"><h3>Seu carrinho está vazio</h3><p>Escolha uma aventura na loja.</p></div>';
  list.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
    saveCartIds(getCartIds().filter((id) => id !== Number(button.dataset.remove)));
    renderCart();
  }));
  renderRecommendations(cartProducts);
}

function renderRecommendations(cartProducts) {
  const section = document.querySelector("#recommendations");
  const grid = document.querySelector("#recommendation-grid");
  if (!section || !grid) return;
  if (!cartProducts.length) {
    section.hidden = true;
    grid.innerHTML = "";
    return;
  }
  const cartIds = cartProducts.map((product) => product.id);
  const cartCategories = new Set(cartProducts.flatMap(getCategories));
  const recommendations = getAvailableProducts()
    .filter((product) => !cartIds.includes(product.id))
    .sort((first, second) => {
      const firstScore = getCategories(first).filter((category) => cartCategories.has(category)).length;
      const secondScore = getCategories(second).filter((category) => cartCategories.has(category)).length;
      return secondScore - firstScore;
    })
    .slice(0, 4);
  section.hidden = !recommendations.length;
  grid.innerHTML = recommendations.map((product) => `<article class="recommendation-item"><img src="${product.capa}" alt="Capa de ${product.nome}" width="460" height="215" loading="lazy" decoding="async" onerror="handleImageError(event)"><div><strong>${product.nome}</strong><span>${getCategories(product).join(" / ")}</span><b>${formatPrice(product.preco)}</b><button class="secondary-button" data-recommendation="${product.id}" type="button">Adicionar</button></div></article>`).join("");
  grid.querySelectorAll("[data-recommendation]").forEach((button) => button.addEventListener("click", () => {
    addToCart(Number(button.dataset.recommendation));
    renderCart();
  }));
}

function setupCheckout() {
  const form = document.querySelector(".form");
  if (!form) return;
  const paymentSelect = form.querySelector("[name=pagamento]");
  const details = document.querySelector("#payment-details");
  let pixTimer;
  const getCartProducts = () => products.filter((product) => getCartIds().includes(product.id));
  const getTotal = () => getCartSummary(getCartProducts()).total;
  if (!getCartProducts().length) {
    window.location.replace("carrinho.html");
    return;
  }
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
      details.innerHTML = `<div class="payment-panel pix-panel"><h2>Pagamento via Pix</h2><div class="qr-code" role="img" aria-label="QR Code genérico para pagamento Pix"><span></span></div><p class="payment-code">PIX-GENERICO-GAMEGRID-2026</p><p>Escaneie o código ou use o código acima.</p><div class="pix-timer"><span>Tempo para pagar</span><strong id="pix-countdown">05:00</strong></div></div>`;
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
      const cartProducts = getCartProducts();
      const cartSummary = getCartSummary(cartProducts);
      const productRows = cartProducts.map((product) => `<div class="boleto-product"><span>${product.nome}</span><strong>${formatPrice(product.preco)}</strong></div>`).join("");
      details.innerHTML = `<div class="payment-panel boleto-panel" id="boleto"><h2>Boleto bancário</h2><div class="boleto-customer"><p><strong>Nome:</strong> <span id="boleto-name">${customerName}</span></p><p><strong>E-mail:</strong> <span id="boleto-email">${customerEmail}</span></p></div><div class="boleto-products"><strong class="boleto-products-title">Jogos selecionados</strong>${productRows}</div><div class="boleto-summary"><p>Vencimento: <strong>${new Date(Date.now() + 86400000).toLocaleDateString("pt-BR")}</strong></p><p>Subtotal: <strong>${formatPrice(cartSummary.subtotal)}</strong></p><p>Desconto: <strong>-${formatPrice(cartSummary.discount)}</strong></p><p>Valor total: <strong>${formatPrice(cartSummary.total)}</strong></p></div><p class="barcode">|||| ||| |||| | ||| || ||||</p><p class="payment-code">34191.79001 01043.510047 91020.150008 1 98760000000000</p><button class="secondary-button" id="print-boleto" type="button">Imprimir boleto</button></div>`;
      details.querySelector("#print-boleto").addEventListener("click", () => window.print());
    }
  };

  paymentSelect.addEventListener("change", renderPaymentDetails);
  form.elements.nome.addEventListener("input", updateBoletoCustomer);
  form.elements.email.addEventListener("input", updateBoletoCustomer);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const cartProducts = getCartProducts();
    if (!cartProducts.length) {
      window.location.replace("carrinho.html");
      return;
    }
    const cardNumber = form.elements["numero-cartao"]?.value.replace(/\D/g, "") || "";
    const installments = Number(form.elements.parcelas?.value || 1);
    const order = {
      numeroPedido: `SG-${Date.now()}`,
      criadoEm: new Date().toISOString(),
      cliente: {
        nome: form.elements.nome.value.trim(),
        email: form.elements.email.value.trim()
      },
      itens: cartProducts.map((product) => ({
        id: product.id,
        nome: product.nome,
        categorias: getCategories(product),
        preco: product.preco,
        quantidade: 1
      })),
      pagamento: {
        tipo: paymentSelect.value,
        nome: paymentSelect.options[paymentSelect.selectedIndex].text,
        parcelas: paymentSelect.value === "cartao" ? installments : null,
        cartaoFinal: paymentSelect.value === "cartao" && cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : null
      },
      subtotal: getCartSummary(cartProducts).subtotal,
      desconto: getCartSummary(cartProducts).discount,
      total: getTotal(),
      observacao: "Este pedido e uma simulacao local. Nenhum dado e enviado para um banco de dados ou servico externo."
    };
    const soldIds = [...new Set([...getSoldIds(), ...cartProducts.map((product) => product.id)])];
    saveOrder(order);
    saveSoldIds(soldIds);
    saveCartIds([]);
    clearInterval(pixTimer);
    window.location.href = form.action;
  });
  renderPaymentDetails();
}

function renderFeedback() {
  const preview = document.querySelector("#order-json");
  const toggle = document.querySelector("#show-order-json");
  if (!preview || !toggle) return;
  const order = JSON.parse(localStorage.getItem(ORDER_KEY) || "null");
  if (!order) {
    toggle.hidden = true;
    return;
  }
  preview.textContent = JSON.stringify(order, null, 2);
  toggle.addEventListener("click", () => {
    const isHidden = preview.hidden;
    preview.hidden = !isHidden;
    toggle.setAttribute("aria-expanded", String(isHidden));
    toggle.textContent = isHidden ? "Ocultar JSON do pedido" : "Ver possível JSON enviado ao banco de dados fictício";
  });
}

async function loadProducts() {
  try {
    // fetch simula uma API de Headless Commerce e mantém os dados fora do HTML.
    const response = await fetch("products.json");
    if (!response.ok) throw new Error("Falha ao carregar catálogo");
    products = await response.json();
    setupFilters();
    setupLoadMore();
    renderProducts(getAvailableProducts(), true);
    renderProductDetail();
    renderCart();
    setupCheckout();
    renderFeedback();
  } catch (error) {
    const target = document.querySelector("#product-grid, #product-detail, #cart-list");
    if (target) target.innerHTML = `<div class="empty-state"><h3>Não foi possível carregar o catálogo.</h3><p>${error.message}</p></div>`;
  }
}

setupTheme();
updateCartCount();
loadProducts();