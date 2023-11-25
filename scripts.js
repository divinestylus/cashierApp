/** Global constants section */
const customerField =  query(".customer-name"),
      currencyDropdown = query(".currency"),
      itemField = query(".order"),
      priceField = query(".price"),
      quantityRange = query(".quantity"),
      totalAmount = query(".total-amount"),
      addItemButton = query(".add-item-button"),
      saveOrderButton = query(".save-order-button"),
      cashierForm = query(".form"),
      orderListSection = query('.order-list'),
      getTotalButton = query(".calculate-button"),
      receiptSection = query(".receipt-section"),
      downloadReceiptButton = query(".download-receipt-button"),
      dateElement = query(".date-element")
      orderListStorage = [],
      date = new Date();
  

let orderItem = {
    customerName: null,
    currencyValue: null,
    orders: []
}

/** Functions section */

/**
 * A utility function to query the DOM
 * @param {string} element - DOM element
 * @returns 
 */
function query(element){
    return document.querySelector(element);
}

/**
 * Function adds order list
 */
function addItem(){
    /** Add list */
    orderListSection.insertAdjacentHTML("beforeend", 
    `
    <div>
        <p class="order-title">Order</p>
        <div class="list">
            <div class="item-wrapper">
                <input type="text" placeholder="Item" class="item">
                <p class="error-message item-error"></p>
            </div>
            <div class="price-wrapper">
                <input type="number" placeholder="Unit Price" class="price">
                <p class="error-message unit-price-error"></p>
            </div>
            <div class="quantity-wrapper">
                <input type="number" min="1" placeholder="Quantity" class="quantity">
                <p class="error-message quantity-error"></p>
            </div>
            <div class="delete-wrapper">
                <button type="button" class="delete">Remove</button>
                <p class="error-message"></p>
            </div>
        </div>  
    </div>
    `
    );
    /** Remove list */
    const orderList = document.querySelectorAll(".list");
    removeItem(orderList);
}

/**
 * Function removes order list
 * @param {*} orderList - represents new added order list 
 */
function removeItem(orderList){
    orderList.forEach(order =>{
        order.addEventListener("click", (event) =>{
            if (event.target.classList.contains("delete")){
                event.target.parentElement.parentElement.parentElement.remove();
            }
        })   
    });
}

/**
 * 
 */
function getTotal(){
    const orderList = document.querySelectorAll(".list");
    orderList.forEach(order =>{

        /** Validate user entries in object */
        if (validateInputs(
            customerField.value,
            order.children[0].children[0].value,
            order.children[1].children[0].value,
            order.children[2].children[0].value)){
            /** Store user entries in an object as my source of truth */
            storeOrders(order);
        } else{
            return false;
        }
    })
}

/**
 * Function to validate all user entries
 * @param {*} customerName 
 * @param {*} itemValue 
 * @param {*} priceValue 
 * @param {*} quantityValue 
 */
function validateInputs(customerName, itemValue, priceValue, quantityValue){
    if (
        validateCustomerName(customerName),
        validateUnitPrice(priceValue),
        validateQuantity(quantityValue),
        validateItem(itemValue)
    ){
        return true;
    } else{
        return false;
    }
}

/**
 * Funtion to validate customer's name
 * @param {string} customerName
 * @returns 
 */
function validateCustomerName(customerName){
    const customerNameError = document.querySelectorAll(".customer-name-error");
    if (customerName.length === 0){
        addErrorMsg(customerNameError, "Field can't be empty");
        return false;
    } else if (customerName.length < 2){
        addErrorMsg(customerNameError, "Name must be more the 2 characters");
        return false;
    } else{
        removeErrorMsg(customerNameError);
        return true;
    }
}

function validateItem(itemValue){
    const itemValueError = document.querySelectorAll(".item-error");
    if (itemValue.length === 0){
        addErrorMsg(itemValueError, "Field can't be empty");
        return false;
    } else{
        removeErrorMsg(itemValueError);
        return true;
    }
}

/**
 * Function to validate unit price
 * @param {string} priceValue 
 * @returns 
 */
function validateUnitPrice(priceValue){
    const priceValueError = document.querySelectorAll(".unit-price-error");
    if (priceValue.length === 0){
        addErrorMsg(priceValueError, "Field can't be empty");
        return false;
    } else if (Number(priceValue) < 0){
        addErrorMsg(priceValueError, "Price can't be less than zero");
        return false;
    } else{
        removeErrorMsg(priceValueError);
        return true;
    }
}

/**
 * Function to validate quantity value
 * @param {string} quantityValue 
 * @returns 
 */
function validateQuantity(quantityValue){
    const quantityValueError = document.querySelectorAll(".quantity-error");
    if (quantityValue.length === 0){
        addErrorMsg(quantityValueError, "Field can't be empty");
        return false;
    } else if (Number(quantityValue) < 1){
        addErrorMsg(quantityValueError, "Quantity can't be less than one");
        return false;
    } else{
        removeErrorMsg(quantityValueError);
        return true;
    }
}

/**
 * Function adds error message
 * @param {string} message - error message
 */
function addErrorMsg(input, message){
    input.forEach(input =>{
        input.innerText = message;
    })
}

/**
 * Functions removes error message
 */
function removeErrorMsg(input){
    input.forEach(input =>{
        input.innerText = "";
    })
}

/**
 * PENDING.........................................................
 * @param {*} storage
 * @param {*} orderItem 
 * @returns 
 */
function storeOrders(orders){
    /** Store all user entries in an object */
    let orderList = {
        itemValue: orders.children[0].children[0].value,
        priceValue: orders.children[1].children[0].value,
        quantityValue: orders.children[2].children[0].value
    }
    orderItem.customerName = customerField.value;
    orderItem.currencyValue = currencyDropdown.value;

    if (orderItem.orders.length === 0){
        orderItem.orders.push(orderList);
    } else { 
        orderItem.orders.push(orderList);
    }
    
    console.log(orderItem)
    calculateAndDisplayTotal(orderItem.orders);
}

/**
 * 
 * @param {*} orders 
 */
function calculateAndDisplayTotal(orders){
    let prices = 0,
        quantities = 0;

    orders.forEach(order =>{
        prices += Number(order.priceValue);
        quantities += Number(order.quantityValue);
    });
    totalAmount.innerText = `$${(prices * quantities)} ${orderItem.currencyValue}`;
    return true;
}

/**
 *  Function to get details
 * @param {string} event - represents the click event
 */
function getDetails(event){
    event.preventDefault();
    receiptSection.classList.add("show-receipt-section");
    dateElement.innerText = `${date.getFullYear()}-${date.getMonth() +1}-${date.getDate()}`
    scrollToReceipt();
}

/** 
 * Function to scroll to receipt section
*/
function scrollToReceipt(){
    receiptSection.scrollIntoView({behavior: "smooth"});
}

/**
 * Function to print receipt section
 */
function printReceiptSection() {
    let printContent = document.querySelector('.receipt-section').innerHTML;
    let originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
}


/** Listeners section */  
addItemButton.addEventListener("click", addItem);
getTotalButton.addEventListener("click", getTotal);
cashierForm.addEventListener("submit", getDetails);
downloadReceiptButton.addEventListener("click", printReceiptSection);