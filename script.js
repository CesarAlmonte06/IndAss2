/* IA#2: Initialize cart from localStorage */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* IA#2: Add item to cart event */
function addToCart(name, price) {
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
        existing.subtotal = existing.quantity * existing.price;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1,
            subtotal: price
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart.");
}

/* IA#2: Display cart contents */
function displayCart() {
    let table = document.getElementById("cartTable");
    if (!table) return;

    table.innerHTML = "";

    cart.forEach(item => {
        let row = `
        <tr>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${item.quantity}</td>
            <td>$${item.subtotal}</td>
        </tr>`;
        table.innerHTML += row;
    });

    calculateTotals();
}

/* IA#2: Discount + tax arithmetic operations */
function calculateTotals() {
    let subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    let discount = subtotal * 0.10;
    let taxed = subtotal * 0.15;
    let total = subtotal - discount + taxed;

    if (document.getElementById("subtotal")) {
        document.getElementById("subtotal").innerText = "$" + subtotal.toFixed(2);
        document.getElementById("discount").innerText = "$" + discount.toFixed(2);
        document.getElementById("tax").innerText = "$" + taxed.toFixed(2);
        document.getElementById("total").innerText = "$" + total.toFixed(2);
    }

    localStorage.setItem("invoiceTotals", JSON.stringify({
        subtotal, discount, taxed, total
    }));
}

/* IA#2: Validate checkout form */
function validateCheckout() {
    let name = document.getElementById("custName").value.trim();
    let email = document.getElementById("custEmail").value.trim();
    let address = document.getElementById("custAddress").value.trim();

    if (name === "" || email === "" || address === "") {
        alert("All fields are required.");
        return false;
    }

    localStorage.setItem("customer", JSON.stringify({ name, email, address }));
    return true;
}

/* IA#2: Load invoice after purchase */
function displayInvoice() {
    let customer = JSON.parse(localStorage.getItem("customer"));
    let totals = JSON.parse(localStorage.getItem("invoiceTotals"));
    let invoiceList = document.getElementById("invoiceItems");

    if (!customer || !totals || !invoiceList) return;

    cart.forEach(item => {
        invoiceList.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${item.subtotal}</td>
            </tr>`;
    });

    document.getElementById("invSubtotal").innerText = "$" + totals.subtotal.toFixed(2);
    document.getElementById("invDiscount").innerText = "$" + totals.discount.toFixed(2);
    document.getElementById("invTax").innerText = "$" + totals.taxed.toFixed(2);
    document.getElementById("invTotal").innerText = "$" + totals.total.toFixed(2);

    document.getElementById("invName").innerText = customer.name;
    document.getElementById("invEmail").innerText = customer.email;
    document.getElementById("invAddress").innerText = customer.address;
}

/* IA#2: Clear cart */
function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    displayCart();
}
