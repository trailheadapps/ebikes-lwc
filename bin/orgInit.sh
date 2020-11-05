#!/bin/bash

DURATION=7

if [ "$#" -eq 1 ]; then
  DURATION=$1
fi

sfdx force:org:delete -p -u ebikes
sfdx force:org:create -a ebikes -s -f config/project-scratch-def.json -d $DURATION && \
sfdx force:source:push && \
sfdx force:user:permset:assign -n ebikes && \
sfdx force:user:permset:assign -n Walkthroughs && \
sfdx force:data:tree:import --plan ./data/sample-data-plan.json && \
echo "Sleeping 30s for Community deployment" && \
sleep 30 && \
sfdx force:community:publish -n E-Bikes && \
sfdx force:org:open -p /lightning/page/home && \
echo "Org is set up"