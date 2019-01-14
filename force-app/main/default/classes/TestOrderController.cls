@isTest
public class TestOrderController {

    @testSetup
    static void setup() {
        Account acc = new Account(
            Name = 'Sample Account'
        );
        insert acc;

        Order__c newOrder = new Order__c(
            Account__c = acc.Id
        );
        insert newOrder;

        Product__c p = new Product__c(
            Name = 'Sample Product'
        );
        insert p;

        Order_Item__c orderItem = new Order_Item__c(
            Order__c = newOrder.Id,
            Product__c = p.Id
        );
        insert orderItem;

    }

    @isTest
    static void testGetOrderItems() {
        Order__c newOrder = TestOrderController.createOrder();
        Id orderId = newOrder.Id;
        TestOrderController.createOrderItem(orderId);
        Test.startTest();
        List<Order_Item__c> orderItems = OrderController.getOrderItems(orderId);
        Test.stopTest();
        System.assertEquals(orderItems.size(), 1);
    }

}
