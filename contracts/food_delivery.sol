pragma solidity ^0.8.13;

contract FoodDelivery {
    struct Item{
        uint256 id;
        string name;
        string description;
        uint256 price;
    }

    struct Restaurant{
        address addr;
        string name;
        string description;
        Item[] items;
    }

    // function createRestaurant(address addr, string calldata name, string calldata description) private pure returns(Restaurant storage) {
    //     Restaurant storage restaurant = ;
    //     restaurant.addr = addr;
    //     restaurant.name = name;
    //     restaurant.description = description;

    //     return restaurant;
    // }

    mapping(address => Restaurant) public restaurants;

    function registerRestaurant(string calldata name, string calldata description) public {
        Restaurant storage restaurant = restaurants[msg.sender];
        restaurant.addr = msg.sender;
        restaurant.name = name;
        restaurant.description = description;
        restaurants[msg.sender] = restaurant;
    }
}
