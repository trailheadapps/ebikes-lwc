trigger AccAnnualRev on Account (before insert,before update)
{
    //if conditions for trigger
    if((Trigger.isBefore && Trigger.isInsert) || (Trigger.isUpdate)) 
    {
        for(Account acc : Trigger.New)
        {
            if(acc.Industry=='Banking')
            {
                acc.AnnualRevenue = 5000000;
            }
            else if(acc.Industry=='Finance')
            {
                acc.AnnualRevenue = 4000000;
            }
            else if(acc.Industry == 'Insurance')
            {
                acc.AnnualRevenue = 3500000;
          }
            else if(acc.Industry == 'Healthcare')
            {
                acc.AnnualRevenue = 2500000;
            }
            else{
                acc.AnnualRevenue = 500000;
            }
        }
    }
}