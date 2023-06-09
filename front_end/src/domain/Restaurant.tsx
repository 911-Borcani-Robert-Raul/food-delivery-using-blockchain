export class Restaurant {
  addr: string | undefined;
  name: string;
  description: string;
  physicalAddress: string;
  averageRating: number | undefined;

  constructor(
    addr: string | undefined,
    name: string,
    description: string,
    physicalAddress: string,
    averageRating: number | undefined
  ) {
    this.addr = addr;
    this.name = name;
    this.description = description;
    this.physicalAddress = physicalAddress;
    this.averageRating = averageRating;
  }
}
