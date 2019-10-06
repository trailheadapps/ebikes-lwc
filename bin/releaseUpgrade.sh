#!/bin/bash

sfdx force:project:upgrade -f
sfdx muenzpraeger:source:api:set
sfdx force:org:create -a ebikes-release-test -s -f config/project-scratch-def.json -d 7
sfdx force:source:push
sfdx force:user:permset:assign -n ebikes
sfdx force:data:tree:import --plan ./data/sample-data-plan.json
sfdx force:mdapi:deploy -u ebikes --deploydir mdapiDeploy/unpackaged -w 1
sfdx force:apex:test:run
sfdx force:org:open -p /lightning/page/home
echo "Org is set up"
