global class NavigationLinkSetPickList extends VisualEditor.DynamicPickList {
    global override VisualEditor.DataRow getDefaultValue() {
        return null;
    }

    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows picklistValues = new VisualEditor.DynamicPickListRows();
        List<NavigationLinkSet> navigationLinkSetList = [
            SELECT MasterLabel, DeveloperName, NetworkId
            FROM NavigationLinkSet
            WHERE IsDeleted = FALSE
        ];
        Map<Id, Network> networks = new Map<Id, Network>(
            [SELECT Id, Name FROM Network]
        );

        for (NavigationLinkSet navigationLinkSet : navigationLinkSetList) {
            Network network = networks.get(navigationLinkSet.NetworkId);
            String label =
                navigationLinkSet.MasterLabel +
                '(' +
                network.Name +
                ')';
            VisualEditor.DataRow value = new VisualEditor.DataRow(
                label,
                navigationLinkSet.DeveloperName
            );
            picklistValues.addRow(value);
        }
        return picklistValues;
    }
}
