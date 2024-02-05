import { LightningElement } from 'lwc';
import Toast from 'lightning/toast';

import CASE_OBJECT from '@salesforce/schema/Case';
import SUBJECT from '@salesforce/schema/Case.Subject';
import DESCRIPTION from '@salesforce/schema/Case.Description';
import PRODUCT from '@salesforce/schema/Case.Product__c';
import PRIORITY from '@salesforce/schema/Case.Priority';
import CASE_CATEGORY from '@salesforce/schema/Case.Case_Category__c';
import REASON from '@salesforce/schema/Case.Reason';

const STATE_INITIAL = 'initial';
const STATE_SUCCESS = 'success';

export default class CreateCase extends LightningElement {
    caseObject = CASE_OBJECT;
    subjectField = SUBJECT;
    productField = PRODUCT;
    descriptionField = DESCRIPTION;
    priorityField = PRIORITY;
    reasonField = REASON;
    categoryField = CASE_CATEGORY;

    state = STATE_INITIAL;

    handleCaseCreated() {
        this.state = STATE_SUCCESS;
        Toast.show({
            label: 'Case Created',
            message: 'You have successfully created a case.',
            variant: 'success'
        });
    }

    get isInitialState() {
        return this.state === STATE_INITIAL;
    }
    get isSuccessState() {
        return this.state === STATE_SUCCESS;
    }
}
