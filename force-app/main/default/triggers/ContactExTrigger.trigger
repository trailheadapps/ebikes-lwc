trigger ContactExTrigger on Contact (before insert,before update)
{
    if((Trigger.isBefore) && (Trigger.isInsert ) || (Trigger.isUpdate))
    {
        for(Contact c : Trigger.New)
        {
            if(c.AccountId == null)
            {
                c.AccountId.addError('Please select Account Name ');
            }
        }
    }
}