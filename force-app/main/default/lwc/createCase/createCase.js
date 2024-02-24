import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import CASE_OBJECT from '@salesforce/schema/Case';
import SUBJECT from '@salesforce/schema/Case.Subject';
import DESCRIPTION from '@salesforce/schema/Case.Description';
import PRIORITY from '@salesforce/schema/Case.Priority';
import REASON from '@salesforce/schema/Case.Reason';

const TITLE_SUCCESS = 'Case Created!';
const MESSAGE_SUCCESS = 'You have successfully created a Case';

export default class CreateCase extends LightningElement {
    caseObject = CASE_OBJECT;
    subjectField = SUBJECT;
    descriptionField = DESCRIPTION;
    priorityField = PRIORITY;
    reasonField = REASON;

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
