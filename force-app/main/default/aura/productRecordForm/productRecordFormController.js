({
    onChange: function(component, event, helper) {
        // Get component that called the change event and its color value
        var cmp = event.getSource();
        var color = cmp.get('v.value');

        // Submit the form to update Salesforce CRM of the change
        component.find('editForm').submit();

        // Tell LCC to update app with the color of the bike part that changed
        helper.sendMsgToLCC({ bikePart: cmp.getLocalId(), color: color });
    }
});
