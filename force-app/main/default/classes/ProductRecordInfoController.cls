public with sharing class ProductRecordInfoController {
    @AuraEnabled(Cacheable=true scope='global')
    public static List<String> getRecordInfo(String productOrFamilyName) {
        List<String> recordInfo = new List<String>();

        List<Product__c> cProductList = [
            SELECT ID
            FROM Product__c
            WHERE NAME = :productOrFamilyName
            WITH USER_MODE
        ];
        if (cProductList.size() > 0) {
            recordInfo.add(cProductList[0].ID);
            recordInfo.add('Product__c');
            return recordInfo;
        }

        List<Product_Family__c> cProductFamilyList = [
            SELECT ID
            FROM Product_Family__c
            WHERE NAME = :productOrFamilyName
            WITH USER_MODE
        ];
        if (cProductFamilyList.size() > 0) {
            recordInfo.add(cProductFamilyList[0].ID);
            recordInfo.add('Product_Family__c');
            return recordInfo;
        }
        return null;
    }
}
