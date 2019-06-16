({
    handleChange: function(component, event) {
        var bikePart = event.getParam('bikePart');
        var color = event.getParam('color');

        if (color) {
            var changeColorMsg = {
                name: 'change-color',
                value: {
                    detail: {
                        meshName: bikePart,
                        color: color
                    }
                }
            };
            component.find('jsApp').message(changeColorMsg);
        }
        var moveCameraMsg = {
            name: 'move-camera',
            value: {
                detail: bikePart
            }
        };
        component.find('jsApp').message(moveCameraMsg);
    }
});
