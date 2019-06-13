({
    handleRefresh: function(component, event) {
        $A.get('e.force:refreshView').fire();
    }
});
