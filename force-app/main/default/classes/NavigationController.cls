/**
 * A basic controller for fetching navigation menu items
 */
global with sharing class NavigationController {
    /**
     * Retrieve the Experience Cloud navigation menu items
     */
    @AuraEnabled(cacheable=true)
    public static List<NavigationMenuItem> getNavigationMenuItems(
        String menuName
    ) {
        if (String.isEmpty(menuName)) {
            return new List<NavigationMenuItem>();
        }

        // Get network (site) Id
        String networkId = Network.getNetworkId();

        // Find the link set belonging to the navigation menuName and active networkId
        List<NavigationLinkSet> linkSets = [
            SELECT Id
            FROM NavigationLinkSet
            WHERE
                DeveloperName = :menuName
                AND NetworkId = :networkId
                AND IsDeleted = FALSE
        ];
        if (linkSets.size() != 1) {
            throw new NavigationException(
                'Failed to retrieve navigation menu.'
            );
        }

        Id linkSetId = linkSets.get(0).Id;

        // collect all the menu items belonging to the link set
        // published state is either Draft or Live
        return [
            SELECT
                Label,
                Target,
                Type,
                DefaultListViewId,
                AccessRestriction,
                ParentId,
                Position,
                Status,
                TargetPrefs
            FROM NavigationMenuItem
            WHERE NavigationLinkSetId = :linkSetId AND Status = 'Live'
            WITH SECURITY_ENFORCED
            ORDER BY Position
        ];
    }

    public class NavigationException extends Exception {
    }
}
