// Global scope: all three functions can access these arrays.
const products = [
  { productName: "Classic Sneakers", price: 59.99, category: "Footwear", inStock: true },
  { productName: "Running Shoes", price: 79.99, category: "Footwear", inStock: false },
  { productName: "Pizza", price: 12.99, category: "Food item", inStock: true },
  { productName: "Orange Juice", price: 4.99, category: "Food item", inStock: true }
];
const cart = [];

const grid = document.getElementById("product-grid");
const filters = document.getElementById("filters");
const statusMessage = document.getElementById("status");
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function addToCart(productName) {
  const product = products.find(item => item.productName === productName);
  if (!product || !product.inStock) {
    statusMessage.textContent = productName + " is unavailable.";
    return;
  }

  cart.push(product);
  document.getElementById("cart-count").textContent = cart.length;
  viewCart();
  statusMessage.textContent = productName + " added. Items in cart: " + cart.length;
}

function viewCart() {
  const list = document.getElementById("cart-items");
  list.replaceChildren();
  let total = 0;
  for (const item of cart) {
    const entry = document.createElement("li");
    entry.textContent = item.productName + " — " + money.format(item.price);
    list.append(entry);
    total += item.price;
  }
  document.getElementById("cart-summary").textContent =
    cart.length ? "Total " + money.format(total) : "Your cart is empty.";
}

function renderProducts(visibleProducts = products) {
  // Clear the previous cards before displaying a new category.
  grid.replaceChildren();
  for (const product of visibleProducts) {
    const card = document.createElement("article");
    const category = document.createElement("p");
    category.className = "category";
    category.textContent = product.category;
    const title = document.createElement("h2");
    title.textContent = product.productName;
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = money.format(product.price);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Add to Cart";
    button.addEventListener("click", () => addToCart(product.productName));
    card.append(category, title, price);
    if (!product.inStock) {
      button.disabled = true;
      const notice = document.createElement("small");
      notice.textContent = "Out of stock";
      card.append(notice);
    }
    card.append(button);
    grid.append(card);
  }
}

function filterByCategory(category) {
  const matches = category === "All" ? products : products.filter(item => item.category === category);
  renderProducts(matches);
  for (const button of filters.children) {
    button.setAttribute("aria-pressed", String(button.textContent === category));
  }
}

const categories = new Set(products.map(product => product.category));
for (const category of ["All", ...categories]) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = category;
  button.addEventListener("click", () => filterByCategory(category));
  filters.append(button);
}

filterByCategory("All");
