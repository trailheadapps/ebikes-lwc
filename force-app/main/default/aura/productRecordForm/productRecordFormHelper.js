({
    sendMsgToLCC: function(params) {
        var messageJsApp = $A.get('e.c:messageJsApp');
        messageJsApp.setParams(params);
        messageJsApp.fire();
    }
});
