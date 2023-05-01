import { Item } from "./Item";

export enum OrderStatus {
  PENDING, // order submitted by client, but before the restaurant accepts the order
  WAITING_COURIER, // order ready for courier (after being accepted by restaurant)
  ASSIGNED_COURIER, // order accepted by a courier
  READY_TO_DELIVER, // order finished by restaurant, ready to deliver
  DELIVERING, // order being delivered by the courier
  DELIVERED, // order delivered, confirmed by client
  CANCELLED, // order was cancelled
}

export function getOrderStatusString(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "Pending";
    case OrderStatus.WAITING_COURIER:
      return "Waiting for courier";
    case OrderStatus.ASSIGNED_COURIER:
      return "Assigned to courier";
    case OrderStatus.READY_TO_DELIVER:
      return "Ready to deliver";
    case OrderStatus.DELIVERING:
      return "Delivering";
    case OrderStatus.DELIVERED:
      return "Delivered";
    case OrderStatus.CANCELLED:
      return "Cancelled";
    default:
      throw new Error("Invalid order status");
  }
}

export class Order {
  orderId: number | undefined;
  restaurantAddr: string;
  itemIds: number[] | undefined;
  quantities: number[] | undefined;
  deliveryFee: number;
  deliveryAddress: string;
  orderStatus: OrderStatus;
  items: Item[] | undefined;

  constructor(
    orderId: number | undefined,
    restaurantAddr: string,
    itemIds: number[] | undefined,
    quantities: number[] | undefined,
    deliveryFee: number,
    deliveryAddress: string,
    orderStatus: OrderStatus
  ) {
    this.orderId = orderId;
    this.restaurantAddr = restaurantAddr;
    this.itemIds = itemIds;
    this.quantities = quantities;
    this.deliveryFee = deliveryFee;
    this.deliveryAddress = deliveryAddress;
    this.orderStatus = orderStatus;
  }
}
