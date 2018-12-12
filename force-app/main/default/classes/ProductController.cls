public with sharing class ProductController {

    static Integer PAGE_SIZE = 9;

    public class Filters {
        public String searchKey { get;set; }

        public Decimal maxPrice { get;set; }

        public String[] categories { get;set; }

        public String[] materials { get;set; }

        public String[] levels { get;set; }
    }

    @AuraEnabled(Cacheable=true)
    public static PagedResult getProducts(String filters, Integer pageNumber) {
        String key, whereClause = '';
        Decimal maxPrice;
        String[] categories, materials, levels, criteria = new String[]{};
        if (!String.isEmpty(filters)) {
            Filters productFilters = (Filters) JSON.deserializeStrict(filters, ProductController.Filters.class);
            maxPrice = productFilters.maxPrice;
            materials = productFilters.materials;
            levels = productFilters.levels;
            if (!String.isEmpty(productFilters.searchKey)) {
                key = '%' + productFilters.searchKey + '%';
                criteria.add('Name LIKE :key');
            }
            if (productFilters.maxPrice >= 0) {
                maxPrice = productFilters.maxPrice;
                criteria.add('MSRP__c <= :maxPrice');
            }
            if (productFilters.categories != null) {
                categories = productFilters.categories;
                criteria.add('Category__c IN :categories');
            }                      
            if (productFilters.levels != null) {
                levels = productFilters.levels;
                criteria.add('Level__c IN :levels');
            }                      
            if (productFilters.materials != null) {
                materials = productFilters.materials;
                criteria.add('Material__c IN :materials');
            }
            if (criteria.size() > 0) {
                whereClause = 'WHERE ' + String.join( criteria, ' AND ' );
            }                      
        }
        Integer pageSize = ProductController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;
        PagedResult result =  new PagedResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery('SELECT count() FROM Product__c ' + whereClause);
        result.records = Database.query('SELECT Id, Name, MSRP__c, Description__c, Category__c, Level__c, Picture_URL__c, Material__c FROM Product__c ' + whereClause + ' ORDER BY Name LIMIT :pageSize OFFSET :offset');
        return result;
    }

    @AuraEnabled(Cacheable=true)
    public static Product__c[] getSimilarProducts(Id productId, Id familyId) {
        return [SELECT Id, Name, MSRP__c, Description__c, Category__c, Level__c, Picture_URL__c, Material__c FROM Product__c WHERE Product_Family__c=:familyId AND Id!=:productId];
    }

}