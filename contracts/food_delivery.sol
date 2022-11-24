pragma solidity ^0.8.13;

contract FoodDelivery {
    struct Item{
        uint256 id;
        string name;
        string description;
        uint256 price;
    }

    struct Restaurant{
        uint256 id;
        string name;
        string description;
        Item[] items;
    }

    Restaurant public testRestaurant;

    constructor() public {
        testRestaurant.id = 1;
        testRestaurant.description = 'description sample';
        testRestaurant.name = 'name test';
    }
}
