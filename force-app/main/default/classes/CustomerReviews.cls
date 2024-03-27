public with sharing class CustomerReviews {
    @AuraEnabled(cacheable=true)
    public static List<Customer_Review__c> getCustomerReviews(Id recordId) {
        return [
            SELECT Id, Name, Rating__c, Review__c
            FROM Customer_Review__c
            WHERE Product__c = :recordId
            ORDER BY CreatedDate DESC
            LIMIT 7
        ];
    }
}
