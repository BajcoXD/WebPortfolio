const apiUrl = "https://fakestoreapi.com/products/category/electronics";
const productsContainer = document.querySelector(".pro-container");

// Create navigation buttons
const nextBtn = document.createElement("button");
const prevBtn = document.createElement("button");
nextBtn.textContent = "Next";
prevBtn.textContent = "Previous";

// Apply button styling
nextBtn.className = "pagination-btn";
prevBtn.className = "pagination-btn";

let products = [];
let filteredProducts = [];
let currentPage = 0;
const itemsPerPage = 8;

const categories = [
  { name: "All", filter: () => true },
  {
    name: "TVs",
    filter: (product) => product.title.toLowerCase().includes("tv"),
  },
  {
    name: "Monitors",
    filter: (product) => product.title.toLowerCase().includes("monitor"),
  },
  {
    name: "SSDs",
    filter: (product) => product.title.toLowerCase().includes("ssd"),
  },
];

// Cart functionality
let cart = [];

// Fetch products from API
async function fetchProducts() {
  try {
    console.log("Fetching products...");
    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error("Failed to fetch data");

    products = await response.json();
    console.log("Products fetched:", products);

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("No products found");
    }

    // Ensure at least 24 products (3 pages x 8 products)
    if (products.length < 24) {
      console.warn("Not enough products for 3 pages. Duplicating products...");
      while (products.length < 24) {
        products = products.concat(products);
      }
      products = products.slice(0, 24);
    }

    filteredProducts = products;
    displayProducts();
    setupPagination();
    setupCategoryButtons();
  } catch (error) {
    console.error("Error:", error.message);
    productsContainer.innerHTML = `<p style="color: red;">Error loading products.</p>`;
  }
}

// Display products
function displayProducts() {
  productsContainer.innerHTML = "";

  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const pageProducts = filteredProducts.slice(start, end);

  pageProducts.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "pro";
    productDiv.dataset.id = product.id;

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}" style="width: auto; height: 400px;" />
      <div class="pro-text">
        <p>${product.title}</p>
        <span>$${product.price}</span>
      </div>
      <button class="add-to-cart-btn">Add to Cart</button>
    `;

    productsContainer.appendChild(productDiv);
  });

  updateButtons();
}

// Set up pagination buttons
function setupPagination() {
  const section = document.querySelector("#product1");

  prevBtn.onclick = () => {
    if (currentPage > 0) {
      currentPage--;
      displayProducts();
    }
  };

  nextBtn.onclick = () => {
    if ((currentPage + 1) * itemsPerPage < filteredProducts.length) {
      currentPage++;
      displayProducts();
    }
  };

  section.appendChild(prevBtn);
  section.appendChild(nextBtn);
}

// Update button visibility
function updateButtons() {
  prevBtn.style.display = currentPage === 0 ? "none" : "inline-block";
  nextBtn.style.display =
    (currentPage + 1) * itemsPerPage >= filteredProducts.length
      ? "none"
      : "inline-block";
}

// Add category buttons
function setupCategoryButtons() {
  const categoryContainer = document.createElement("div");
  categoryContainer.className = "category-buttons";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.className = "category-btn";
    button.onclick = () => filterProducts(category.filter);
    categoryContainer.appendChild(button);
  });

  const section = document.querySelector("#product1");
  section.insertBefore(categoryContainer, productsContainer);
}

// Filter products by category
function filterProducts(filterFunction) {
  filteredProducts = products.filter(filterFunction);
  currentPage = 0;
  displayProducts();
}

// Cart functionality
function addToCart(product) {
  product.id = Number(product.id); // Ensure it's a number
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartPopup();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartPopup();
}

function updateCartPopup() {
  const cartItemsContainer = document.querySelector(".cart-items");
  cartItemsContainer.innerHTML = "";

  let totalPrice = 0; // Initialize total price

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const itemTotal = item.price * item.quantity; // Calculate item total
    totalPrice += itemTotal; // Add to total price

    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="cart-item-details">
          <p>${item.title}</p>
          <span>$${item.price} x ${item.quantity}</span>
        </div>
        <div class="cart-item-controls">
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
          <button onclick="changeQuantity(${item.id}, -1)">-</button>
          <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `;

    cartItemsContainer.appendChild(cartItem);
  });

  // Display total price
  const cartFooter = document.querySelector(".cart-footer");
  cartFooter.innerHTML = `
      <h3>Total: $${totalPrice.toFixed(2)}</h3>
      <button id="checkout-btn">Checkout</button>
    `;
}

// Attach event listeners for dynamically created cart buttons
function attachCartEventListeners() {
  document.querySelectorAll(".increase-qty").forEach((btn) => {
    btn.addEventListener("click", () =>
      changeQuantity(Number(btn.dataset.id), 1)
    );
  });

  document.querySelectorAll(".decrease-qty").forEach((btn) => {
    btn.addEventListener("click", () =>
      changeQuantity(Number(btn.dataset.id), -1)
    );
  });

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
  });
}

function changeQuantity(productId, delta) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartPopup();
    }
  }
}

function toggleCartPopup() {
  document.getElementById("cart-popup").classList.toggle("open");
}

// Event listeners
document.querySelector("#navbar .cart").addEventListener("click", (event) => {
  event.preventDefault();
  toggleCartPopup();
});

document
  .getElementById("close-cart-btn")
  .addEventListener("click", toggleCartPopup);

// Fetch products when the page loads
fetchProducts();

// Delegate Add to Cart functionality
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart-btn")) {
    const productDiv = event.target.closest(".pro");
    const product = {
      id: Number(productDiv.dataset.id),
      title: productDiv.querySelector("p").textContent,
      price: parseFloat(
        productDiv.querySelector("span").textContent.replace("$", "")
      ),
      image: productDiv.querySelector("img").src,
    };
    addToCart(product);
  }
});
