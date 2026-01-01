// Checkout Page JavaScript
(function() {
    'use strict';

    const TAX_RATE = 0.08; // 8% tax

    function renderOrderSummary() {
        const cart = window.oculentCart;
        const orderItemsContainer = document.getElementById('orderItems');

        if (!cart || cart.items.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        // Render order items
        orderItemsContainer.innerHTML = cart.items.map(item => `
            <div class="order-item">
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-details">${item.color} × ${item.quantity}</div>
                </div>
                <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        // Update summary
        const subtotal = cart.getTotal();
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    function generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `OC${timestamp}${random}`;
    }

    function handleCheckout(e) {
        e.preventDefault();

        const cart = window.oculentCart;
        if (!cart || cart.items.length === 0) {
            alert('Your cart is empty!');
            window.location.href = 'cart.html';
            return;
        }

        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            address2: document.getElementById('address2').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            cardNumber: document.getElementById('cardNumber').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value
        };

        // Generate order
        const orderNumber = generateOrderNumber();
        const order = {
            orderNumber: orderNumber,
            date: new Date().toISOString(),
            customer: formData,
            items: cart.items,
            subtotal: cart.getTotal(),
            tax: cart.getTotal() * TAX_RATE,
            total: cart.getTotal() + (cart.getTotal() * TAX_RATE)
        };

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('oculentOrders') || '[]');
        orders.push(order);
        localStorage.setItem('oculentOrders', JSON.stringify(orders));

        // Clear cart
        cart.clearCart();

        // Show success modal
        document.getElementById('orderNumber').textContent = orderNumber;
        document.getElementById('successModal').classList.add('show');
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            renderOrderSummary();

            const checkoutForm = document.getElementById('checkoutForm');
            if (checkoutForm) {
                checkoutForm.addEventListener('submit', handleCheckout);
            }
        });
    } else {
        renderOrderSummary();

        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckout);
        }
    }

})();
