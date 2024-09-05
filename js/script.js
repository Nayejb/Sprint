document.addEventListener('DOMContentLoaded', () => {
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total'); // Elemento para mostrar el total
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para actualizar el contador del carrito
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Función para actualizar la lista de productos en el carrito y el total
    function updateCartItems() {
        if (cartItemsList) {
            cartItemsList.innerHTML = '';  // Limpiar la lista de productos
            let total = 0;  // Inicializa el total en 0
            
            cart.forEach(item => {
                // Asegúrate de que el precio sea tratado como un número
                const price = parseFloat(item.price);  // Convertir el precio a número

                // Crea un nuevo elemento <li> para cada producto
                const li = document.createElement('li');
                li.textContent = `${item.name} - $${price.toFixed(2)}`;  // Mostrar el precio con dos decimales
                cartItemsList.appendChild(li);
                
                // Suma el precio del producto al total
                total += price;  // Sumar el precio convertido a número
            });
            
            // Actualiza el total en la interfaz
            cartTotal.textContent = total.toFixed(2);  // Mostrar el total con dos decimales
        }
    }

    // Maneja el evento de clic en el botón de "Vaciar Carrito"
    document.getElementById('empty-cart-btn')?.addEventListener('click', () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartItems();
    });

    // Actualiza el carrito en la página de carrito al cargar
    if (document.getElementById('cart-items')) {
        updateCartCount();
        updateCartItems();
    }

    // Maneja el evento de clic en el botón de "Proceder al Pago"
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        window.location.href = 'https://example-payment-api.com/checkout';
    });

    // Maneja el evento de clic en los botones "Añadir al Carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            cart.push({ name, price });
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartItems();  // Asegúrate de actualizar los items y el total después de añadir al carrito
        });
    });
});


paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: document.getElementById('cart-total').textContent
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Transacción completada por ' + details.payer.name.given_name);
            // Aquí puedes agregar código para limpiar el carrito y redirigir al usuario
            localStorage.removeItem('cart'); // Vaciar el carrito en el localStorage
            window.location.href = 'productos.html'; // Redirige a la página de productos
        });
    }
}).render('#paypal-button-container');
