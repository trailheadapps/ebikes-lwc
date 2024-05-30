trigger AccTrigg on Account (before insert,before update)
{
    if((Trigger.isBefore) && (Trigger.isInsert || Trigger.isUpdate))
    {
        for(Account acc : Trigger.New)
        {
            if(acc.Industry =='Healthcare' || acc.Industry == 'Banking')
            {
                acc.Rating = 'Hot';
            }
        }
    }
}