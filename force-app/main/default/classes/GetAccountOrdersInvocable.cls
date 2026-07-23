public with sharing class GetAccountOrdersInvocable {
    @InvocableMethod(
        label='Get Account Orders'
        description='Returns all orders for a given account'
        category='Order'
    )
    public static List<Result> getAccountOrders(List<Request> requests) {
        List<Result> results = new List<Result>();

        for (Request request : requests) {
            Result result = new Result();

            if (request.accountId == null) {
                result.orders = new List<Order__c>();
            } else {
                result.orders = [
                    SELECT
                        Id,
                        Name,
                        Account__c,
                        Account__r.Name,
                        Status__c,
                        CreatedDate,
                        LastModifiedDate
                    FROM Order__c
                    WHERE Account__c = :request.accountId
                    WITH USER_MODE
                    ORDER BY CreatedDate DESC
                ];
            }

            results.add(result);
        }

        return results;
    }

    public class Request {
        @InvocableVariable(
            label='Account ID'
            description='The ID of the account to retrieve orders for'
            required=true
        )
        public Id accountId;
    }

    public class Result {
        @InvocableVariable(
            label='Orders'
            description='List of orders for the account'
        )
        public List<Order__c> orders;
    }
}
