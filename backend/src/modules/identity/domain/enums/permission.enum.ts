export enum Permission {

// User
USER_READ = "user:read",
USER_UPDATE = "user:update",
USER_DELETE = "user:delete",

// Customer
CUSTOMER_PROFILE_READ = "customer:read",

// Restaurants
RESTAURANT_CREATE = "restaurant:create",
RESTAURANT_READ = "restaurant:read",
RESTAURANT_UPDATE = "restaurant:update",
RESTAURANT_DELETE = "restaurant:delete",

// Menu
MENU_CREATE = "menu:create",
MENU_READ = "menu:read",
MENU_UPDATE = "menu:update",
MENU_DELETE = "menu:delete",

// Order
ORDER_CREATE = "order:create",
ORDER_READ = "order:read",
ORDER_UPDATE = "order:update",
ORDER_CANCEL = "order:cancel",

// Delivery
DELIVERY_ASSIGN = "delivery:assign",
DELIVERY_UPDATE = "delivery:update",

// Driver
DRIVER_READ = "driver:read",
DRIVER_UPDATE = "driver:update",

// Payment
PAYMENT_CREATE = "payment:create",
PAYMENT_READ = "payment:read",
PAYMENT_REFUND = "payment:refund",

// Admin
ADMIN_ACCESS = "admin:access"

}
