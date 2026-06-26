public with sharing class OpportunityHealthScore {
    private final static Date sixMonthsAgo = Date.today().addMonths(-6);

    @InvocableMethod(
        label='Calculate Opportunity Health Score'
        description='Calculates the Opportunity Health score (0-30) for an account based on closed-lost trends and pipeline'
    )
    public static List<Response> calculateScore(List<Request> requests) {
        List<Response> responses = new List<Response>();
        for (Request req : requests) {
            Response res = calculateOpportunityScore(req.accountId);
            responses.add(res);
        }
        return responses;
    }

    private static Response calculateOpportunityScore(Id accountId) {
        // Check for Closed-Lost opportunities in last 6 months
        Integer closedLostCount = [
            SELECT COUNT()
            FROM Opportunity
            WHERE
                AccountId = :accountId
                AND StageName = 'Closed Lost'
                AND CloseDate >= :sixMonthsAgo
        ];

        // Check for past purchases (won opportunities)
        Integer wonCount = [
            SELECT COUNT()
            FROM Opportunity
            WHERE AccountId = :accountId AND IsWon = TRUE
        ];

        // Check for open opportunities
        Integer openCount = [
            SELECT COUNT()
            FROM Opportunity
            WHERE AccountId = :accountId AND IsClosed = FALSE
        ];

        // Calculate score
        Decimal score = 30.0;

        // Deduct points for 2+ Closed Lost in last 6 months
        if (closedLostCount >= 2) {
            score -= 15.0; // 50% penalty for increasing closed-lost trend
        }

        // Deduct points if pipeline dried up (no open opps for accounts with past purchases)
        if (wonCount > 0 && openCount == 0) {
            score -= 15.0; // 50% penalty for dried up pipeline
        }

        score = Math.max(score, 0);

        // Build details
        String details = '''
Closed Lost (6 months): ${closedLostCount}
Total Won Opportunities: ${wonCount}
Open Opportunities: ${openCount}
'''
            .template(
                new Map<String, Object>{
                    'closedLostCount' => closedLostCount,
                    'wonCount' => wonCount,
                    'openCount' => openCount
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
        @InvocableVariable(label='Opportunity Health Score')
        public Decimal score;

        @InvocableVariable(label='Details')
        public String details;
    }
}
