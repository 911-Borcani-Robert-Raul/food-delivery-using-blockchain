from scripts.tests.client_tests import test_register_client
from scripts.tests.order_tests import (test_accept_order, test_decline_order,
                                       test_get_all_orders_for_client,
                                       test_get_all_orders_for_restaurant,
                                       test_get_order_items_and_quantities,
                                       test_get_orders_for_couriers,
                                       test_increase_delivery_fee,
                                       test_order_delivered,
                                       test_order_delivering,
                                       test_order_ready_to_deliver,
                                       test_place_order, test_take_order)
from scripts.tests.restaurant_tests import (test_add_item, test_disable_item,
                                            test_enable_item,
                                            test_get_all_restaurants,
                                            test_get_items_for_restaurant,
                                            test_get_number_of_items_in_menu,
                                            test_register_restaurant,
                                            test_update_item)
from scripts.tests.reviews_tests import test_place_review


def test_app():
    # test_register_restaurant()
    # test_register_client()
    # test_add_item()
    # test_update_item()
    # test_enable_item()
    # test_disable_item()
    # test_get_all_restaurants()
    # test_get_all_orders_for_client()
    # test_get_all_orders_for_restaurant()
    # test_get_orders_for_couriers()
    # test_get_items_for_restaurant()
    # test_place_order()
    # test_accept_order()
    # test_decline_order()
    # # test_increase_delivery_fee()    # NOT WORKING
    # test_take_order()
    # test_order_ready_to_deliver()
    # test_get_order_items_and_quantities()
    # test_get_number_of_items_in_menu()
    # test_order_delivering()
    # test_order_delivered()
    test_place_review()


def main():
    test_app()
