$(document).ready(function(){
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!! --- Test Customer Objects & Array --- !!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!! --- Test Customer Objects & Array --- !!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    
        // --- Test Items ---
    
    var item1 = new itemData("item-1","sku-1","Snickers","Snickers Bar 3oz","$2.79")
    var item2 = new itemData("item-2","sku-2","Milky Way","Milky Way Bar 3oz","$2.99")
    var item3 = new itemData("item-3","sku-3","M&Ms","M&Ms 4oz","$2.75")
    
    var TestItemArray = [item1, item2, item3];

        // --- Test Order Items ---
    
    var orderItems1 = new orderItems("OrderItem1","3",item1);
    var orderItems2 = new orderItems("OrderItem2","1",item2);
    var orderItems3 = new orderItems("OrderItem3","2",item3);
    var orderItems4 = new orderItems("OrderItem4","3",item3);

    
        // --- Test Orders ---
    
    var order1 = new orderData("order1","open",[orderItems1, orderItems2]);
    var order2 = new orderData("order2","closed",[orderItems3]);
    var order3 = new orderData("order3","open",[orderItems2, orderItems3]);
    var order4 = new orderData("order4","closed",[orderItems1,orderItems2,orderItems3,orderItems4])
    
        // --- Test Customers ---
    
    var Customer1 = new customerData("1","Tim Tom","OPEN","Now","Then",[order1]);
    var Customer2 = new customerData("2","John Jenkins","CLOSED","Now","BEFORE",[order2]);
    var Customer3 = new customerData("3","Walter Write","OPEN","Now","Then",[order3, order2]);
    var Customer4 = new customerData("4","Benny Bin","CLOSED","12/12/12","11/11/11",[order2,order1,order3,order2,order1,order4]);
    
        // --- Test Array ---
    
    var testReturnObject = [Customer1, Customer2, Customer3, Customer4];
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!! --- Object Constructors --- !!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    
    
    function customerData(id,name,status,dateCreated,dateModified,orders){
        
        this.id = id;
        this.name = name;
        this.status = status;
        this.dateCreated = dateCreated;
        this.dateModified = dateModified;
        this.orders = orders;
        
    }
    
    function orderData(id,status,orderItems){
        
        this.id = id;
        this.status = status;
        this.orderItems = orderItems;
        
    }
    
    function orderItems(id,quantity,item) {
        
        this.id = id;
        this.quantity = quantity;
        this.item = item;
        
    }
    
    function itemData(id,sku,name,description,price){
        
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.price = price;
        
    }
    
    
    
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!! --- INITIALIZE --- !!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    
    var shouldAJAX = false; // Change to allow or disallow ajax on load, for debugging or UI/UX refinement
    
    if ($("body.helper").length == 0){
        
    fetchLoadCustomerJSON(); // Fetch Init Custome Data On Load
    fetchItemJSON(); // Fetch Init Items On Load
        
    }
    
    var returnObject = testReturnObject; // Change to Customers JSON reply
    var returnItemList = TestItemArray // Change to Items JSON reply
    
    $(".command-box").hide(); // Hide Swap Divs for ACTION Block on left
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!! --- Fetch JSON ARRAY --- !!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    
    function fetchLoadCustomerJSON(previousCustomer){
        
        if ( shouldAJAX == false ) {
            
			console.log("AJAX Disabled, loading test data.")
			returnObject = testReturnObject
			returnItemList = TestItemArray
			ManageOnLoad(returnObject, previousCustomer)
            
        }
        
        var xmlhttp = new XMLHttpRequest();
        var url = "http://API/customers/";

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                var response = JSON.parse(this.responseText);
                ManageOnLoad(response.content, previousCustomer);
                returnObject = response.content;
                console.log("Data Loaded, JSON Below:")
                console.log(response.content);
                
            }
            
        };
        
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.send();
        
    }
    
    function fetchItemJSON(){
        
        if ( shouldAJAX == false ) {
            
            return;
            
        }
        
        var xmlhttp = new XMLHttpRequest();
        var url = "http://API/items/";

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                var response = JSON.parse(this.responseText);
                LoadItemList(response.content);
            }
            
        };
        
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.send();
        
    }
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!! --- ITEM LIST CLICK CODE ---!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
        
    // UX Easy Item ID Switching of Items in ItemList Popup

    
    $("#popup-itemList").on("click", '.itemIdSelect', function(e){
        
        var idPull = $(this).attr('id');
        $(".itemIdentity").val(idPull);
        console.log("Selected Item ID is: " + idPull);
        
    });
    
    // UX Easy Item ID Switching of Items in Edit order
    
    $("#OrderItems-ItemList").on("click", 'li', function(e){
        
        if (e.target !== this) {
            
            return;
            
        }
        
        console.log("CLICKED");
        
        var expand = $(this).children('ul');
        
        var itemID = $(this).find(".Item-id").text().split(" ")
        
        $(".itemIdentity").val(itemID[2])
        
        if (  expand.css( "max-height" ) == '0px' ){
            expand.css("max-height","350px");
        } else {
            expand.css("max-height","0px" );
        }
        
    });
    
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!! --- EDIT ORDER Item Functions ---!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!- ITEM API HANDLING - !!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    
    $("#button-add-item").click(function(e){
        
        e.preventDefault();
        
        var xmlhttp = new XMLHttpRequest();
        var itemID = $(".itemIdentity").val();
        var itemQty = $(".itemQty").val();
        if (itemQty.match(/^(1|2|3|4|5)$/)) {
            
            console.log("Quantity OK. Init Item Command...");
            
            if (selectedCustomer == null || selectedOrder == null ) {
                
                console.log("No order loaded, can't initiate item command.")
                alert("Order has not been loaded.")
                return;
                
            }
            
        }
        
        else {
            
            alert("Please enter a numberal of 1-5");
            return;
            
        }
            
        var url = "http://API/customers/" + selectedCustomer.id+"/orders/items/" + itemID + "?qty=" + itemQty;

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                fetchLoadCustomerJSON(selectedCustomer);
                
            }
            if (this.readyState == 4 && this.status == 204) {
                
                alert("This order is already closed or cancelled.");
                
            }
            if (this.readyState == 4 && this.status == 500) {
                
                alert("This item does not exist for adding.");
                
            }
            
        };
        
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send();
        
    });
    
    $("#button-remove-item").click(function(e){
        
        e.preventDefault();
        
        var xmlhttp = new XMLHttpRequest();
        var itemID = $(".itemIdentity").val();
        var itemQty = $(".itemQty").val();
        if (itemQty.match(/^(1|2|3|4|5)$/)) {
            
            console.log("Quantity OK. Init Item Command...");
            
            if (selectedCustomer == null || selectedOrder == null) {
                
                console.log("No order loaded, can't initiate item command.")
                alert("Order has not been loaded.")
                return;
                
            }
            
        }
        
        else {
            
            alert("Please enter a numberal of 1-5");
            return;
            
        }
            
        var url = "http://API/customers/" + selectedCustomer.id+"/orders/items/" + itemID + "?qty=" + itemQty;

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                fetchLoadCustomerJSON(selectedCustomer);
                
            }
            if (this.readyState == 4 && this.status == 204) {
                
                alert("This order is already closed or cancelled.");
                
            }
            if (this.readyState == 4 && this.status == 500) {
                
                alert("This item does not exist for removal.");
                
            }
            
        };
        
        xmlhttp.open("DELETE", url, true);
        xmlhttp.send();
        
    });
    
    // Quick Delete Item Click
    
    $("#orderItemsBox").on("click", "li", function(){
        
        console.log($(this).attr("id"));
                
        var xmlhttp = new XMLHttpRequest();
        var itemID = $(this).attr("id");
        var itemQty = 99999;
            
        var url = "http://API/customers/" + selectedCustomer.id+"/orders/items/" + itemID + "?qty=" + itemQty;

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                fetchLoadCustomerJSON(selectedCustomer);
                
            }
            if (this.readyState == 4 && this.status == 204) {
                
                alert("This order is already closed or cancelled.");
                
            }
            if (this.readyState == 4 && this.status == 500) {
                
                alert("This item does not exist for removal.");
                
            }
            
        };
        
        xmlhttp.open("DELETE", url, true);
        xmlhttp.send();
        
    });
    
    function LoadItemList(itemList){
        
        for (var i = 0; i < itemList.length;i++) {
        
            var list = document.getElementById("popup-itemList");
            var opt = document.createElement('li');
            var data = document.createTextNode(itemList[i].name);
            opt.setAttribute("id",itemList[i].id);
            opt.setAttribute("class","itemIdSelect");
            opt.appendChild(data);
            list.appendChild(opt);
        
        }
        
        console.log("Item List Loaded");

        
    }
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!! --- CUSTOMER MANAGEMENT --- !!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //  
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    
        // --- Load/Refresh Customer List Function ---
    
    function ManageOnLoad(content, previousCustomer){
        
        console.log("Customer Management Loaded");
        
        // Clear Customer List prior to Loading
        
        var list = document.getElementById("cListAlt");
        clearOptions(list);
        
        // Load Customer List
        
        for (var i = 0; i < content.length; i++){
            
            var list = document.getElementById("cListAlt");
            var opt = document.createElement('li');
            opt.appendChild(document.createTextNode(content[i].name));
            opt.setAttribute("id", content[i].name);
            opt.setAttribute("class", "CustomerOption");
            list.appendChild(opt);
                    
        }
        
        sortDivDataAndIdList($("#cListAlt"));
                
        if (typeof previousCustomer !== 'undefined'){
                        
            clearOrderDisplay();
            
            var current = previousCustomer.name;
            selected = content.filter(function ( obj ){

               return obj.name == current; 

            });
            
            selectedCustomer = selected[0];
            
            selectedOrder = selectedCustomer.orders[selectedCustomer.orders.length-1]
            
            console.log("Refreshing " + selectedCustomer.name);
            
            LoadCustomer(selectedCustomer);
            
        }
        
    }
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !--- Customer Selection and Order Selection Code ---! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    
    var selectedCustomer = null;
    
    // Customer Click Filter Code -- Filter to Selected Customer & Refresh
    
    $("#cListAlt").on('click','.CustomerOption', function(){
        
        clearOrderDisplay();
        
        var current = $(this);
        selected = returnObject.filter(function ( obj ){
            
           return obj.name == current.attr("id"); 
            
        });
        
        selectedCustomer = selected[0];
        
        selectedOrder = selectedCustomer.orders[0]
        
        console.log("Selected Customer is: " + selectedCustomer.name);
        
        LoadCustomer(selectedCustomer);
        
    });
    
    // Order Click Filter Code -- Filter to Selected Order & Refresh
    
    var selectedOrder = null;
    
    $("#orderList").on('click','.CustomerOrderOption', function(){
        
        var current = $(this);
        selected = selectedCustomer.orders.filter(function ( obj ){
            
           return obj.id == current.attr("id"); 
            
        });
        
        selectedOrder = selected[0];
        
        console.log("Selected Order ID is: " + selectedOrder.id);
        
        LoadOrder(selectedOrder);
        
        LoadOrderItems(selectedOrder.orderItems);
        
        
    });
    
    
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!! --- CUSTOMER/ORDER MANAGEMNT --- !!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //  
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //  
    
    function LoadCustomer(customer){ // Load Customer Object Data into Display
        
        // Base Info Loading
        
        $(".data-info-activeCustomer span").text(selectedCustomer.name);
        $(".data-info-customerID span").text(selectedCustomer.id);
        $(".data-info-customerStatus span").text(selectedCustomer.status);
        $(".data-info-customerCreated span").text(selectedCustomer.dateCreated);
        $(".data-info-customerModified span").text(selectedCustomer.dateModified);
        
        // Order List Loading
        
        // -- Remove existing options from orders
        
        clearOptions(document.getElementById("orderList"));
        
        // -- Replace with active customer's orders if available
        
        if (typeof customer.orders !== 'undefined' && customer.orders.length > 0) {
            
            for (var i = 0; i < customer.orders.length; i++) {

                var list = document.getElementById("orderList");
                var opt = document.createElement('li');
                opt.appendChild(document.createTextNode(customer.orders[i].id));
                opt.setAttribute("id", customer.orders[i].id);
                opt.setAttribute("class", "CustomerOrderOption");
                list.appendChild(opt);

            }
            
                // Default Load Most Recent Order
                LoadOrder(selectedCustomer.orders[selectedCustomer.orders.length-1]);
            
                // Default Load Recent OrderItems
                LoadOrderItems(selectedCustomer.orders[selectedCustomer.orders.length-1].orderItems);            

            }
        
        else { // Clear and inform of absense of orders

            clearOptions(document.getElementById("orderItemsBox"));
            alert(customer.name + " has no orders.");
            
        }
        

        
    }
    
    // Load Order Function -- Loads Order DATA to UI
    
    function LoadOrder(order) {
        
        $(".data-info-orderID span").text(order.id);
        $(".data-info-orderStatus span").text(order.status);
        $(".data-info-orderItems span").text(order.orderItems);
        
        clearOptions(document.getElementById("orderItemsBox"));

        
        for (var i=0; i < order.orderItems.length; i++) {
            
            var itemsBox = document.getElementById("orderItemsBox");
            var line = document.createElement('li');
           
            line.setAttribute("id", order.orderItems[i].item.id);        
            line.appendChild(document.createTextNode(order.orderItems[i].item.name + " x" + order.orderItems[i].quantity + " @ " + order.orderItems[i].item.price + "ea."));
            
            itemsBox.appendChild(line);
            sortLiByAbc($(itemsBox), "content");
            
        }
        
    }
    
    // Load Order Items Function 
    
    function LoadOrderItems(orderItems) { // Loads OrderItems DATA to UI
        
        // Clear Existing Items
        
        clearOptions(document.getElementById("OrderItems-ItemList"))
        
        for ( var i = 0; i < orderItems.length; i++) {
                        
            // Init Item Vars
            
            console.log("Add item to list..")
            
            currentItem = orderItems[i].item;
            itemList = $("#OrderItems-ItemList");
            newItem = document.createElement("li")
            newItem.setAttribute("id", currentItem.name);
            
            // Input Data into inital li element
            
            itemName = document.createTextNode(currentItem.name + " (x" + orderItems[i].quantity + ")");
            newItem.appendChild(itemName);
            
            // Create internal ul element
            
            var inList = document.createElement('ul');
            
            // Init li(s) for internal ul
            
            liDataList = ["id", "sku","name","description","price"];
            
            for (var z=0; z < 5; z++) {
                                
                var subLi = document.createElement('li');
                subLi.setAttribute("Class", "Item-" + liDataList[z]);
                
                var subLiContent = document.createTextNode(liDataList[z] + " : "+ currentItem[liDataList[z]] );
                
                subLi.appendChild(subLiContent);
                
                inList.appendChild(subLi);
                
            }
            
            // Add internal ul to new li item
            
            newItem.appendChild(inList);
    
            
            // Add finalized item into list
            
            itemList.append(newItem);
                        
        }
        
        // Sort list after creation
        
        sortLiByAbc($("#OrderItems-ItemList"), "id");
        
    }
    
    function clearOrderDisplay(){
        
        $(".data-info-orderID span").text("...");
        $(".data-info-orderStatus span").text("...");
        $(".data-info-orderItems span").text("...");

    }
    
    function clearOptions(list) {
        
        while (list.firstChild) {
            
            list.removeChild(list.firstChild);
            
        }

    }
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!! --- API ORDER HANDLING --- !!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //  
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    
    // NEW ORDER 
    
    $("#button-newOrder").click(function(e){
        
        e.preventDefault();
        
        if ( !selectedCustomer ) {
            
            alert("Select a customer first.")
            return;
            
        }
        
        var xmlhttp = new XMLHttpRequest();
        var url = "http://API/customers/" + selectedCustomer.id+"/orders";

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {
                
                alert("New Order Created");
                fetchLoadCustomerJSON(selectedCustomer);
                
            }
            if (this.readyState == 4 && this.status == 400) {
                
                alert("Open order already exists.");
            }
            
        };
        
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(null);
        
        
    });
    
    // CLOSE ORDER
    
    $("#button-close-order").click(function(e){
        
        e.preventDefault();
        
        if ( !selectedCustomer ) {
            
            alert("Select a customer first.")
            return;
            
        }
        
        if ( !selectedOrder) {
            
            alert("Select or create an order first.")
            return;
            
        }
        
        if (confirm("Are you sure you want to close order#" + selectedOrder.id + "?")) {
            
            var xmlhttp = new XMLHttpRequest();
            var url = "http://API/customers/" + selectedCustomer.id+"/orders";

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    
                    
                    alert("Order #" + selectedOrder.id + " Closed");
                    fetchLoadCustomerJSON(selectedCustomer);
                    
                }
                
                if (this.readyState == 4 && this.status == 204){
                        
                    alert("This order is already closed or cancelled.")
                        
                }

            };

            xmlhttp.open("PUT", url, true);
            xmlhttp.setRequestHeader("Accept", "application/json");
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send();
                        
        }
        
        
        else {
            
            return;
            
        }
        
        
    });
    
    // CANCEL ORDER

    $("#button-cancel-order").click(function(e){
        
        e.preventDefault();
        
        if ( !selectedCustomer ) {
            
            alert("Select a customer and order first.")
            return;
            
        }
        
        if ( !selectedOrder) {
            
            alert("Select or create an order first.")
            return;
            
        }
        
        if (confirm("Are you sure you want to cancel order#" + selectedOrder.id + "?")) {
            
            var xmlhttp = new XMLHttpRequest();
            var url = "http://API/customers/" + selectedCustomer.id+"/orders";

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    alert("Order #" + selectedOrder.id + " Cancelled");
                    fetchLoadCustomerJSON(selectedCustomer);
                }
                
                if (this.readyState == 4 && this.status == 204){
                        
                    alert("This order is already cancelled or closed.")
                        
                }

            };

            xmlhttp.open("DELETE", url, true);
            xmlhttp.send(null);
                        
        }
        
        
        else {
            
            return;
            
        }
        
        
    });
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!! --- ADD CUSTOMER API HANDLING --- !!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //      

    $("#button-add-customer").click(function(){
        
        if ( $("#add-customer-name").val().length < 6) {
            
            alert("Please use a customer name of atleast 6 characters.")
            return;
            
        }
        
        if (confirm("Are you sure you want to add customer " + $("#add-customer-name").val() + "?")) {
            
            /* Add Customer BELOW */

            var customer = { "name": $("#add-customer-name").val()};
            var xmlhttp = new XMLHttpRequest();
            var url = "http://API/customers/";

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 201) {

                    alert("Customer " + $("#add-customer-name").val() + " has been added.");                   
                    
                    fetchLoadCustomerJSON();
    
                }

            };

            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Accept", "application/json");
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify(customer));

            
            /* Add Customer Above */
            
                        
        }
        
        
        else {
            
            return;
            
        }
        
    });
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!    UI - AESTHETICS - UX   !!!!!!!!!!!!!! //          
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //  
        
    // Command Block Switch Code //
    
    $("#command-addCustomer").click(function(){ 
        
        HideIntro();
        ShowCommandBox("#add-customer-block");
        
        
    });
        
    $("#command-manageCustomers").click(function(){
        
        HideIntro();
        ShowCommandBox("#manage-customers-block");
 
        
    });
    
    //Command Selection Functions
    
    function HideIntro() {
        
        $(".command-intro").hide();
        
    }
    
    function ShowCommandBox(commandBox){
        
        $(".command-box").hide();
        $(commandBox).show();
        
    }
    
    // UI&UX CODE BELOW
    
    // Show Customer
    
    $("#show-customers").click(function(e){
        
        e.preventDefault();
        $(".customer-list-box").css('opacity', '1');

        
    })
    
    // Popup Handling
    
    $(".popup").draggable({
        handle: ".popup-header",
        containment: "body"
    });
    
    $(".popup-close").click(function(){
    
        $(this).closest(".popup").hide("scale", "ease", "fast");
        
    });
    
    $("#button-edit-order").click(function(e){
        
        e.preventDefault();
        $("#edit-order-popup").show("scale", "ease", "fast");
        
    });
    
    $("#button-select-item").click(function(e){
        
        e.preventDefault();
        $("#item-list-popup").show("scale", "ease", "fast");
        
    });
    
    // Sort List Functions
    
    // This function is only for the customers list, it affects id in a way that will interfere with other lists and their functions
        
    function sortDivDataAndIdList(ul, desc) {
        
        var list = ul;
        
        var items = list.find("li");
        var content = [];
        
        for (var i=0; i < items.length; i++) {
    
            content.push(items[i].innerHTML);
            
        }
        
        content.sort();
                    
        
        if (desc) { // Reverse just in case needed on desc true
            
            content.reverse();
            
        }
        
        for (var z=0; z < items.length; z++) {
            
            items[z].innerHTML = content[z];
            items[z].setAttribute("id", content[z]);
            
        }
        
    }
    
    // This function is for existig lists and will sort li's without harming id tags, it will replace id tags with the same id tags
    
    // include attribute to sortby
    
    function sortLiByAbc(ul,sortingAttr) {
        
        function li(id,content){

            this.id = id;
            this.content = content;

        }
        
        var list = ul;
        
        var items = list.children("li");
        var lines = [];
        var lines = [];
        
        for (var i=0; i < items.length; i++) {
            
            var line = new li(items[i].getAttribute("id"),items[i].innerHTML);
            lines.push(line);
            
        }
                
        lines.sort(function(a,b){
            
            if (a[sortingAttr] < b[sortingAttr] ) {
                
                return -1;
                
            }
            
            if (a[sortingAttr] > b[sortingAttr] ) {
                
                return 1;
                
            }
            
            return 0;
            
        });
        
        list.empty();
        
        console.log(lines);
        
        for (var z=0; z < lines.length; z++) {
            
            var add = document.createElement('li')
            add.setAttribute("id", lines[z].id);
            add.innerHTML = lines[z].content;
            list.append(add);
            
        }    
    }
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!    HELP PAGE SCRIPTING   !!!!!!!!!!!!!!! //          
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //  
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! // 
    
    if ($("body.helper").length){
        
        shouldAJAX = false;
        
        $("#add-customer-block").show();
        
        $(".indexElement").click(function(e){
            
            var jumpTo = $(this).attr("href");
            $("helper-text").scrolltop($(jumpTo).offset().top);
            
        });
        
        $(".img_button").click(function(){
           
            $("#item-list-popup").css({"right":"auto","width":"50vw","height":"75vh"});
            
            var holder = $(".imgHolder")
            
            holder.empty();
            
            var imgUrl=$(this).attr("data-link");
            var imgName=$(this).text();
            
            //create txt h2 element
            var txt = document.createElement("h2");
            txt.textContent = imgName;
            holder.append(txt);
            
            //Create img element
            var img = document.createElement("img");
            img.setAttribute("src", imgUrl);
            holder.append(img)
            
            
            
            
            $("#item-list-popup").show("scale", "ease", "fast");
            
        });
    
    }

    
    
}); 


