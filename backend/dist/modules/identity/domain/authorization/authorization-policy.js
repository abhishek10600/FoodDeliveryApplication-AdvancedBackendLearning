import { Role, Permission } from "../enums/index.js";
export const ROLE_PERMISSIONS = {
    [Role.ADMIN]: [
        Permission.ADMIN_ACCESS,
        Permission.USER_READ,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        Permission.RESTAURANT_CREATE,
        Permission.RESTAURANT_READ,
        Permission.RESTAURANT_UPDATE,
        Permission.RESTAURANT_DELETE,
        Permission.MENU_CREATE,
        Permission.MENU_READ,
        Permission.MENU_UPDATE,
        Permission.MENU_DELETE,
        Permission.ORDER_CREATE,
        Permission.ORDER_READ,
        Permission.ORDER_UPDATE,
        Permission.ORDER_CANCEL,
        Permission.DELIVERY_ASSIGN,
        Permission.DELIVERY_UPDATE,
        Permission.DRIVER_READ,
        Permission.DRIVER_UPDATE,
        Permission.PAYMENT_CREATE,
        Permission.PAYMENT_READ,
        Permission.PAYMENT_REFUND
    ],
    [Role.CUSTOMER]: [
        Permission.RESTAURANT_READ,
        Permission.MENU_READ,
        Permission.ORDER_CREATE,
        Permission.ORDER_READ,
        Permission.ORDER_CANCEL
    ],
    [Role.RESTAURANT_OWNER]: [
        Permission.RESTAURANT_CREATE,
        Permission.RESTAURANT_READ,
        Permission.RESTAURANT_UPDATE,
        Permission.MENU_CREATE,
        Permission.MENU_READ,
        Permission.MENU_UPDATE,
        Permission.MENU_DELETE,
        Permission.ORDER_READ,
        Permission.ORDER_UPDATE
    ],
    [Role.DRIVER]: [
        Permission.ORDER_READ,
        Permission.DELIVERY_UPDATE,
        Permission.DRIVER_READ,
        Permission.DRIVER_UPDATE
    ],
};
