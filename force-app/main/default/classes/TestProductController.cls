@isTest
public class TestProductController {

    public static void createProducts() {
        List<Product__c> products = new List<Product__c>();

        products.add(new Product__c(
                        Name='Sample Bike 1',
                        MSRP__c=1000,
                        Category__c='Mountain',
                        Level__c='Beginner',
                        Material__c='Carbon'));

        products.add(new Product__c(
                        Name='Sample Bike 2',
                        MSRP__c=1200,
                        Category__c='Mountain',
                        Level__c='Beginner',
                        Material__c='Carbon'));

        insert products;
    }

    static testMethod void testGetProducts() {
        TestProductController.createProducts();
        String filters = '{"searchKey":"Sample", "maxPrice":2000, "categories": ["Mountain"], "levels": ["Beginner"], "materials":["Carbon"]}, 1';
        Test.startTest();
        PagedResult result = ProductController.getProducts(filters, 1);
        Test.stopTest();
        System.assertEquals(result.records.size(), 2);
    }
    static testMethod void testGetSimilarProducts() {
        TestProductController.createProducts();
        Test.startTest();
        String filters = '{"searchKey":"Sample", "maxPrice":2000, "categories": ["Mountain"], "levels": ["Beginner"], "materials":["Carbon"]}, 1';
        PagedResult result = ProductController.getProducts(filters, 1);
        Product__c productToCompare = (Product__c)result.records[0];
        Product__c[] products = ProductController.getSimilarProducts(productToCompare.Id, null);
        System.assertEquals(products.size(), 1);
    }

}