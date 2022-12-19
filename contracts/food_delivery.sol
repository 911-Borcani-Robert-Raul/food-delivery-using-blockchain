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

    struct Client {
        address addr;
        string name;
    }

    struct Order {
        uint256 id;
        address restaurantAddr;
        address clientAddr;
        uint256[] itemIndices;
        uint256[] quantities;
        uint256 totalPrice;
        bool isComplete;
        bool isDelivered;
    }


    mapping(address => Restaurant) public restaurants;
    mapping(uint256 => Order) public orders;
    mapping(address => Client) public clients;
    uint256 numberOfOrders = 0;

    function registerRestaurant(string calldata name, string calldata description) public {
        Restaurant storage restaurant = restaurants[msg.sender];
        restaurant.addr = msg.sender;
        restaurant.name = name;
        restaurant.description = description;
        restaurants[msg.sender] = restaurant;
    }

    function registerClient(string calldata name) public {
        Client storage client = clients[msg.sender];
        client.addr = msg.sender;
        client.name = name;
        clients[msg.sender] = client;
    }

    function addItem(uint256 id, string calldata name, string calldata description, uint256 price) public {
        Restaurant storage restaurant = restaurants[msg.sender];
        restaurant.items.push(Item({
            id: id,
            name: name,
            description: description,
            price: price
        }));
        restaurants[msg.sender] = restaurant;
    }

    function placeOrder(address restaurantAddr, uint256[] memory itemIds, uint256[] memory quantities) public {
        Restaurant storage restaurant = restaurants[restaurantAddr];
        uint256 totalPrice = 0;

        for (uint256 i = 0; i < itemIds.length; i++) {
            Item memory item = restaurant.items[itemIds[i]];
            totalPrice += item.price * quantities[i];
        }

        uint256 id = numberOfOrders++;

        orders[id] = Order({
            id: id,
            restaurantAddr: restaurantAddr,
            clientAddr: msg.sender,
            itemIndices: itemIds,
            quantities: quantities,
            totalPrice: totalPrice,
            isComplete: false,
            isDelivered: false
        });
    }
}
