({
    viewBikePart: function(component, event, helper) {
        // Get the bike part of the whatever component called this function
        var bikePart = event
            .getSource()
            .get('v.title')
            .replace('View', '');
        helper.sendMsgToLCC({ bikePart: bikePart });
    }
});
