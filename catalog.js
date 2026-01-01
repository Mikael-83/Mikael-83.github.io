// Catalog and Cart Management
(function() {
    'use strict';

    // Product data
    const products = {
        'premium-ppf': {
            id: 'premium-ppf',
            name: 'Premium PPF',
            description: 'Self-healing topcoat, crystal clear finish',
            price: 899.99,
            colors: ['blue', 'red', 'yellow']
        },
        'matte-ppf': {
            id: 'matte-ppf',
            name: 'Matte PPF',
            description: 'Satin finish with full protection',
            price: 849.99,
            colors: ['blue', 'red', 'yellow']
        },
        'color-ppf': {
            id: 'color-ppf',
            name: 'Color PPF',
            description: 'Protection meets customization',
            price: 949.99,
            colors: ['blue', 'red', 'yellow']
        }
    };

    // Cart management
    class Cart {
        constructor() {
            this.items = this.loadCart();
            this.updateCartCount();
        }

        loadCart() {
            const savedCart = localStorage.getItem('oculentCart');
            return savedCart ? JSON.parse(savedCart) : [];
        }

        saveCart() {
            localStorage.setItem('oculentCart', JSON.stringify(this.items));
            this.updateCartCount();
        }

        addItem(productId, color) {
            const product = products[productId];
            if (!product) return;

            // Check if item already exists
            const existingItem = this.items.find(item =>
                item.productId === productId && item.color === color
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    productId: productId,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    color: color,
                    quantity: 1
                });
            }

            this.saveCart();
            this.showNotification(`${product.name} (${color}) added to cart!`);
        }

        removeItem(index) {
            this.items.splice(index, 1);
            this.saveCart();
        }

        updateQuantity(index, quantity) {
            if (quantity <= 0) {
                this.removeItem(index);
            } else {
                this.items[index].quantity = quantity;
                this.saveCart();
            }
        }

        getTotal() {
            return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }

        getItemCount() {
            return this.items.reduce((count, item) => count + item.quantity, 0);
        }

        updateCartCount() {
            const countElements = document.querySelectorAll('#cart-count, #cart-badge');
            const count = this.getItemCount();
            countElements.forEach(el => {
                el.textContent = count;
            });
        }

        clearCart() {
            this.items = [];
            this.saveCart();
        }

        showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            // Trigger animation
            setTimeout(() => notification.classList.add('show'), 10);

            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    // Initialize cart
    const cart = new Cart();
    window.oculentCart = cart; // Make cart globally accessible

    // Color selection functionality
    function initColorSelection() {
        const colorButtons = document.querySelectorAll('.color-btn');

        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product');
                const color = this.getAttribute('data-color');

                // Update active state
                const productButtons = document.querySelectorAll(`[data-product="${productId}"]`);
                productButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Update product image
                const image = document.getElementById(`${productId}-image`);
                if (image) {
                    image.src = `${color}.png`;
                }
            });
        });
    }

    // Add to cart functionality
    function initAddToCart() {
        const addToCartButtons = document.querySelectorAll('.btn-add-cart');

        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                const activeColorBtn = document.querySelector(`[data-product="${productId}"].active`);
                const color = activeColorBtn ? activeColorBtn.getAttribute('data-color') : 'blue';

                cart.addItem(productId, color);

                // Visual feedback
                this.textContent = 'Added!';
                this.style.background = 'var(--accent-grey)';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                    this.style.background = '';
                }, 1500);
            });
        });
    }

    // Tooltip functionality
    function initTooltips() {
        const infoIcons = document.querySelectorAll('.info-icon');
        const tooltip = document.getElementById('tooltip');

        infoIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function(e) {
                const text = this.getAttribute('data-tooltip');
                tooltip.textContent = text;
                tooltip.classList.add('show');
                positionTooltip(e, tooltip);
            });

            icon.addEventListener('mousemove', function(e) {
                positionTooltip(e, tooltip);
            });

            icon.addEventListener('mouseleave', function() {
                tooltip.classList.remove('show');
            });

            // Touch support for mobile
            icon.addEventListener('click', function(e) {
                e.stopPropagation();
                const text = this.getAttribute('data-tooltip');
                tooltip.textContent = text;
                tooltip.classList.toggle('show');
                positionTooltip(e, tooltip);
            });
        });

        // Close tooltip when clicking elsewhere
        document.addEventListener('click', function() {
            tooltip.classList.remove('show');
        });
    }

    function positionTooltip(e, tooltip) {
        const tooltipRect = tooltip.getBoundingClientRect();
        const padding = 10;

        let left = e.pageX + padding;
        let top = e.pageY + padding;

        // Prevent tooltip from going off screen
        if (left + tooltipRect.width > window.innerWidth) {
            left = e.pageX - tooltipRect.width - padding;
        }

        if (top + tooltipRect.height > window.innerHeight + window.pageYOffset) {
            top = e.pageY - tooltipRect.height - padding;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initColorSelection();
            initAddToCart();
            initTooltips();
        });
    } else {
        initColorSelection();
        initAddToCart();
        initTooltips();
    }

})();
