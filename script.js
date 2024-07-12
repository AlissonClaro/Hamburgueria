const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart = [];


cartBtn.addEventListener('click', () => {
    updateCartModal()
    cartModal.style.display = 'flex'
})

cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', (event) => {

    let parentButton = event.target.closest('.add-to-cart-btn')

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price')).toFixed(2)

        addToCart(name, price)

        // adicionar no carrinho
    }

})


// Função para adicionar no carrinho.
function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        // se o item ja existe, aumenta apenas a quantidade + 1
        existingItem.qtd += 1;

    } else {

        cart.push({
            name,
            price,
            qtd: 1,
        })
    }

    updateCartModal()

}


// atualizar o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ''
    let total = 0


    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class='font-bold'>${item.name}</p>
                <p>${item.qtd} un.</p>
                <p class='text-gray-600 font-medium mt-2'>R$ ${item.price} cada</p>
            </div>

            <button class='remove-btn' data-name='${item.name}'>
                Remover
            </button>

        </div>
        `
        total += item.price * item.qtd

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString('pt-Br', {
        style: 'currency',
        currency: 'BRL'
    })

    cartCounter.innerHTML = cart.length

}


// função para remover o item do cart

cartItemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
        const name = event.target.getAttribute('data-name')

        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index]

        if (item.qtd > 1) {
            item.qtd -= 1
            updateCartModal()
            return;
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}


addressInput.addEventListener('input', (event) => {
    let inputValue = event.target.value

    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }
})

// finalizar pedido
checkoutBtn.addEventListener('click', (event) => {

    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "Ops! a Hamburgueria está fechada",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #ef4444, #96c90f)",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return
    }

    if (cart.length === 0) return;
    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return
    }

    // Enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.qtd}) Preço: R$ ${item.price} |`
        )
    }).join('')
    
    const message = encodeURIComponent(cartItems)
    //Tel para enviar o pedido
    const phone = '014981914375'

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, '_blank')
    //

    cart.length = 0
    updateCartModal()
})

// Verificar a hora da Hamburgueria aberta e manupilar o card de horario

function checkRestaurantOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22
    //true = restaurante esta aberto.

}


const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen()

if (isOpen) {
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
} else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}