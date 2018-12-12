@isTest
public class TestOrderController {

    public static Order__c createOrder() {
        Account acc = new Account(
            Name='Sample Account'
        );
        insert acc;

        Order__c newOrder = new Order__c(
            Account__c=acc.Id
        );
        insert newOrder;
        return newOrder;
    }

    public static void createOrderItem(Id orderId) {
        Product__c p = new Product__c(
            Name='Sample Product'
        );
        insert p;
        Order_Item__c orderItem = new Order_Item__c(
            Order__c=orderId,
            Product__c=p.Id
        );
        insert orderItem;
    }

    static testMethod void testGetOrderItems() {
        Order__c newOrder = TestOrderController.createOrder();
        Id orderId = newOrder.Id;
        TestOrderController.createOrderItem(orderId);
        Test.startTest();
        List<Order_Item__c> orderItems = OrderController.getOrderItems(orderId);
        Test.stopTest();
        System.assertEquals(orderItems.size(), 1);
    }

}
