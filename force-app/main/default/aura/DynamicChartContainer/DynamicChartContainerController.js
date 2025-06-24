({
    init: function (component, event, helper) {
        helper.loadChartData(component);
    },

    switchToBarChart: function (component, event, helper) {
        component.set('v.chartType', 'bar');
        component.set('v.chartTitle', 'Account Revenue - Bar Chart');
    },

    switchToPieChart: function (component, event, helper) {
        component.set('v.chartType', 'pie');
        component.set('v.chartTitle', 'Account Revenue - Pie Chart');
    },

    switchToLineChart: function (component, event, helper) {
        component.set('v.chartType', 'line');
        component.set('v.chartTitle', 'Account Revenue - Line Chart');
    },

    refreshData: function (component, event, helper) {
        helper.loadChartData(component);
    }
});
