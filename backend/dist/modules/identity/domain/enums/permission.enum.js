export var Permission;
(function (Permission) {
    // User
    Permission["USER_READ"] = "user:read";
    Permission["USER_UPDATE"] = "user:update";
    Permission["USER_DELETE"] = "user:delete";
    // Restaurants
    Permission["RESTAURANT_CREATE"] = "restaurant:create";
    Permission["RESTAURANT_READ"] = "restaurant:read";
    Permission["RESTAURANT_UPDATE"] = "restaurant:update";
    Permission["RESTAURANT_DELETE"] = "restaurant:delete";
    // Menu
    Permission["MENU_CREATE"] = "menu:create";
    Permission["MENU_READ"] = "menu:read";
    Permission["MENU_UPDATE"] = "menu:update";
    Permission["MENU_DELETE"] = "menu:delete";
    // Order
    Permission["ORDER_CREATE"] = "order:create";
    Permission["ORDER_READ"] = "order:read";
    Permission["ORDER_UPDATE"] = "order:update";
    Permission["ORDER_CANCEL"] = "order:cancel";
    // Delivery
    Permission["DELIVERY_ASSIGN"] = "delivery:assign";
    Permission["DELIVERY_UPDATE"] = "delivery:update";
    // Driver
    Permission["DRIVER_READ"] = "driver:read";
    Permission["DRIVER_UPDATE"] = "driver:update";
    // Payment
    Permission["PAYMENT_CREATE"] = "payment:create";
    Permission["PAYMENT_READ"] = "payment:read";
    Permission["PAYMENT_REFUND"] = "payment:refund";
    // Admin
    Permission["ADMIN_ACCESS"] = "admin:access";
})(Permission || (Permission = {}));
