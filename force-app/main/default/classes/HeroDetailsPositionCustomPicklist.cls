global class HeroDetailsPositionCustomPicklist extends VisualEditor.DynamicPickList {
    global override VisualEditor.DataRow getDefaultValue() {
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow(
            'Right',
            'right'
        );
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DataRow value1 = new VisualEditor.DataRow('Left', 'left');
        VisualEditor.DataRow value2 = new VisualEditor.DataRow(
            'Right',
            'right'
        );
        VisualEditor.DynamicPickListRows myValues = new VisualEditor.DynamicPickListRows();
        myValues.addRow(value1);
        myValues.addRow(value2);
        return myValues;
    }
}
