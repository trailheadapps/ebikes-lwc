trigger ContactTrigger on Contact (before insert,before update)
{   
    if(( Trigger.isBefore) && (Trigger.isInsert)  || (Trigger.isUpdate))
    {
        for(Contact c : Trigger.New)
        {
            if(c.Phone == 'null' || c.Phone== ' ')
            {
                c.Phone.addError('Phone Number Field is Mandatory ');
            }
            if(c.Email=='null' || c.Email == ' ')
            {
                c.Email.addError('Email Id Field is Mandatory');
            }
        }
    }
}