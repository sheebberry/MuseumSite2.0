// cart javascript 


const TAX_RATE = 0.102;
const MEMBER_DISCOUNT_RATE = 0.15;
const SHIPPING_RATE = 25.00;
const VOLUME_DISCOUNT_TIERS = [
    { min: 0, max: 49.99, rate: 0 },
    { min: 50, max: 99.99, rate: 0.05 },
    { min: 100, max: 199.99, rate: 0.10 },
    { min: 200, max: Infinity, rate: 0.15 }
];
const CART_KEY = 'museumCartV1';

let cart = [];
let isMember = false;


function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function writeCart(cartData) {
    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
}


function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    writeCart(cart);
    render();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        cart = [];
        writeCart(cart);
        isMember = false;
        document.getElementById('memberCheckbox').checked = false;
        render();
    }
}


function toggleMember(checkbox) {
    isMember = checkbox.checked;
    render();
}


function formatCurrency(amount) {
    if (amount < 0) {
        return '($' + Math.abs(amount).toFixed(2) + ')';
    }
    return '$' + amount.toFixed(2);
}


function getVolumeDiscountRate(itemTotal) {
    for (let i = 0; i < VOLUME_DISCOUNT_TIERS.length; i++) {
        const tier = VOLUME_DISCOUNT_TIERS[i];
        if (itemTotal >= tier.min && itemTotal <= tier.max) {
            return tier.rate;
        }
    }
    return 0;
}


function render() {
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTbody = document.getElementById('cart-tbody');


    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';

        document.getElementById('item-total').textContent = '$0.00';
        document.getElementById('volume-discount').textContent = '$0.00';
        document.getElementById('member-discount').textContent = '$0.00';
        document.getElementById('shipping').textContent = '$0.00';
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('tax-amount').textContent = '$0.00';
        document.getElementById('invoice-total').textContent = '$0.00';
        return;
    }


    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';

    // total
    let itemTotal = 0;
    for (let i = 0; i < cart.length; i++) {
        itemTotal += cart[i].unitPrice * cart[i].qty;
    }


    const volumeDiscountRate = getVolumeDiscountRate(itemTotal);
    let volumeDiscount = itemTotal * volumeDiscountRate;
    let memberDiscount = 0;
    
    if (isMember) {
        memberDiscount = itemTotal * MEMBER_DISCOUNT_RATE;
    }

    // discount
    let appliedDiscount = 0;
    if (volumeDiscount > 0 && memberDiscount > 0) {
        const choice = confirm('You qualify for both discounts. Only one can be applied.\n\nOK = Member Discount (15%)\nCancel = Volume Discount (' + (volumeDiscountRate * 100) + '%)');
        if (choice) {
            appliedDiscount = memberDiscount;
            volumeDiscount = 0;
        } else {
            appliedDiscount = volumeDiscount;
            memberDiscount = 0;
            isMember = false;
            document.getElementById('memberCheckbox').checked = false;
        }
    } else if (memberDiscount > 0) {
        appliedDiscount = memberDiscount;
    } else if (volumeDiscount > 0) {
        appliedDiscount = volumeDiscount;
    }

    // total
    const subtotal = itemTotal - appliedDiscount + SHIPPING_RATE;
    const taxAmount = subtotal * TAX_RATE;
    const invoiceTotal = subtotal + taxAmount;

    
    let rowsHTML = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const lineTotal = item.unitPrice * item.qty;
        
        rowsHTML += '<tr>';
        rowsHTML += '<td><img src="' + item.image + '" alt="' + item.name + '" class="cart-thumbnail"></td>';
        rowsHTML += '<td>' + item.name + '</td>';
        rowsHTML += '<td class="amount">' + formatCurrency(item.unitPrice) + '</td>';
        rowsHTML += '<td class="amount">' + item.qty + '</td>';
        rowsHTML += '<td class="amount">' + formatCurrency(lineTotal) + '</td>';
        rowsHTML += '<td><button onclick="removeItem(\'' + item.id + '\')" class="remove-btn">Remove</button></td>';
        rowsHTML += '</tr>';
    }
    cartTbody.innerHTML = rowsHTML;

    // summery value
    document.getElementById('item-total').textContent = formatCurrency(itemTotal);
    document.getElementById('volume-discount').textContent = formatCurrency(-volumeDiscount);
    document.getElementById('member-discount').textContent = formatCurrency(-memberDiscount);
    document.getElementById('shipping').textContent = formatCurrency(SHIPPING_RATE);
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax-amount').textContent = formatCurrency(taxAmount);
    document.getElementById('invoice-total').textContent = formatCurrency(invoiceTotal);
}


cart = readCart();
render();