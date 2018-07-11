var bank = 0;
$(document).ready(function() {
    loadItems();
    calculateMoney();
    
    $("#make-purchase-button").click(function () {
        if (($("#item-box").val()) != "" && ($("#item-box").val()) != null && ($("#money-input").val()) != "" && ($("#money-input").val()) != null) {
        makePurchase();
        } else if (($("#item-box").val()) == "" || ($("#item-box").val()) == null) {
            $("#messages-box").val("Please select an item.");
        } else {
            $("#messages-box").val("Please insert money.");
        }
    });

    $("#change-return-button").click(function() {
        changeReturn();
    });

});

function loadItems() {
    var itemButtonContent = $("#all-items-buttons");
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/items",
        success: function(data, status) {
            $.each(data, function(index, item){
                var itemId = Number(item.id);
                var name = item.name;
                var price = Number(item.price).toFixed(2);
                var quantity = item.quantity;
                var itemUpdate = "<button type='button' class='btn btn-outline-primary' onclick='getItem(" + itemId + ")'>";
                itemUpdate += "<p class='item-id-class-name'>" + itemId + "</p>";
                itemUpdate += "<p>" + name + "</p>";
                itemUpdate += "<p>" + "&#36; " + price + "</p>";
                itemUpdate += "<p>" + "Quantity Left: " + quantity + "</p>";
                itemUpdate += "</button>";

                itemButtonContent.append(itemUpdate);
            });  
        },
        error: function() {
            $("#all-items-buttons").append("<li class='list-group-item list-group-item-danger'> Vending Machine Broken. Please contact local technician. </li>");
            $("#all-items-buttons").append("<br/> <img src='images/nomagicwords.gif' />")
            $("#user-interface").remove();
        }
    });
}

function calculateMoney() {
    $("#add-dollar-button").click(function () {
        setBankMoney(parseFloat(1.00));
    });
    $("#add-quarter-button").click(function () {
        setBankMoney(parseFloat(.25));
    });
    $("#add-dime-button").click(function () {
        setBankMoney(parseFloat(.10));
    });
    $("#add-nickel-button").click(function () {
        setBankMoney(parseFloat(.05));
    });
}

function setBankMoney(moneyToAdd) {
    bank += moneyToAdd;
    $("#money-input").val(bank.toFixed(2));
}

function getItem(itemId) {
    $("#item-box").val(itemId);
}

function makePurchase() {
    var userMoney = $("#money-input").val();
    var itemToPurchase = $("#item-box").val();
    var totalQuarters = "";
    var totalDimes = "";
    var totalNickels = "";
    var totalPennies = "";
    var isThereChange = "";
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/money/" + userMoney + "/item/" + itemToPurchase,
        success: function(data, status) {
            if (data.quarters > 1) {
                totalQuarters = data.quarters + " Quarters ";
            } else if (data.quarters == 1) {
                totalQuarters = data.quarters + " Quarter ";
            }
            if (data.dimes > 1) {
                totalDimes = data.dimes + " Dimes ";
            } else if (data.dimes ==1) {
                totalDimes = data.dimes + " Dime ";
            }
            if (data.nickels > 1) {
                totalNickels = data.nickels + " Nickels ";
            } else if (data.nickels == 1) {
                totalNickels = data.nickels + " Nickel ";
            }
            if (data.pennies > 1) {
                totalPennies = data.pennies + " Pennies ";
            } else if (data.pennies == 1) {
                totalPennies = data.pennies + " Penny ";
            }
            if (data.quarters == 0 && data.dimes == 0 && data.nickels == 0 && data.pennies == 0){
                isThereChange = "No Change";
            }
            $("#messages-box").val("Thank you!!!");
            $("#change-box").val(totalQuarters + totalDimes + totalNickels + totalPennies + isThereChange);
        },
        error: function (data, status) {
            $("#messages-box").val(data.responseJSON.message);
        }
    });
}

function changeReturn() {
    if ($("#messages-box").val() != "Thank You!!!" && $("#change-box").val() == "") {
    $("#item-box").val("");
    $("#messages-box").val("");

    var userChangeCents = Math.round((parseFloat($("#money-input").val())) *100);
    var quarters = Math.floor(userChangeCents / 25);
    var dimes = Math.floor((userChangeCents % 25) / 10);
    var nickels = Math.floor(((userChangeCents % 25) % 10 ) / 5);
    var pennies = userChangeCents % 5;
    var totalQuarters = "";
    var totalDimes = "";
    var totalNickels = "";
    var totalPennies = "";
    var isThereChange = "";

    if (quarters > 1) {
        totalQuarters = quarters + " Quarters ";
    } else if (quarters == 1) {
        totalQuarters = quarters + " Quarter ";
    }
    if (dimes > 1) {
        totalDimes = dimes + " Dimes ";
    } else if (dimes == 1) {
        totalDimes = dimes + " Dime ";
    }
    if (nickels > 1) {
        totalNickels = nickels + " Nickels ";
    } else if (nickels == 1) {
        totalNickels = nickels + " Nickel ";
    }
    if (pennies > 1) {
        totalPennies = pennies + " Pennies ";
    } else if (pennies == 1) {
        totalPennies = pennies + " Penny ";
    }
    if (quarters == 0 && dimes == 0 && nickels == 0 && pennies == 0) {
        isThereChange = "No Change";
    }

    $("#change-box").val(totalQuarters + totalDimes + totalNickels + totalPennies + isThereChange);

    bank = 0;
    $("#money-input").val("");

    } else {
        bank = 0;
        $("#money-input").val("");
        $("#item-box").val("");
        $("#messages-box").val("");
        $("#change-box").val("");
        $("#all-items-buttons").html("");
        loadItems();
    }
}

