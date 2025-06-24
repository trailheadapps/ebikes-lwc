({
    loadChartData: function (component) {
        var self = this;

        // Set loading state
        component.set('v.isLoading', true);

        // First, check if chart should be shown
        var shouldShowChartAction = component.get('c.shouldShowChart');
        shouldShowChartAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var shouldShow = response.getReturnValue();
                component.set('v.isFeatureFlagEnabled', shouldShow);

                // If chart should be shown, load the data
                if (shouldShow) {
                    self.loadChartDataFromServer(component);
                } else {
                    component.set('v.isLoading', false);
                }
            } else if (state === 'ERROR') {
                console.error(
                    'Error checking chart visibility: ' +
                        response.getError()[0].message
                );
                component.set('v.isFeatureFlagEnabled', false);
                component.set('v.isLoading', false);
            }
        });

        $A.enqueueAction(shouldShowChartAction);
    },

    loadChartDataFromServer: function (component) {
        var getChartDataAction = component.get('c.getChartData');
        getChartDataAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var chartData = response.getReturnValue();
                component.set('v.chartData', chartData);
                component.set('v.chartTitle', 'Account Revenue Chart');
            } else if (state === 'ERROR') {
                console.error(
                    'Error loading chart data: ' +
                        response.getError()[0].message
                );
                // Set fallback data
                var fallbackData = [{ label: 'Error Loading Data', value: 0 }];
                component.set('v.chartData', fallbackData);
                component.set('v.chartTitle', 'Error - No Data Available');
            }
            component.set('v.isLoading', false);
        });

        $A.enqueueAction(getChartDataAction);
    }
});
