pragma solidity ^0.6.6;
import "./domain/item.sol";

contract FoodDelivery {
    uint256 public test;
    Item[] public items;

    constructor() public {
        test = 23;
    }
}
