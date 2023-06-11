import { BigNumber } from "ethers";
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
  clinetAddr: string;
  restaurantAddr: string;
  restaurantName: string;
  restaurantPhysicalAddress: string;
  itemIds: number[] | undefined;
  quantities: number[] | undefined;
  deliveryFee: number;
  deliveryAddress: string;
  orderStatus: OrderStatus;
  items: Item[] | undefined;
  preparationStartTime: number | undefined;

  constructor(
    orderId: number | undefined,
    restaurantAddr: string,
    restaurantName: string,
    restaurantPhysicalAddress: string,
    clientAddr: string,
    itemIds: number[] | undefined,
    quantities: number[] | undefined,
    deliveryFee: number,
    deliveryAddress: string,
    orderStatus: OrderStatus,
    preparationStartTime: number | undefined | BigNumber
  ) {
    this.orderId = orderId;
    this.restaurantAddr = restaurantAddr;
    this.restaurantName = restaurantName;
    this.restaurantPhysicalAddress = restaurantPhysicalAddress;
    this.clinetAddr = clientAddr;
    this.itemIds = itemIds;
    this.quantities = quantities;
    this.deliveryFee = deliveryFee;
    this.deliveryAddress = deliveryAddress;
    this.orderStatus = orderStatus;
    this.preparationStartTime =
      preparationStartTime instanceof BigNumber
        ? preparationStartTime.toNumber()
        : preparationStartTime;
  }
}
