trigger ActiveDeleteTrigger on Account (before delete)
{
    if((Trigger.isBefore) && (Trigger.isDelete))
    {
        for(Account acc : Trigger.Old)
        {
            if(acc.Active__c=='Yes')
            {
                //add Error method for account deletion...
                
                acc.addError('Cannot Delete an Active Account');
            }
        }
    }
}