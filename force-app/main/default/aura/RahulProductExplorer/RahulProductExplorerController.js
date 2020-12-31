({
    handleProductSelected : function(component, event, helper) {
       
        component.set('v.selecttedProduct', event.getParam('productId'));
        console.log(component.get('v.selecttedProduct'));
    }
})
