// Cart Page JavaScript
(function() {
    'use strict';

    const TAX_RATE = 0.08; // 8% tax

    function renderCart() {
        const cart = window.oculentCart;
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartContent = document.querySelector('.cart-content');

        if (!cart || cart.items.length === 0) {
            if (cartContent) cartContent.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }

        if (cartContent) cartContent.style.display = 'grid';
        if (emptyCart) emptyCart.style.display = 'none';

        // Render cart items
        cartItemsContainer.innerHTML = cart.items.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-top">
                    <div class="cart-item-image">
                        <img src="${item.color}.png" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-color">Color: ${item.color}</p>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="btn-remove" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `).join('');

        // Update summary
        updateSummary();
    }

    function updateSummary() {
        const cart = window.oculentCart;
        if (!cart) return;

        const subtotal = cart.getTotal();
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    // Make functions globally accessible
    window.updateQuantity = function(index, newQuantity) {
        const cart = window.oculentCart;
        if (!cart) return;

        cart.updateQuantity(index, newQuantity);
        renderCart();
    };

    window.removeItem = function(index) {
        const cart = window.oculentCart;
        if (!cart) return;

        if (confirm('Remove this item from cart?')) {
            cart.removeItem(index);
            renderCart();
        }
    };

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = window.oculentCart;
            if (!cart || cart.items.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Initial render
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCart);
    } else {
        renderCart();
    }

})();
