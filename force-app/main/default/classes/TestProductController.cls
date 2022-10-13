@isTest
public class TestProductController {
    private static final String PRODUCT_NAME1 = 'Sample Bike 1';
    private static final String PRODUCT_NAME2 = 'Sample Bike 2';

    @testSetup
    static void createProducts() {
        Product_Family__c family = new Product_Family__c(
            Name = 'TestFamily',
            Category__c = 'Mountain'
        );
        insert family;

        insert new List<Product__c>{
            new Product__c(
                Name = PRODUCT_NAME1,
                MSRP__c = 1000,
                Category__c = 'Mountain',
                Level__c = 'Beginner',
                Material__c = 'Carbon',
                Product_Family__c = family.Id
            ),
            new Product__c(
                Name = PRODUCT_NAME2,
                MSRP__c = 1200,
                Category__c = 'Mountain',
                Level__c = 'Racer',
                Material__c = 'Carbon',
                Product_Family__c = family.Id
            )
        };
    }

    @isTest
    static void getProducts_works() {
        ProductController.Filters filters = new ProductController.Filters();
        filters.searchKey = 'Sample';
        filters.maxPrice = 2000;
        filters.categories = new List<String>{ 'Mountain' };
        filters.levels = new List<String>{ 'Beginner' };
        filters.materials = new List<String>{ 'Carbon' };

        PagedResult result = ProductController.getProducts(filters, 1);

        Assert.areEqual(1, result.records.size());
        Assert.areEqual(PRODUCT_NAME1, ((Product__c) result.records[0]).Name);
    }

    @isTest
    static void getSimilarProducts_works() {
        Product__c baseProduct = [
            SELECT Id, Name, Product_Family__c
            FROM Product__c
            WHERE Name = :PRODUCT_NAME1
        ];

        Product__c[] similarProducts = ProductController.getSimilarProducts(
            baseProduct.Id,
            baseProduct.Product_Family__c
        );

        Assert.areEqual(1, similarProducts.size());
        Assert.areEqual(PRODUCT_NAME2, similarProducts[0].Name);
    }
}
