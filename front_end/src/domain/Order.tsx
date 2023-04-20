export enum OrderStatus {
  PENDING, // order submitted by client, but before the restaurant accepts the order
  WAITING_COURIER, // order ready for courier (after being accepted by restaurant)
  ASSIGNED_COURIER, // order accepted by a courier
  READY_TO_DELIVER, // order finished by restaurant, ready to deliver
  DELIVERING, // order being delivered by the courier
  DELIVERED, // order delivered, confirmed by client
  CANCELLED, // order was cancelled
}

export class Order {
  orderId: number | undefined;
  restaurantAddr: string;
  itemIds: number[] | undefined;
  quantities: number[] | undefined;
  deliveryFee: number;
  deliveryAddress: string;
  orderStatus: OrderStatus;

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
