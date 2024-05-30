trigger CreateAccTrigg on Contact (after insert) 
{
    if((Trigger.isAfter) && (Trigger.isInsert))
    {
        List<Account> accList = new List<Account>();
        for(Contact c : Trigger.New)
        {
            if(c.AccountId == null)
            {
                Account acc = new Account();
                acc.Name = c.LastName;
                acc.Phone=c.Phone;
                acc.Name=c.OwnerId;
                accList.add(acc);
                
            }
        }
        if(accList!=null)
        {
            insert accList;
        }
    }
}