public with sharing class DataProvider_Inventory {
    public static List<Product__c> getInventoryData() {
        return [
            SELECT Id, Name, MSRP__c, Slack_Image_URL__c, Stock_on_Hand__c
            FROM Product__c
            WITH SECURITY_ENFORCED
            LIMIT 20
        ];
    }
}
