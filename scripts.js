/**
 * ==============================
 * Global constants and variables
 ======================*/

/** Order section constants */
const cashierFormElement = query(".form"), 
      formNameElement =  query(".form__name"),
      formCurrencyElement = query(".form__currency--wrapper"),
      itemInputElement = query(".item"),
      priceInputElement = query(".price"),
      quantityInputElement = query(".quantity"),
      formOrderElement = query('.form__order--wrapper'),
      formOrderListElement = query('.form__order--list'),
      formTotalAmountElement = query(".form__total"),
      formGetTotalButtonElement = query(".form__button--total"),
      formAddItemButtonElement = query(".form__button--add-item"),
      formSaveOrderButtonElement = query(".form__button--save-order");

/** Receipt section constants */
const receiptSectionElement = query(".receipt__section"),
      receiptDateElement = query(".receipt__header--date"),
      receiptNameElement = query(".receipt__customer--name"),
      receiptCurrencyElement = query(".receipt__customer--currency"),
      receiptOrderElement = query(".receipt__order--wrapper"),
      receiptTotalAmountElement = query(".receipt__total--amount"),
      receiptNewOrderButtonElement = query(".receipt__button--new-order"),
      receiptDownloadButtonElement = query(".receipt__button--download");

/** Root section constants */
const orderListStorage = [],
      dateObject = new Date(),
      NUMBER_PATTERN = /^[0-9]+$/;
  
/** Order section variables */
let orderItemsObject  = {
    customerName: null,
    currencyValue: null,
    orders: []
},  
formOrderCounter = 2;


/**
 * ==============================
 * Functions section
 ======================*/

/**
 * A utility function to query the DOM
 * @param {string} element - DOM element(s)
 * @returns
 */
function query(element){
    return document.querySelector(element);
}

/** Function adds order list*/
function addItem(){
    orderItemsObject.orders.push(localStorage.getItem("userInfo"))
    // Add list
    formOrderElement.insertAdjacentHTML("beforeend", 
    `
    <div>
        <p class="form__order--title">Order <span>${formOrderCounter++}</span></p>  
        <div class="form__order--list">
            <div class="item--wrapper">
                <input type="text" placeholder="Item" class="item form__field">
                <p class="error-message item--error"></p>
            </div>
            <div class="price--wrapper">
                <input type="text" placeholder="Unit Price" class="price form__field">
                <p class="error-message price--error"></p>
            </div>
            <div class="quantity--wrapper">
                <input type="text" min="1" placeholder="Quantity" class="quantity form__field">
                <p class="error-message quantity--error"></p>
            </div>
            <div class="delete--wrapper">
                <button type="button" class="delete">Remove</button>
                <p class="error-message"></p>
            </div>
        </div>  
    </div>
    `
    );
}

/** Function to remove order list */
function removeItem(){
    formOrderElement.addEventListener("click", event =>{
        if (event.target.classList.contains("delete")){
            event.target.parentElement.parentElement.parentElement.remove();
        }
    })   
}

removeItem();

/** Funtion to get total amount for the user entries */
function getTotal(){
    let customerName = null,
        customer = null,
        itemValue = null,
        item = null,
        priceValue = null,
        price = null,
        quantityValue = null,
        quantity = null;

    cashierFormElement.addEventListener("keyup", event =>{
        switch(true){
            case event.target.classList.contains("form__name"):
                customerName = event.target.value,
                customer = event.target;
                break;
            case event.target.classList.contains("item"):
                itemValue = event.target.value,
                item = event.target;
                break;
            case event.target.classList.contains("price"):
                priceValue = event.target.value,
                price = event.target;
                break;
            case event.target.classList.contains("quantity"):
                quantityValue = event.target.value,
                quantity = event.target;
                break;               
        }
        if (validateInputs( // Validate user entries in object
            customerName,
            customer,
            itemValue,
            item,
            priceValue,
            price,
            quantityValue,
            quantity
        )){storeOrders(customerName, itemValue, priceValue, quantityValue)/** Store user entries in an object as my source of truth*/} else{return false}  
    })
}

getTotal()

/**
 * Function to validate all user entries
 * @param {string} customerName 
 * @param {string} itemValue 
 * @param {string} priceValue 
 * @param {string} quantityValue 
*/
function validateInputs(customerName, customer, itemValue, item, priceValue, price, quantityValue, quantity){
    if (
        validateCustomerName(customerName, customer),
        validateItem(itemValue, item),
        validateUnitPrice(priceValue, price),
        validateQuantity(quantityValue, quantity)
    ){return true} else{return false}
}

/**
 * Funtion to validate customer's name
 * @param {string} customerName 
 * @param {string} customer 
 * @returns 
 */
function validateCustomerName(customerName, customer){
    if (customerName.length === 0){
        addErrorMsg(customer, "Field can't be empty");
        return false;
    } else if (customerName.length < 2){
        addErrorMsg(customer, "Name must be more the 2 characters");
        return false;
    } else{
        removeErrorMsg(customer);
        return true;
    }
}

/**
 * Function to validate order item
 * @param {string} itemValue 
 * @param {string} item 
 * @returns 
*/
function validateItem(itemValue, item){
    if (itemValue.length === 0){
        addErrorMsg(item, "Field can't be empty");
        return false;
    } else{
        removeErrorMsg(item);
        return true;
    }
}

/**
 * Function to validate unit price
 * @param {string} priceValue 
 * @param {string} price 
 * @returns 
*/
function validateUnitPrice(priceValue, price){
    if (priceValue.length === 0){
        addErrorMsg(price, "Field can't be empty");
        return false;
    } else if (!NUMBER_PATTERN.test(priceValue)){
        addErrorMsg(price, "Price can only be a number");
    } else if (Number(priceValue) < 0){
        addErrorMsg(price, "Price can't be less than zero");
        return false;
    } else{
        removeErrorMsg(price);
        return true;
    }
}

/**
 * Function to validate quantity value
 * @param {string} quantityValue 
 * @param {string} quantity 
 * @returns 
*/
function validateQuantity(quantityValue, quantity){
    if (quantityValue.length === 0){
        addErrorMsg(quantity, "Field can't be empty");
        return false;
    } else if (!NUMBER_PATTERN.test(quantityValue)){
        addErrorMsg(quantity, "Quantity can only be a number");
    } else if (Number(quantityValue) < 1){
        addErrorMsg(quantity, "Quantity can't be less than one");
        return false;
    } else{
        removeErrorMsg(quantity);
        return true;
    }
}

/**
 * Function to add error message
 * @param {string} inputElement 
 * @param {string} message 
 */
function addErrorMsg(inputElement, message){
    inputElement.nextElementSibling.innerText = message;
}

/** Functions to remove error message */
function removeErrorMsg(inputElement){
    inputElement.nextElementSibling.innerText = "";
}

/**
 * Function to store users orders
 * @param {string} formOrder - user order list
 */
function storeOrders(customerName, itemValue, priceValue, quantityValue){
    // Store user name, currency and orders in an object 
    orderItemsObject.customerName = customerName;
    orderItemsObject.currencyValue = formCurrencyElement.value;
    let orderList = {
        itemValue: itemValue,
        priceValue: priceValue,
        quantityValue: quantityValue
    }
    orderItemsObject.orders[orderItemsObject.orders.length] = orderList;
    localStorage.setItem("userInfo", JSON.stringify(orderItemsObject));
    calculateAndDisplayTotal(orderItemsObject.orders);
}

/**
 * Function to calculate and display the total
 * @param {string} orderItemsObjectOrders 
*/
function calculateAndDisplayTotal(orderItemsObjectOrders){
    let totalAmount = 0;
    orderItemsObjectOrders.forEach(order =>{
        totalAmount += Number(order.priceValue) * Number(order.quantityValue);
    });
    formTotalAmountElement.innerText = `$${totalAmount} ${orderItemsObject.currencyValue}`;
    localStorage.setItem("totalAmount", totalAmount);
    formSaveOrderButtonElement.classList.remove("disabled");
    formSaveOrderButtonElement.disabled = false;
    orderItemsObject.orders = [];
}

/**
 *  Function to get details
 * @param {object} event - represents the click event
 */
function getDetails(event){
    event.preventDefault();
    // Disable cashier app section buttons
    disableUserEntries(event);
    displayReceiptContent();
}

/** Function to disable order section buttons when receipt is being shown */
function disableUserEntries(event){
    formAddItemButtonElement.disabled = true;
    formAddItemButtonElement.classList.add("disabled");
    formGetTotalButtonElement.disabled = true;
    formGetTotalButtonElement.classList.add("disabled");
    for(let i = 1; i < event.target.children[2].children.length; i++){
        event.target.children[2].children[i].lastElementChild.children[3].children[0].disabled =true;
        event.target.children[2].children[i].lastElementChild.children[3].children[0].classList.add("disabled");
    }
}

/** Function to display receipt  */
function displayReceiptContent(){
    receiptSectionElement.classList.add("receipt__section--show");
    receiptDateElement.innerText = `${dateObject.getFullYear()}-${dateObject.getMonth() +1}-${dateObject.getDate()}`
    scrollToReceipt();
    let userInfo = JSON.parse(localStorage.getItem("userInfo")),
        totalAmount = localStorage.getItem("totalAmount"),
        userName = userInfo.customerName,
        currency = userInfo.currencyValue,
        userOrder = userInfo.orders;

    receiptNameElement.innerText = userName; 
    receiptCurrencyElement.innerText = currency;

    userOrder.forEach(order =>{
        receiptOrderElement.innerHTML += 
        `
        <div class="receipt__order--content">                        
            <div>
                <p>Item</p>
                <p>${order.itemValue}</p>
            </div>
            <div>
                <p>Price</p>
                <p>$${order.priceValue}</p>
            </div>
            <div>
                <p>Quantity</p>
                <p>${order.quantityValue}</p>
            </div>
        </div>
        `;
    })
    receiptTotalAmountElement.innerText = `$${totalAmount}`;
}

/**  Function to scroll to receipt section */
function scrollToReceipt(){
    receiptSectionElement.scrollIntoView({behavior: "smooth"});
}

/** Function to print receipt section */
function printReceiptSection() {
    let printContent = document.querySelector('.receipt-section').innerHTML;
    let originalContent = document.body.innerHTML;
    originalContent = printContent;
    window.print();
    reloadPage();
}

/** Funtion reloads page */
function reloadPage() {
    localStorage.clear();
    location.reload();
}


/**
 * ==============================
 * Event Listeners section
 ======================*/ 
formAddItemButtonElement.addEventListener("click", addItem);
// formGetTotalButtonElement.addEventListener("click", getTotal);
cashierFormElement.addEventListener("submit", getDetails);
receiptDownloadButtonElement.addEventListener("click", printReceiptSection);
receiptNewOrderButtonElement.addEventListener("click", reloadPage);
document.addEventListener("DOMContentLoaded", () =>{
    formSaveOrderButtonElement.disabled = true;
    formSaveOrderButtonElement.classList.add("disabled");
})