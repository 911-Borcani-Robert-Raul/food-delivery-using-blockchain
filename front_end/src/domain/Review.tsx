import { BigNumber } from "ethers";

export class Review {
  orderId: number | undefined;
  rating: number;
  comment: string;

  constructor(
    orderId: number | BigNumber | undefined,
    rating: number | BigNumber,
    comment: string
  ) {
    this.orderId = orderId instanceof BigNumber ? orderId.toNumber() : orderId;
    this.rating = rating instanceof BigNumber ? rating.toNumber() : rating;
    this.comment = comment;
  }
}
