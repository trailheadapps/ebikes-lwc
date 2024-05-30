trigger PreventDupConTrigger on Contact (before insert,before update) 
{
    if(Trigger.isBefore || Trigger.isUpdate || Trigger.isInsert)
    {
        
    
    for(Contact c : Trigger.New)
    {
	Integer recordsCount = [Select Count() FROM Contact where Name =: c.Name];
    if(recordsCount>0)
    {
        c.addError('Duplicate Contact Name Found Try Different Name');
    }
    }
    }
        
}