export class Restaurant {
  addr: string | undefined;
  name: string;
  description: string;
  physicalAddress: string;

  constructor(
    addr: string | undefined,
    name: string,
    description: string,
    physicalAddress: string
  ) {
    this.addr = addr;
    this.name = name;
    this.description = description;
    this.physicalAddress = physicalAddress;
  }
}
