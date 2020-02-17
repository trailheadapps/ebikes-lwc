import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import CASE_OBJECT from '@salesforce/schema/Case';
import SUBJECT from '@salesforce/schema/Case.Subject';
import DESCRIPTION from '@salesforce/schema/Case.Description';
import PRODUCT from '@salesforce/schema/Case.Product__c';
import PRIORITY from '@salesforce/schema/Case.Priority';
import CASE_CATEGORY from '@salesforce/schema/Case.Case_Category__c';
import REASON from '@salesforce/schema/Case.Reason';

const TITLE_SUCCESS = 'Case Created!';
const MESSAGE_SUCCESS = 'You have successfully created a Case';

export default class CreateCase extends LightningElement {
    caseObject = CASE_OBJECT;
    subjectField = SUBJECT;
    productField = PRODUCT;
    descriptionField = DESCRIPTION;
    priorityField = PRIORITY;
    reasonField = REASON;
    categoryField = CASE_CATEGORY;

    handleCaseCreated() {
        // Fire event for Toast to appear that Order was created
        const evt = new ShowToastEvent({
            title: TITLE_SUCCESS,
            message: MESSAGE_SUCCESS,
            variant: 'success'
        });
        this.dispatchEvent(evt);

        const refreshEvt = new CustomEvent('refresh');
        // Fire the custom event
        this.dispatchEvent(refreshEvt);
    }
}
