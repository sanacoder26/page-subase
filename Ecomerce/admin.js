const ordersContainer = document.getElementById("ordersContainer");
const refreshBtn = document.getElementById("refreshBtn");
const clearAllBtn = document.getElementById("clearAll");

function loadOrders(){
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  ordersContainer.innerHTML = "";

  if(orders.length === 0){
    ordersContainer.innerHTML = `<div class="empty"><h3>No orders found</h3><p>Once a user places an order, it will appear here.</p></div>`;
    return;
  }

  orders.reverse().forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <div class="order-top">
        <img src="${order.productImg}" alt="${order.productName}" />
        <div class="meta">
          <h3>${order.productName} <small class="small">— Rs. ${order.price.toLocaleString()}</small></h3>
          <p class="small">Ordered At: ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Quantity:</strong> ${order.qty}</p>
        </div>
      </div>

      <hr style="margin:10px 0; border:none; border-top:1px solid #eef2f7" />

      <div>
        <p><strong>Name:</strong> ${order.customer.name}</p>
        <p><strong>Email:</strong> ${order.customer.email}</p>
        <p><strong>Phone:</strong> ${order.customer.phone}</p>
        <p><strong>Address:</strong> ${order.customer.address}</p>
      </div>

      <div class="actions">
        <button class="del" data-id="${order.id}">Delete</button>
        <button class="info" onclick="viewJson(${order.id})">View JSON</button>
      </div>
    `;
    ordersContainer.appendChild(card);
  });


  document.querySelectorAll(".del").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.dataset.id);
      deleteOrder(id);
    });
  });
}

function deleteOrder(id){
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders = orders.filter(o => o.id !== id);
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}



clearAllBtn.addEventListener("click", () => {
  if(confirm("Are you sure you want to delete all orders?")) {
    localStorage.removeItem("orders");
    loadOrders();
  }
});


refreshBtn.addEventListener("click", loadOrders);


loadOrders();