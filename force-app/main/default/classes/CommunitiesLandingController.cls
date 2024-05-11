/**
 * An apex page controller that takes the user to the right start page based on credentials or lack thereof
 */
public with sharing class CommunitiesLandingController { // changes by me
    // Code we will invoke when page is loaded
    public PageReference forwardToStartPage() {
        return Network.communitiesLanding();
    }
//Empty method down here
    public CommunitiesLandingController()
     {
        //Empty method
    }
}