public with sharing class DynamicChartController {
    /**
     * Determines whether the chart feature flag is enabled based on user permissions and data availability
     * @return Boolean indicating if chart feature is enabled
     */
    @AuraEnabled(cacheable=true)
    public static Boolean shouldShowChart() {
        try {
            // Check if user has permission to view charts
            if (!Schema.SObjectType.Account.isAccessible()) {
                return false;
            }

            // Check if there's data available to display
            Integer recordCount = [SELECT COUNT() FROM Account LIMIT 1];

            // Enable chart feature if user has access and there's data
            return recordCount > 0;
        } catch (Exception e) {
            System.debug('Error in shouldShowChart: ' + e.getMessage());
            return false;
        }
    }

    /**
     * Gets sample chart data for demonstration
     * @return List of chart data objects
     */
    @AuraEnabled(cacheable=true)
    public static List<ChartDataWrapper> getChartData() {
        List<ChartDataWrapper> chartData = new List<ChartDataWrapper>();

        try {
            // Get account data for chart
            List<Account> accounts = [
                SELECT Name, AnnualRevenue
                FROM Account
                WHERE AnnualRevenue != NULL
                ORDER BY AnnualRevenue DESC
                LIMIT 5
            ];

            for (Account acc : accounts) {
                chartData.add(
                    new ChartDataWrapper(
                        acc.Name,
                        acc.AnnualRevenue != null ? acc.AnnualRevenue : 0
                    )
                );
            }

            // If no real data, provide sample data
            if (chartData.isEmpty()) {
                chartData.add(
                    new ChartDataWrapper('Sample Company 1', 1000000)
                );
                chartData.add(new ChartDataWrapper('Sample Company 2', 750000));
                chartData.add(new ChartDataWrapper('Sample Company 3', 500000));
                chartData.add(new ChartDataWrapper('Sample Company 4', 250000));
            }
        } catch (Exception e) {
            System.debug('Error in getChartData: ' + e.getMessage());
            // Return sample data on error
            chartData.add(new ChartDataWrapper('Error - Sample Data', 100000));
        }

        return chartData;
    }

    /**
     * Wrapper class for chart data
     */
    public class ChartDataWrapper {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public Decimal value;

        public ChartDataWrapper(String label, Decimal value) {
            this.label = label;
            this.value = value;
        }
    }
}
