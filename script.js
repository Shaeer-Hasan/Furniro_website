$(document).ready(function () {
  // --- SIGN UP LOGIC ---
  $("#signup-btn").on("click", function (e) {
    e.preventDefault();

    // Get values from inputs
    const name = $("#signup-name").val();
    const email = $("#signup-email").val();
    const password = $("#signup-password").val();

    // Validation
    if (!name || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    // Create user object
    const userData = {
      name: name,
      email: email,
      password: password,
    };

    // Save to LocalStorage
    localStorage.setItem("userCredentials", JSON.stringify(userData));

    alert("Registration Successful! Please Sign In.");
    window.location.href = "signin.html";
  });

  // --- SIGN IN LOGIC ---
  $("#signin-btn").on("click", function (e) {
    e.preventDefault();
    console.log("Sign In button clicked!"); // Check if button works

    const emailInput = $("#signin-email").val();
    const passwordInput = $("#signin-password").val();

    const savedData = localStorage.getItem("userCredentials");
    console.log("Data in Storage:", savedData); // Check if data exists

    if (savedData) {
      const user = JSON.parse(savedData);

      if (emailInput === user.email && passwordInput === user.password) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userName", user.name);

        console.log("Redirecting now...");
        // MAKE SURE THIS NAME MATCHES YOUR FILE EXACTLY
        window.location.href = "home.html";
      } else {
        alert("Invalid Email or Password!");
      }
    } else {
      alert("No account found. Please Sign Up first.");
    }
  });

  // --- GOOGLE SIGN UP (Simulated) ---
  $("#google-signup").on("click", function () {
    const googleUser = {
      name: "Google User",
      email: "google@gmail.com",
    };
    localStorage.setItem("userCredentials", JSON.stringify(googleUser));
    sessionStorage.setItem("isLoggedIn", "true");
    alert("Signed up with Google successfully!");
    window.location.href = "home.html";
  });
});

//---------------------home----------
$(document).ready(function () {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const currentPage = window.location.pathname;

  // 1. Auth Guard
  if (
    !isLoggedIn &&
    !currentPage.includes("signin.html") &&
    !currentPage.includes("signup.html")
  ) {
    window.location.href = "signin.html";
  }

  // 2. Fetch Data (Only on Home Page)
  if (
    currentPage.includes("home.html") ||
    currentPage.includes("index.html") ||
    currentPage === "/"
  ) {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        renderFeatured(data.slice(0, 4)); // First 4 for Featured
        renderAllProducts(data.slice(4, 12)); // Next 8 for "Our Products"
        renderCategories(data); // Build categories based on data
      });
  }

  // --- RENDER FEATURED PRODUCTS ---
  function renderFeatured(products) {
    let html = "";
    products.forEach((item) => {
      html += `
            <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div class="relative h-64 bg-gray-100/50 flex items-center justify-center p-4">
                    <span class="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-green-600 text-white">Featured</span>
                    <img src="${item.image}" class="max-h-full max-w-full object-contain">
                </div>
                <div class="p-4">
                    <h3 class="text-sm font-medium text-teal-600 mb-2 truncate">${item.title}</h3>
                    <div class="flex justify-between items-center">
                        <p class="text-lg font-bold text-gray-900">$${item.price}</p>
                        <button class="w-8 h-8 rounded-lg bg-teal-500 text-white"><i class="fa-solid fa-shopping-cart"></i></button>
                    </div>
                </div>
            </div>`;
    });
    $("#featured-container").html(html);
  }

  // --- RENDER CATEGORIES ---
  function renderCategories(products) {
    // Extract unique categories from the product list
    const categories = [...new Set(products.map((p) => p.category))];
    let html = "";
    categories.forEach((cat) => {
      // Find one image to represent the category
      const sampleImg = products.find((p) => p.category === cat).image;
      html += `
            <a href="#" class="group w-64 md:w-72 lg:w-80 flex-shrink-0 relative rounded-xl overflow-hidden shadow-lg">
                <img src="${sampleImg}" class="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1 capitalize">${cat}</h3>
                    <p class="text-sm text-gray-200">View Collection</p>
                </div>
            </a>`;
    });
    $("#category-container").html(html);
  }

  // --- RENDER ALL PRODUCTS ---
  function renderAllProducts(products) {
    let html = "";
    products.forEach((item) => {
      html += `
            <div class="product-card">
                <div class="relative h-64 bg-gray-100/50 flex items-center justify-center p-4">
                    <img src="${item.image}" class="max-h-full max-w-full object-contain">
                </div>
                <div class="p-4">
                    <h3 class="text-sm font-medium text-gray-800 mb-2 truncate">${item.title}</h3>
                    <div class="flex justify-between items-center">
                        <p class="text-lg font-bold text-gray-900">$${item.price}</p>
                        <button class="w-8 h-8 rounded-lg bg-gray-200 hover:bg-teal-500 hover:text-white transition">
                            <i class="fa-solid fa-shopping-cart text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>`;
    });
    $("#all-products-container").html(html);
  }
});

//------------shop, product, cart-------------
$(document).ready(function () {
    // --- GLOBAL VARIABLES & STATE ---
    let allProducts = [];
    let filteredProducts = [];
    let itemsPerPage = 8;
    let currentPage = 1;

    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const path = window.location.pathname;
    const isHomePage = path.includes("home.html") || path.includes("index.html") || path === "/";
    const isShopPage = path.includes("shop.html");
    const isProductPage = path.includes("product.html");
    const isCartPage = path.includes("Cart.html");

    // 1. AUTH GUARD
    if (!isLoggedIn && !path.includes("signin.html") && !path.includes("signup.html")) {
        window.location.href = "signin.html";
    }

    // 2. INITIALIZATION
    init();

    async function init() {
        try {
            const res = await fetch('https://fakestoreapi.com/products');
            allProducts = await res.json();

            if (isHomePage) renderHome(allProducts);
            if (isShopPage) setupShop(allProducts);
            if (isProductPage) setupProductDetails();
            if (isCartPage) renderCart();
            
            updateCartCount(); // Update nav icon count on every page
        } catch (err) {
            console.error("Data Fetch Error:", err);
        }
    }

    // --- HOME PAGE LOGIC ---
    function renderHome(data) {
        renderProducts(data.slice(0, 4), "#featured-container", true);
        renderProducts(data.slice(4, 12), "#all-products-container", false);
        renderCategories(data);
    }

    function renderProducts(products, container, isFeatured) {
        let html = products.map(item => `
            <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div class="relative h-64 bg-gray-100/50 flex items-center justify-center p-4">
                    ${isFeatured ? '<span class="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-green-600 text-white">Featured</span>' : ''}
                    <a href="product.html?id=${item.id}"><img src="${item.image}" class="max-h-full max-w-full object-contain"></a>
                </div>
                <div class="p-4">
                    <a href="product.html?id=${item.id}"><h3 class="text-sm font-medium text-gray-800 mb-2 truncate">${item.title}</h3></a>
                    <div class="flex justify-between items-center">
                        <p class="text-lg font-bold text-gray-900">$${item.price}</p>
                        <button class="add-to-cart-btn w-8 h-8 rounded-lg bg-teal-500 text-white" 
                                data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-img="${item.image}">
                            <i class="fa-solid fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>`).join("");
        $(container).html(html);
    }

    function renderCategories(products) {
        const categories = [...new Set(products.map(p => p.category))];
        let html = categories.map(cat => {
            const sampleImg = products.find(p => p.category === cat).image;
            return `
            <a href="shop.html" class="group w-64 md:w-72 lg:w-80 flex-shrink-0 relative rounded-xl overflow-hidden shadow-lg">
                <img src="${sampleImg}" class="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1 capitalize">${cat}</h3>
                    <p class="text-sm text-gray-200">View Collection</p>
                </div>
            </a>`;
        }).join("");
        $("#category-container").html(html);
    }

    // --- SHOP PAGE LOGIC ---
    function setupShop(data) {
        const categories = ["all", ...new Set(data.map(p => p.category))];
        $("#category-filter").html(categories.map(c => `<option value="${c}">${c.toUpperCase()}</option>`).join(""));
        runFiltering();
    }

    function runFiltering() {
        const query = $("#shop-search").val().toLowerCase();
        const cat = $("#category-filter").val();
        
        filteredProducts = allProducts.filter(p => 
            (p.title.toLowerCase().includes(query)) && (cat === "all" || p.category === cat)
        );

        const sort = $("#sort").val();
        if (sort === "Price: Low to High") filteredProducts.sort((a, b) => a.price - b.price);
        if (sort === "Newest") filteredProducts.sort((a, b) => b.id - a.id);

        currentPage = 1;
        updateShopUI();
    }

    function updateShopUI() {
        itemsPerPage = parseInt($("#show").val()) || 8;
        const start = (currentPage - 1) * itemsPerPage;
        const paged = filteredProducts.slice(start, start + itemsPerPage);
        
        renderShopGrid(paged);
        renderPagination(filteredProducts.length);
        $("#result-count").text(`Showing ${filteredProducts.length > 0 ? start + 1 : 0}-${Math.min(start + itemsPerPage, filteredProducts.length)} of ${filteredProducts.length} results`);
    }

    function renderShopGrid(products) {
        let html = products.map(item => `
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
            </div>`).join("");
        $("#shop-container").html(html || "<p class='col-span-full text-center py-10'>No items found.</p>");
    }

    // --- PRODUCT DETAIL LOGIC ---
    function setupProductDetails() {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) return;
        
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(res => res.json())
            .then(p => {
                $("#p-title, #p-breadcrumb").text(p.title);
                $("#p-price").text(`$${p.price}`);
                $("#p-desc").text(p.description);
                $("#p-cat").text(p.category);
                $("#p-main-img, #p-detail-img-1, #p-detail-img-2").attr("src", p.image);
                renderStars(p.rating.rate);
                
                // Add to Cart functionality on Product Page
                $(".bg-teal-600:contains('Add To Cart')").on("click", function() {
                    const qty = parseInt($("input[value='1']").val()) || 1;
                    addToCart(p.id, p.title, p.price, p.image, qty);
                });
            });
    }

    // --- CART LOGIC ---
    function addToCart(id, title, price, image, qty = 1) {
        let cart = JSON.parse(localStorage.getItem("myCart")) || [];
        const existing = cart.find(item => item.id == id);
        if (existing) existing.quantity += qty;
        else cart.push({ id, title, price, image, quantity: qty });
        
        localStorage.setItem("myCart", JSON.stringify(cart));
        updateCartCount();
        alert("Added to cart!");
    }

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem("myCart")) || [];
        let total = 0;
        let html = cart.map((item, i) => {
            const sub = item.price * item.quantity;
            total += sub;
            return `
            <div class="grid grid-cols-4 gap-4 items-center py-4 border-b">
                <div class="col-span-1 flex items-center space-x-4">
                    <img src="${item.image}" class="w-16 h-16 object-contain" />
                    <span class="text-sm font-medium hidden md:block">${item.title}</span>
                </div>
                <div class="hidden sm:block text-sm">$${item.price}</div>
                <div class="col-span-1">
                    <input type="number" value="${item.quantity}" min="1" class="update-qty w-12 border rounded" data-index="${i}" />
                </div>
                <div class="col-span-3 sm:col-span-1 flex justify-end items-center space-x-4">
                    <span class="font-semibold">$${sub.toFixed(2)}</span>
                    <button class="delete-item text-red-500" data-index="${i}"><i class="fa-solid fa-trash-alt"></i></button>
                </div>
            </div>`;
        }).join("");

        $("#cart-items-container").html(html || "Your cart is empty");
        $(".text-gray-800:contains('Rs.'), .text-teal-600").text(`$${total.toFixed(2)}`);
    }

    // --- HELPERS & LISTENERS ---
    $(document).on("click", ".add-to-cart-btn", function() {
        const d = $(this).data();
        addToCart(d.id, d.title, d.price, d.img);
    });

    $(document).on("change", ".update-qty", function() {
        let cart = JSON.parse(localStorage.getItem("myCart"));
        cart[$(this).data("index")].quantity = parseInt($(this).val());
        localStorage.setItem("myCart", JSON.stringify(cart));
        renderCart();
    });

    $(document).on("click", ".delete-item", function() {
        let cart = JSON.parse(localStorage.getItem("myCart"));
        cart.splice($(this).data("index"), 1);
        localStorage.setItem("myCart", JSON.stringify(cart));
        renderCart();
    });

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("myCart")) || [];
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        $("#cart-count-badge").text(count); // Make sure your Nav has an element with this ID
    }

    function renderStars(rate) {
        let stars = "";
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fa-solid ${i <= rate ? 'fa-star' : (i - 0.5 <= rate ? 'fa-star-half-stroke' : 'fa-regular fa-star')}"></i>`;
        }
        $(".text-yellow-500").html(stars);
    }

    $("#shop-search, #sort, #category-filter, #show").on("change input", runFiltering);
    $(document).on("click", ".page-btn", function() {
        currentPage = $(this).data("page");
        updateShopUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
