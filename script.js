$(document).ready(function () {
  $("#signup-btn").on("click", function (e) {
    e.preventDefault();
    const name = $("#signup-name").val();
    const email = $("#signup-email").val();
    const password = $("#signup-password").val();
    if (!name || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }
    const userData = {
      name: name,
      email: email,
      password: password,
    };
    localStorage.setItem("userCredentials", JSON.stringify(userData));
    alert("Registration Successful! Please Sign In.");
    window.location.href = "signin.html";
  });
  $("#signin-btn").on("click", function (e) {
    e.preventDefault();
    console.log("Sign In button clicked!");
    const emailInput = $("#signin-email").val();
    const passwordInput = $("#signin-password").val();
    const savedData = localStorage.getItem("userCredentials");
    console.log("Data in Storage:", savedData);
    if (savedData) {
      const user = JSON.parse(savedData);
      if (emailInput === user.email && passwordInput === user.password) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userName", user.name);
        console.log("Redirecting now...");
        window.location.href = "index.html";
      } else {
        alert("Invalid Email or Password!");
      }
    } else {
      alert("No account found. Please Sign Up first.");
    }
  });
  $("#google-signup").on("click", function () {
    const googleUser = {
      name: "Google User",
      email: "google@gmail.com",
    };
    localStorage.setItem("userCredentials", JSON.stringify(googleUser));
    sessionStorage.setItem("isLoggedIn", "true");
    alert("Signed up with Google successfully!");
    window.location.href = "index.html";
  });
});
$(document).ready(function () {
  function updateCartHeaderCount() {
    const cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    $("#cart-count").text(totalItems);
  }
  updateCartHeaderCount();
  $(document).on("click", ".add-to-cart-btn", function () {
    updateCartHeaderCount();
  });
});
$(document).ready(function () {
  function updateCartHeaderCount() {
    const cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    $("#cart-count").text(totalItems);
  }
});
//---------------------home----------
$(document).ready(function () {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const currentPage = window.location.pathname;
  if (
    !isLoggedIn &&
    !currentPage.includes("signin.html") &&
    !currentPage.includes("signup.html")
  ) {
    window.location.href = "signin.html";
    return;
  }
  if (
    currentPage.includes("index.html") ||
    currentPage.includes("index.html") ||
    currentPage === "/"
  ) {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        renderFeatured(data.slice(0, 10));
        renderAllProducts(data.slice(4, 12));
        renderCategories(data);
        setupHomeInteraction(data);
      });
  }
  function renderFeatured(products) {
    let html = "";
    products.forEach((item) => {
      html += `
            <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 w-72 flex-shrink-0">
        <a href="product.html?id=${item.id}" class="block">
            <div class="relative h-64 bg-gray-100/50 flex items-center justify-center p-4">
                <span class="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-green-600 text-white">Featured</span>
                <img src="${item.image}" class="max-h-full max-w-full object-contain">
            </div>
        </a>
        <div class="p-4">
            <a href="product.html?id=${item.id}">
                <h3 class="text-sm font-medium text-teal-600 mb-2 truncate hover:underline">${item.title}</h3>
            </a>
                        <button class="add-to-cart-btn w-8 h-8 rounded-lg bg-teal-500 text-white" 
                                data-id="${item.id}" data-title="${item.title}" 
                                data-price="${item.price}" data-img="${item.image}">
                            <i class="fa-solid fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>`;
    });
    $("#featured-container").html(html);
  }
  function renderAllProducts(products) {
    let html = "";
    products.forEach((item) => {
      html += `
            <div class="product-card bg-white rounded-xl overflow-hidden shadow-lg">
        <a href="product.html?id=${item.id}" class="block">
            <div class="relative h-64 bg-gray-100/50 flex items-center justify-center p-4">
                <img src="${item.image}" class="max-h-full max-w-full object-contain">
            </div>
        </a>
        <div class="p-4">
            <a href="product.html?id=${item.id}">
                <h3 class="text-sm font-medium text-gray-800 mb-2 truncate hover:text-teal-600">${item.title}</h3>
            </a>
                        <button class="add-to-cart-btn w-8 h-8 rounded-lg bg-teal-500 text-white" 
                                data-id="${item.id}" data-title="${item.title}" 
                                data-price="${item.price}" data-img="${item.image}">
                            <i class="fa-solid fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>`;
    });
    $("#all-products-container").html(html);
  }
  function renderCategories(products) {
    const categories = [...new Set(products.map((p) => p.category))];
    let html = categories
      .map((cat) => {
        const sampleImg = products.find((p) => p.category === cat).image;
        return `
            <a href="shop.html" class="group w-64 md:w-72 lg:w-80 flex-shrink-0 relative rounded-xl overflow-hidden shadow-lg">
                <img src="${sampleImg}" class="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1 capitalize">${cat}</h3>
                    <p class="text-sm text-gray-200">View Collection</p>
                </div>
            </a>`;
      })
      .join("");
    $("#category-container").html(html);
  }
  $(document).on("click", ".add-to-cart-btn", function () {
    const btn = $(this);
    let cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const newItem = {
      id: btn.data("id"),
      title: btn.data("title"),
      price: parseFloat(btn.data("price")),
      image: btn.data("img"),
      quantity: 1,
    };
    const existing = cart.find((item) => item.id == newItem.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(newItem);
    }
    localStorage.setItem("myCart", JSON.stringify(cart));
    updateCartHeaderCount();
    alert("Added to cart!");
  });
  function updateCartHeaderCount() {
    const cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    $("#cart-count").text(count);
  }
  function setupHomeInteraction(allProducts) {
    const categories = ["all", ...new Set(allProducts.map((p) => p.category))];
    let tabHtml = categories
      .map(
        (cat) => `
        <button class="filter-btn text-sm md:text-base font-semibold text-gray-700 border-b-2 border-transparent pb-2 hover:text-teal-600 capitalize transition duration-150" 
                data-category="${cat}">${cat}</button>`
      )
      .join("");
    $("#filter-tabs").html(tabHtml);
    $("#filter-tabs button")
      .first()
      .addClass("border-teal-600 text-teal-600")
      .removeClass("border-transparent");
    $(document).on("click", ".filter-btn", function () {
      const selectedCat = $(this).data("category");
      $(".filter-btn")
        .removeClass("border-teal-600 text-teal-600")
        .addClass("border-transparent");
      $(this)
        .addClass("border-teal-600 text-teal-600")
        .removeClass("border-transparent");
      const filtered =
        selectedCat === "all"
          ? allProducts.slice(4, 12)
          : allProducts.filter((p) => p.category === selectedCat);
      renderAllProducts(filtered);
    });
    $(document).on("click", "#cat-next", () =>
      document
        .querySelector(".overflow-x-auto")
        .scrollBy({ left: 300, behavior: "smooth" })
    );
    $(document).on("click", "#cat-prev", () =>
      document
        .querySelector(".overflow-x-auto")
        .scrollBy({ left: -300, behavior: "smooth" })
    );
    $(document).on("click", "#feat-next", () =>
      document
        .getElementById("featured-container")
        .scrollBy({ left: 300, behavior: "smooth" })
    );
    $(document).on("click", "#feat-prev", () =>
      document
        .getElementById("featured-container")
        .scrollBy({ left: -300, behavior: "smooth" })
    );
  }
  updateCartHeaderCount();
});
//------------shop, product, cart-------------
$(document).ready(function () {
  let allProducts = [];
  let filteredProducts = [];
  let itemsPerPage = 16;
  let currentPage = 1;
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const path = window.location.pathname;
  const isHomePage =
    path.includes("index.html") || path.includes("index.html") || path === "/";
  const isShopPage = path.includes("shop.html");
  const isProductPage = path.includes("product.html");
  const isCartPage = path.includes("Cart.html");
  if (
    !isLoggedIn &&
    !path.includes("signin.html") &&
    !path.includes("signup.html")
  ) {
    window.location.href = "signin.html";
  }
  init();
  async function init() {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      allProducts = await res.json();
      if (isHomePage) renderHome(allProducts);
      if (isShopPage) setupShop(allProducts);
      if (isProductPage) setupProductDetails();
      if (isCartPage) renderCart();
      updateCartCount();
    } catch (err) {
      console.error("Data Fetch Error:", err);
    }
  }
  function renderHome(data) {
    renderGrid(data.slice(0, 4), "#featured-container");
    renderGrid(data.slice(4, 12), "#all-products-container");
    renderCategories(data);
    setupHomeInteraction(data);
  }
  function renderProducts(products, container, isFeatured) {
    let html = products
      .map(
        (item) => `
            <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div class="relative h-64 bg-gray-100/50 flex items-center justify-center p-4">
                    ${
                      isFeatured
                        ? '<span class="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-green-600 text-white">Featured</span>'
                        : ""
                    }
                    <a href="product.html?id=${item.id}"><img src="${
          item.image
        }" class="max-h-full max-w-full object-contain"></a>
                </div>
                <div class="p-4">
                    <a href="product.html?id=${
                      item.id
                    }"><h3 class="text-sm font-medium text-gray-800 mb-2 truncate">${
          item.title
        }</h3></a>
                    <div class="flex justify-between items-center">
                        <p class="text-lg font-bold text-gray-900">$${
                          item.price
                        }</p>
                        <button class="add-to-cart-btn w-8 h-8 rounded-lg bg-teal-500 text-white" 
                                data-id="${item.id}" data-title="${
          item.title
        }" data-price="${item.price}" data-img="${item.image}">
                            <i class="fa-solid fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>`
      )
      .join("");
    $(container).html(html);
  }
  function renderCategories(products) {
    const categories = [...new Set(products.map((p) => p.category))];
    let html = categories
      .map((cat) => {
        const sampleImg = products.find((p) => p.category === cat).image;
        return `
            <a href="shop.html" class="group w-64 md:w-72 lg:w-80 flex-shrink-0 relative rounded-xl overflow-hidden shadow-lg">
                <img src="${sampleImg}" class="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1 capitalize">${cat}</h3>
                    <p class="text-sm text-gray-200">View Collection</p>
                </div>
            </a>`;
      })
      .join("");
    $("#category-container").html(html);
  }
  function setupShop(data) {
    const categories = ["all", ...new Set(data.map((p) => p.category))];
    $("#category-filter").html(
      categories
        .map((c) => `<option value="${c}">${c.toUpperCase()}</option>`)
        .join("")
    );
    runFiltering();
  }
  function runFiltering() {
    const query = $("#shop-search").val().toLowerCase();
    const cat = $("#category-filter").val();
    filteredProducts = allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) &&
        (cat === "all" || p.category === cat)
    );
    const sort = $("#sort").val();
    if (sort === "Price: Low to High")
      filteredProducts.sort((a, b) => a.price - b.price);
    if (sort === "Newest") filteredProducts.sort((a, b) => b.id - a.id);
    currentPage = 1;
    updateShopUI();
  }
  $(document).on("change", "#show", function () {
    currentPage = 1;
    updateShopUI();
  });
  function updateShopUI() {
    itemsPerPage = parseInt($("#show").val()) || 16;
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, filteredProducts.length);
    const paged = filteredProducts.slice(start, end);
    renderShopGrid(paged);
    if (typeof renderPagination === "function") {
      renderPagination(filteredProducts.length);
    }
    let countText = "";
    if (filteredProducts.length > 0) {
      countText = `Showing ${start + 1}–${end} of ${
        filteredProducts.length
      } results`;
    } else {
      countText = `Showing 0 results`;
    }
    $("#result-count").text(countText);
  }
  $("#shop-search, #sort, #category-filter, #show").on(
    "change input",
    runFiltering
  );
  function renderShopGrid(products) {
    let html = products
      .map(
        (item) => `
            <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <a href="product.html?id=${item.id}">
                    <div class="h-64 flex items-center justify-center p-5 bg-gray-50">
                        <img src="${item.image}" class="max-h-full max-w-full object-contain">
                    </div>
                </a>
                <div class="p-4 flex justify-between items-end">
                    <div>
                        <a href="product.html?id=${item.id}"><h3 class="text-sm font-medium text-gray-800 truncate w-40 hover:text-teal-600">${item.title}</h3></a>
                        <p class="text-xl font-bold text-gray-900">$${item.price}</p>
                    </div>
                    <button class="add-to-cart-btn w-10 h-10 bg-white rounded-lg shadow-md hover:bg-teal-600 hover:text-white flex items-center justify-center text-gray-500"
                            data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-img="${item.image}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>`
      )
      .join("");
    $("#shop-container").html(
      html || "<p class='col-span-full text-center py-10'>No items found.</p>"
    );
  }
  function setupProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      console.error("No Product ID found in URL");
      return;
    }
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((p) => {
        $("#p-title").text(p.title);
        $("#p-breadcrumb").text(p.title);
        $("#p-price").text(`$${p.price}`);
        $("#p-desc").text(p.description);
        $("#p-cat").text(p.category);
        $("#p-main-img").attr("src", p.image);
        $("#p-detail-img-1").attr("src", p.image);
        $("#p-detail-img-2").attr("src", p.image);
        renderStars(p.rating.rate);
        $("#add-to-cart-btn")
          .off("click")
          .on("click", function () {
            const qty = parseInt($("#product-qty").val()) || 1;
            addToCart(p.id, p.title, p.price, p.image, qty);
          });
      })
      .catch((err) => console.error("Error loading product:", err));
  }
  function addToCart(id, title, price, image, qty = 1) {
    let cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const existing = cart.find((item) => item.id == id);
    if (existing) existing.quantity += qty;
    else cart.push({ id, title, price, image, quantity: qty });
    localStorage.setItem("myCart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart!");
  }
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("myCart")) || [];
    let total = 0;
    let html = cart
      .map((item, i) => {
        const sub = item.price * item.quantity;
        total += sub;
        return `
            <div class="grid grid-cols-4 gap-4 items-center py-4 border-b">
                <div class="col-span-1 flex items-center space-x-4">
                    <img src="${item.image}" class="w-16 h-16 object-contain" />
                    <span class="text-sm font-medium hidden md:block">${
                      item.title
                    }</span>
                </div>
                <div class="hidden sm:block text-sm">$${item.price}</div>
                <div class="col-span-1">
                    <input type="number" value="${item.quantity}" min="1" 
                           class="update-qty w-12 border rounded text-center" 
                           data-index="${i}" />
                </div>
                <div class="col-span-3 sm:col-span-1 flex justify-end items-center space-x-4">
                    <span class="font-semibold">$${sub.toFixed(2)}</span>
                    <button class="delete-item text-red-500 hover:text-red-700" data-index="${i}">
                        <i class="fa-solid fa-trash-alt"></i>
                    </button>
                </div>
            </div>`;
      })
      .join("");
    $("#cart-items-container").html(
      html || '<p class="text-center py-10">Your cart is empty</p>'
    );
    $("#cart-subtotal, #cart-total").text(`$${total.toFixed(2)}`);
  }
  $(document).on("change", ".update-qty", function () {
    let cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const index = $(this).data("index");
    const newQty = parseInt($(this).val());
    if (newQty > 0) {
      cart[index].quantity = newQty;
      localStorage.setItem("myCart", JSON.stringify(cart));
      renderCart();
      updateCartHeaderCount();
    }
  });
  $(document).on("click", ".delete-item", function () {
    let cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const itemIndex = $(this).data("index");
    cart.splice(itemIndex, 1);
    localStorage.setItem("myCart", JSON.stringify(cart));
    updateCartHeaderCount();
    if (window.location.pathname.toLowerCase().includes("cart.html")) {
      renderCart();
    }
  });
  function updateCartHeaderCount() {
    const cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    $("#cart-count").text(count);
  }
  function renderStars(rate) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<i class="fa-solid ${
        i <= rate
          ? "fa-star"
          : i - 0.5 <= rate
          ? "fa-star-half-stroke"
          : "fa-regular fa-star"
      }"></i>`;
    }
    $(".text-yellow-500").html(stars);
  }
  $("#shop-search, #sort, #category-filter, #show").on(
    "change input",
    runFiltering
  );
  $(document).on("input", "#shop-search", function () {
    const query = $(this).val().toLowerCase();
    filteredProducts = allProducts.filter((p) =>
      p.title.toLowerCase().includes(query)
    );
    currentPage = 1;
    updateShopUI();
  });
  $(document).on("click", ".page-btn", function () {
    currentPage = $(this).data("page");
    updateShopUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
//--------------checkout----------------
function closeModal() {
  $("#orderModal").addClass("hidden").removeClass("flex");
}
function finalOrderConfirm() {
  localStorage.removeItem("myCart");
  window.location.href = "index.html";
}
$(document).ready(function () {
  if (window.location.pathname.toLowerCase().includes("checkout")) {
    renderCheckoutSummary();
  }
  $(document).on("click", "#place-order-btn", function (e) {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem("myCart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const billingData = {
      firstName: $("#first_name").val().trim(),
      lastName: $("#last_name").val().trim(),
      email: $("#email_address").val().trim(),
      phone: $("#phone").val().trim(),
      address: $("#street_address").val().trim(),
      city: $("#city").val().trim(),
      zip: $("#zip_code").val().trim(),
      payment:
        $('input[name="payment_method"]:checked').val() || "Not Selected",
    };
    if (
      !billingData.firstName ||
      !billingData.email ||
      !billingData.address ||
      !billingData.city
    ) {
      alert(
        "Please fill in all required fields (Name, Email, Address, and City)."
      );
      return;
    }
    let total = 0;
    let productsHtml = cart
      .map((item) => {
        const sub = item.price * item.quantity;
        total += sub;
        return `
                <div class="flex justify-between text-xs border-b border-gray-100 py-1">
                    <span>${item.title} (x${item.quantity})</span>
                    <span class="font-bold">$${sub.toFixed(2)}</span>
                </div>`;
      })
      .join("");
    let userHtml = `
            <div class="bg-teal-50 p-3 rounded-lg mb-4 text-sm border border-teal-100">
                <p><strong>Customer:</strong> ${billingData.firstName} ${
      billingData.lastName
    }</p>
                <p><strong>Email:</strong> ${billingData.email}</p>
                <p><strong>Shipping:</strong> ${billingData.address}, ${
      billingData.city
    } (${billingData.zip})</p>
                <p><strong>Payment:</strong> ${billingData.payment.toUpperCase()}</p>
            </div>
        `;
    $("#modal-order-details").html(
      userHtml +
        `<p class="font-bold mb-2 uppercase text-xs text-gray-500">Items:</p>` +
        productsHtml
    );
    $("#modal-total").text(`$${total.toFixed(2)}`);
    $("#orderModal").removeClass("hidden").addClass("flex");
  });
  function renderCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem("myCart")) || [];
    let subtotal = 0;
    let html = cart
      .map((item) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        return `
                <div class="flex justify-between text-sm text-gray-600 border-b border-gray-50 pb-2">
                    <span class="truncate w-48">${
                      item.title
                    } <strong class="text-gray-900">X ${
          item.quantity
        }</strong></span>
                    <span class="font-medium">$${itemSubtotal.toFixed(2)}</span>
                </div>`;
      })
      .join("");
    $("#checkout-items").html(
      html || "<p class='text-gray-400'>No items in order.</p>"
    );
    $("#checkout-subtotal, #checkout-total").text(`$${subtotal.toFixed(2)}`);
  }
});
//------------------- contact page ------------------
$(document).ready(function () {
  const path = window.location.pathname.toLowerCase();
  const isContactPage = path.includes("contact");
  if (isContactPage) {
    $("#contact-form").on("submit", function (e) {
      e.preventDefault();
      const contactData = {
        name: $("#name").val(),
        email: $("#email").val(),
        subject: $("#subject").val(),
        message: $("#message").val(),
        date: new Date().toLocaleString(),
      };
      let existingInquiries =
        JSON.parse(localStorage.getItem("contactInquiries")) || [];
      existingInquiries.push(contactData);
      localStorage.setItem(
        "contactInquiries",
        JSON.stringify(existingInquiries)
      );
      $(this).fadeOut(400, function () {
        $("#contact-success-msg").removeClass("hidden").fadeIn();
      });
      console.log("Contact detail saved to storage:", contactData);
    });
  }
});
