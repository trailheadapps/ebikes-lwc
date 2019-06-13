#!/bin/bash

DURATION=7

if [ "$#" -eq 1 ]; then
  DURATION=$1
fi

sfdx force:org:create -a ebikes -s -f config/project-scratch-def.json -d $DURATION
sfdx force:source:push
sfdx force:user:permset:assign -n ebikes
sfdx force:data:tree:import --plan ./data/sample-data-plan.json
sfdx force:mdapi:deploy -u ebikes --deploydir mdapiDeploy/unpackaged -w 1
sfdx force:org:open -p /lightning/page/home
echo "Org is set up"