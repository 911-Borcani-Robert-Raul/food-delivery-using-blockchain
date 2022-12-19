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

    enum OrderStatus {
        PENDING,                // order submitted by client, but before the restaurant accepts the order
        PROCESSING,             // order submited by client and accepted by restaurant
        WAITING_COURIER,        // order ready for courier
        DELIVERING,             // order picked up by a courier
        DELIVERED,              // order delivered, confirmed by client
        CANCELLED               // order was cancelled
    }

    struct Order {
        uint256 id;
        address restaurantAddr;
        address clientAddr;
        address courierAddr;
        uint256[] itemIndices;
        uint256[] quantities;
        uint256 deliveryFee;
        uint256 totalPrice;
        string deliveryAddress;
        OrderStatus status;
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

    function placeOrder(address restaurantAddr, uint256[] memory itemIds, uint256[] memory quantities, uint256 deliveryFee, string memory deliveryAddress) public payable {
        Restaurant memory restaurant = restaurants[restaurantAddr];
        require(restaurant.addr != address(0), "Invalid restaurant address");

        uint256 totalPrice = 0;
        for (uint256 i = 0; i < itemIds.length; i++) {
            require(itemIds[i] < restaurant.items.length, "Invalid item ID");
            Item memory item = restaurant.items[itemIds[i]];
            totalPrice += item.price * quantities[i];
        }

        require(totalPrice > 0, "Total price of order must be greater than zero");
        require(msg.value == totalPrice + deliveryFee, "Incorrect amount paid");

        uint256 id = numberOfOrders++;

        orders[id] = Order({
            id: id,
            restaurantAddr: restaurantAddr,
            clientAddr: msg.sender,
            courierAddr: address(0),
            itemIndices: itemIds,
            quantities: quantities,
            deliveryFee: deliveryFee,
            totalPrice: totalPrice,
            deliveryAddress: deliveryAddress,
            status: OrderStatus.PENDING
        });
    }

    function acceptOrder(uint256 orderId) public {
        Order storage order = orders[orderId];
        require(order.id == orderId, "Order with given id does not exist");
        require(order.restaurantAddr == msg.sender, "Only the restaurant for which the order was made can accept it");
        require(order.status == OrderStatus.PENDING, "Can only accept orders for which the status is PENDING");

        order.status = OrderStatus.PROCESSING;
    }

    function declineOrder(uint256 orderId) public {
        Order storage order = orders[orderId];
        require(order.id == orderId, "Order with given id does not exist");
        require(order.restaurantAddr == msg.sender, "Only the restaurant can decline the order");
        require(order.status == OrderStatus.PENDING, "Order must be pending");

        // refund the client
        address payable clientAddr = payable(order.clientAddr);
        require(clientAddr.send(order.totalPrice + order.deliveryFee), "Failed to refund client");

        order.status = OrderStatus.CANCELLED;
        orders[orderId] = order;
    }

}
