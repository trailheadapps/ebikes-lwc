/*
Author->
Description -> added some text

*/
public with sharing class OrderController {
    @AuraEnabled(Cacheable=true)
    public static Order_Item__c[] getOrderItems(Id orderId) {
        return [
            SELECT
                Id,
                Qty_S__c,
                Qty_M__c,
                Qty_L__c,
                Price__c,
                Product__r.Name,
                Product__r.MSRP__c,
                Product__r.Picture_URL__c
            FROM Order_Item__c
            WHERE Order__c = :orderId
            WITH SECURITY_ENFORCED
        ];
    }
    public static void testMethod1(){
        System.debug('This a additional Method');
    }

    public static void testMethod2(){
        System.debug('This a Second Method');
    }

    public static void testMethod3(){
        System.debug('This a third Method');
    }    
    public static void testMethod4(){
        System.debug('This a fourth Method');
    } 
    public static void testMethod5(){
        System.debug('This a Fifth Method');
    }   
}
