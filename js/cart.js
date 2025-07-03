// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // For services, we need to handle time-based products differently
    if (product.category === 'content') {
        let duration = 1; // Default 1 hour or 2 minutes
        if (product.name === "Livestream") {
            duration = prompt("Berapa jam livestream yang Anda butuhkan?", "1");
        } else if (product.name === "Video Content") {
            duration = prompt("Berapa menit video yang Anda butuhkan? (Kelipatan 2 menit)", "2");
        }
        
        duration = parseInt(duration) || 1;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += duration;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: duration,
                isService: true
            });
        }
    } else {
        // For regular products
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                isService: false
            });
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = 'Rp 0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString('id-ID')} ${item.isService ? (item.name.includes("Livestream") ? 'per jam' : 'per 2 menit') : ''} x ${item.quantity}</p>
                <p>Rp ${itemTotal.toLocaleString('id-ID')}</p>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            removeFromCart(parseInt(this.getAttribute('data-id')));
        });
    });
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    showNotification('Cart cleared');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function initCart() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Cart modal
    const cartModal = document.getElementById('cart-modal');
    const paymentModal = document.getElementById('payment-modal');
    
    document.getElementById('cart-link').addEventListener('click', function(e) {
        e.preventDefault();
        updateCartModal();
        cartModal.style.display = 'block';
    });
    
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            cartModal.style.display = 'none';
            paymentModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });
    
    // Clear cart button
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }
        cartModal.style.display = 'none';
        paymentModal.style.display = 'block';
    });
    
    // Payment options with colored backgrounds and logos
    const paymentMethods = {
        "Gopay": {
            color: "#00AA13",
            image: "gopay.png"
        },
        "Dana": {
            color: "#048BD1",
            image: "dana.png"
        },
        "OVO": {
            color: "#4C2A86",
            image: "ovo.png"
        },
        "Pulsa": {
            color: "#E50914",
            image: "pulsa.png"
        },
        "QRIS": {
            color: "#FFFFFF",
            image: "qris.png",
            textColor: "#333"
        }
    };
    
    const paymentContainer = document.querySelector('.payment-options');
    paymentContainer.innerHTML = '';
    
    Object.entries(paymentMethods).forEach(([method, data]) => {
        const option = document.createElement('div');
        option.className = 'payment-option';
        option.setAttribute('data-method', method);
        option.style.backgroundColor = data.color;
        option.style.color = data.textColor || 'white';
        option.innerHTML = `
            <img src="images/payments/${data.image}" alt="${method}">
            <span>${method}${method === 'QRIS' ? ' (+Rp1,000)' : ''}</span>
        `;
        paymentContainer.appendChild(option);
        
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    
    // Confirm payment
    document.getElementById('confirm-payment').addEventListener('click', function() {
        const selectedMethod = document.querySelector('.payment-option.selected');
        
        if (!selectedMethod) {
            showNotification('Please select a payment method');
            return;
        }
        
        const method = selectedMethod.getAttribute('data-method');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const additionalFee = method === 'QRIS' ? 1000 : 0;
        const grandTotal = total + additionalFee;
        
        // Format WhatsApp message
        let message = `Halo! Saya ingin membeli produk dari Aresite dengan rincian berikut:%0A%0A`;
        
        cart.forEach(item => {
            message += `- ${item.name} (${item.quantity} ${item.isService ? (item.name.includes("Livestream") ? 'jam' : 'menit') : 'unit'}): Rp ${(item.price * item.quantity).toLocaleString('id-ID')}%0A`;
        });
        
        message += `%0ATotal: Rp ${total.toLocaleString('id-ID')}%0A`;
        
        if (additionalFee > 0) {
            message += `Biaya tambahan: Rp ${additionalFee.toLocaleString('id-ID')}%0A`;
        }
        
        message += `Grand Total: Rp ${grandTotal.toLocaleString('id-ID')}%0A%0A`;
        message += `Metode Pembayaran: ${method}%0A%0A`;
        message += `Silakan konfirmasi ketersediaan produk dan detail pembayaran. Terima kasih!`;
        
        // Open WhatsApp
        window.open(`https://wa.me/6282142961010?text=${message}`, '_blank');
        
        // Clear cart after checkout
        clearCart();
        paymentModal.style.display = 'none';
    });
    
    // Initialize cart count
    updateCartCount();
}