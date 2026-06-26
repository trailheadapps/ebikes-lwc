global with sharing class CreateAccountSyncMeetingTask {
    @InvocableMethod(
        label='Create Account Sync Meeting Task'
        description='Creates a task to prepare for an account sync meeting'
    )
    global static List<Result> createMeetingTask(List<Request> requests) {
        List<Result> results = new List<Result>();
        for (Request req : requests) {
            Result result = createMeetingTask(req);
            results.add(result);
        }
        return results;
    }

    private static Result createMeetingTask(Request req) {
        Result result = new Result();
        try {
            // Load the account with owner information
            Account acc = [
                SELECT Id, OwnerId, Name
                FROM Account
                WHERE Id = :req.accountId
                LIMIT 1
            ];

            // Get all open cases for this account
            List<Case> openCases = [
                SELECT Id, CaseNumber, Subject, ContactId
                FROM Case
                WHERE AccountId = :req.accountId AND IsClosed = FALSE
                ORDER BY CaseNumber
            ];

            // Validate we have open cases
            if (openCases.isEmpty()) {
                throw new CreateMeetingException(
                    'No open cases found for this account'
                );
            }

            // Extract contact IDs from open cases
            Set<Id> contactIds = new Set<Id>();
            for (Case c : openCases) {
                if (c.ContactId != null) {
                    contactIds.add(c.ContactId);
                }
            }

            // Validate we have contacts
            if (contactIds.isEmpty()) {
                throw new CreateMeetingException(
                    'No case contacts found for this account'
                );
            }

            // Get all case contacts for this account (only from open cases)
            List<Contact> caseContacts = [
                SELECT Id, Name, Email
                FROM Contact
                WHERE Id IN :contactIds
            ];

            // Select a random contact
            Integer randomIndex = (Integer) (Math.random() *
            caseContacts.size());
            Contact selectedContact = caseContacts[randomIndex];

            // Build open cases list for description
            String openCasesList = '';
            for (Case c : openCases) {
                openCasesList +=
                    '\n  - ' +
                    c.CaseNumber +
                    ': ' +
                    (c.Subject != null ? c.Subject : 'No subject');
            }

            // Calculate due date (one week from today)
            Date dueDate = Date.today().addDays(7);

            // Create the task
            Task meetingTask = new Task(
                Subject = 'Prepare for ' +
                    acc.Name +
                    ' meeting with ' +
                    selectedContact.Name,
                Description = 'Prepare for upcoming ' +
                    acc.Name +
                    ' meeting with: ' +
                    selectedContact.Name +
                    '\n\nReview open cases:' +
                    openCasesList,
                ActivityDate = dueDate,
                OwnerId = acc.OwnerId,
                WhatId = acc.Id,
                WhoId = selectedContact.Id,
                Status = 'Not Started',
                Priority = 'Normal'
            );

            insert meetingTask;

            result.success = true;
            result.taskId = meetingTask.Id;
            result.message =
                'Successfully created task for meeting with ' +
                selectedContact.Name;
        } catch (Exception e) {
            result.success = false;
            result.message = 'Error: ' + e.getMessage();
        }
        return result;
    }

    private class CreateMeetingException extends Exception {
    }

    global class Request {
        @InvocableVariable(
            label='Account Id'
            description='The Account Id to process'
            required=true
        )
        public Id accountId;
    }

    global class Result {
        @InvocableVariable(
            label='Success'
            description='Whether the operation was successful'
        )
        public Boolean success;

        @InvocableVariable(label='Task Id' description='The created Task Id')
        public Id taskId;

        @InvocableVariable(
            label='Message'
            description='Success or error message'
        )
        public String message;

        public Result() {
            this.success = false;
        }
    }
}
