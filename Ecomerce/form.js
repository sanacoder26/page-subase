const orderForm = document.getElementById('orderForm');

orderForm.addEventListener('submit', function(e){
    e.preventDefault();

    const order = {
        id: Date.now(),
        name: document.getElementById('custName').value.trim(),
        phone: document.getElementById('custPhone').value.trim(),
        address: document.getElementById('custAddress').value.trim(),
        createdAt: new Date().toISOString()
    };
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    orderForm.reset();
    alert('Thank you! Your order has been saved.');
});