const products = [
  { id: 1, name: "iPhone 14 Pro", price: 250000, img: "image_14.jpg", desc: "6.1 inch, A16 Bionic, 128GB" },
  { id: 2, name: "iPhone 13", price: 150000, img: "image_12.jpg", desc: "6.1 inch, A15 Bionic, 128GB" },
  { id: 3, name: "iPhone 12", price: 120000, img: "image_13.jpg", desc: "6.1 inch, A14 Bionic, 64GB" }
];


const grid = document.getElementById("productsGrid");
products.forEach(p => {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}" />
    <h3>${p.name}</h3>
    <p>Rs. ${p.price.toLocaleString()}</p>
    <small style="color:#64748b">${p.desc}</small>
  `;
  card.addEventListener("click", () => openOrderModal(p.id));
  grid.appendChild(card);
});


const orderModal = document.getElementById("orderModal");
const closeModalBtn = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const orderForm = document.getElementById("orderForm");


function openOrderModal(productId){
  const p = products.find(x => x.id === productId);
  if(!p) return;
  modalImage.src = p.img;
  modalTitle.textContent = p.name;
  modalPrice.textContent = "Rs. " + p.price.toLocaleString();
  orderModal.classList.remove("hidden");
  localStorage.setItem("selectedProduct", JSON.stringify(p));
}


closeModalBtn.addEventListener("click", () => orderModal.classList.add("hidden"));
window.addEventListener("click", (e) => {
  if(e.target === orderModal) orderModal.classList.add("hidden");
});

orderForm.addEventListener("submit", function(e){
  e.preventDefault();
  const p = JSON.parse(localStorage.getItem("selectedProduct"));
  if(!p){ alert("Please select a product."); return; }

  const order = {
    id: Date.now(),
    productId: p.id,
    productName: p.name,
    productImg: p.img,
    price: p.price,
    qty: Number(document.getElementById("custQty").value) || 1,
    customer: {
      name: document.getElementById("custName").value.trim(),
      email: document.getElementById("custEmail").value.trim(),
      phone: document.getElementById("custPhone").value.trim(),
      address: document.getElementById("custAddress").value.trim()
    },
    createdAt: new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem("orders")) || [];
  existing.push(order);
  localStorage.setItem("orders", JSON.stringify(existing));

  localStorage.removeItem("selectedProduct");
  orderForm.reset();
  orderModal.classList.add("hidden");
  alert("Thank you! Your order has been saved. Check Admin Panel to view it.");
});