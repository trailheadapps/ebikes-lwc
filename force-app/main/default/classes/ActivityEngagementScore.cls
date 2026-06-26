public with sharing class ActivityEngagementScore {
    private final static Date sixtyDaysAgo = Date.today().addDays(-60);

    @InvocableMethod(
        label='Calculate Activity & Engagement Score'
        description='Calculates the Activity & Engagement score (0-30) for an account based on past and future activities'
    )
    public static List<Response> calculateScore(List<Request> requests) {
        List<Response> responses = new List<Response>();
        for (Request req : requests) {
            Response res = calculateActivityScore(req.accountId);
            responses.add(res);
        }
        return responses;
    }

    private static Response calculateActivityScore(Id accountId) {
        // Get related contact IDs
        Set<Id> contactIds = new Set<Id>();
        for (Contact c : [
            SELECT Id
            FROM Contact
            WHERE AccountId = :accountId
        ]) {
            contactIds.add(c.Id);
        }

        // Check for past activity in last 60 days (Tasks, Events)
        Integer pastTaskCount = [
            SELECT COUNT()
            FROM Task
            WHERE
                (AccountId = :accountId
                OR WhoId IN :contactIds)
                AND ActivityDate >= :sixtyDaysAgo
                AND ActivityDate <= :Date.today()
        ];

        Integer pastEventCount = [
            SELECT COUNT()
            FROM Event
            WHERE
                (AccountId = :accountId
                OR WhoId IN :contactIds)
                AND ActivityDate >= :sixtyDaysAgo
                AND ActivityDate <= :Date.today()
        ];

        Boolean hasPastActivity = (pastTaskCount > 0 || pastEventCount > 0);

        // Check for future scheduled activity
        Integer futureEventCount = [
            SELECT COUNT()
            FROM Event
            WHERE
                (AccountId = :accountId
                OR WhoId IN :contactIds)
                AND ActivityDate > :Date.today()
        ];

        Boolean hasFutureActivity = (futureEventCount > 0);

        // Calculate score
        Decimal score = 30.0;

        // Deduct points for missing activities
        if (!hasPastActivity) {
            score -= 15.0; // 50% penalty for no past activity
        }

        if (!hasFutureActivity) {
            score -= 15.0; // 50% penalty for no future activity
        }

        score = Math.max(score, 0);

        // Build details
        String details = '''
Past Tasks (60 days): ${pastTaskCount}
Past Events (60 days): ${pastEventCount}
Future Events: ${futureEventCount}
'''
            .template(
                new Map<String, Object>{
                    'pastTaskCount' => pastTaskCount,
                    'pastEventCount' => pastEventCount,
                    'futureEventCount' => futureEventCount
                }
            );

        Response res = new Response();
        res.score = score;
        res.details = details;
        return res;
    }

    public class Request {
        @InvocableVariable(label='Account ID' required=true)
        public Id accountId;
    }

    public class Response {
        @InvocableVariable(label='Activity & Engagement Score')
        public Decimal score;

        @InvocableVariable(label='Details')
        public String details;
    }
}
