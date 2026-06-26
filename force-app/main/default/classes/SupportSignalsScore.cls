public with sharing class SupportSignalsScore {
    private final static Date thirtyDaysAgo = Date.today().addDays(-30);
    private final static Date sevenDaysAgo = Date.today().addDays(-7);
    private final static Date baselineStart = Date.today().addDays(-90);
    private final static Date baselineEnd = Date.today().addDays(-30);

    @InvocableMethod(
        label='Calculate Support Signals Score'
        description='Calculates the Support Signals score (0-40) for an account based on case volume, escalations, and unresolved critical cases'
    )
    public static List<Response> calculateScore(List<Request> requests) {
        List<Response> responses = new List<Response>();
        for (Request req : requests) {
            Response res = calculateSupportScore(req.accountId);
            responses.add(res);
        }
        return responses;
    }

    private static Response calculateSupportScore(Id accountId) {
        // Case volume spike - compare last 30 days vs baseline (30-90 days ago)
        Integer recentCaseCount = [
            SELECT COUNT()
            FROM Case
            WHERE AccountId = :accountId AND CreatedDate >= :thirtyDaysAgo
        ];

        Integer baselineCaseCount = [
            SELECT COUNT()
            FROM Case
            WHERE
                AccountId = :accountId
                AND CreatedDate >= :baselineStart
                AND CreatedDate < :baselineEnd
        ];
        Boolean hasVolumeSpike = false;
        if (
            baselineCaseCount > 0 &&
            recentCaseCount >= (baselineCaseCount * 2)
        ) {
            hasVolumeSpike = true;
        }

        // Escalated cases - Priority/Severity cases in last 30 days
        Integer escalatedCaseCount = [
            SELECT COUNT()
            FROM Case
            WHERE
                AccountId = :accountId
                AND CreatedDate >= :thirtyDaysAgo
                AND (Priority = 'High'
                OR Priority = 'Critical')
        ];
        Boolean hasEscalatedCases = (escalatedCaseCount > 0);

        // Unresolved critical cases - High-priority cases open > 7 days
        Integer unresolvedCriticalCount = [
            SELECT COUNT()
            FROM Case
            WHERE
                AccountId = :accountId
                AND IsClosed = FALSE
                AND Priority = 'High'
                AND CreatedDate <= :sevenDaysAgo
        ];
        Boolean hasUnresolvedCritical = (unresolvedCriticalCount > 0);

        // Calculate score
        // Deduct points for each issue (roughly 1/3 of total each)
        Decimal score = 40.0;
        if (hasVolumeSpike) {
            score -= 13.33; // ~33% penalty
        }
        if (hasEscalatedCases) {
            score -= 13.33; // ~33% penalty
        }
        if (hasUnresolvedCritical) {
            score -= 13.34; // ~33% penalty (rounds to 40)
        }
        score = Math.max(score, 0);

        // Build details
        String details = '''
Recent Cases (30 days): ${recentCaseCount}
Baseline Cases (30-90 days ago): ${baselineCaseCount}
Escalated Cases (30 days): ${escalatedCaseCount}
Unresolved Critical (>7 days): ${unresolvedCriticalCount}
'''
            .template(
                new Map<String, Object>{
                    'recentCaseCount' => recentCaseCount,
                    'baselineCaseCount' => baselineCaseCount,
                    'escalatedCaseCount' => escalatedCaseCount,
                    'unresolvedCriticalCount' => unresolvedCriticalCount
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
        @InvocableVariable(label='Support Signals Score')
        public Decimal score;

        @InvocableVariable(label='Details')
        public String details;
    }
}
