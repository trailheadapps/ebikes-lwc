/**
 * An apex page controller that takes the user to the right start page based on credentials or lack thereof
 */
@IsTest public with sharing class CommunitiesSelfRegConfirmControllerTest {
    @IsTest(SeeAllData=true) public static void testCommunitiesSelfRegConfirmController() {
        // Instantiate a new controller with all parameters in the page
        CommunitiesSelfRegConfirmController controller = new CommunitiesSelfRegConfirmController();
      }    
}