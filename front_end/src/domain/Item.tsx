import { BigNumber } from "ethers";

export class Item {
  id: number | undefined;
  name: string;
  description: string;
  price: number;

  constructor(
    id: number | BigNumber | undefined,
    name: string,
    description: string,
    price: number | BigNumber
  ) {
    this.id = id instanceof BigNumber ? id.toNumber() : id;
    this.name = name;
    this.description = description;
    this.price = price instanceof BigNumber ? price.toNumber() : price;
  }
}
