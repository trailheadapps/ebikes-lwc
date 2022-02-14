#!/bin/bash
SCRIPT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd $SCRIPT_PATH/..

# Set parameters
ORG_ALIAS="ebikes"

echo ""
echo "Installing E-Bikes scratch org ($ORG_ALIAS)"
echo ""

# Install script
echo "Cleaning previous scratch org..."
sfdx force:org:delete -p -u $ORG_ALIAS &> /dev/null
echo ""

echo "Creating scratch org..." && \
sfdx force:org:create -s -f config/project-scratch-def.json -d 30 -a $ORG_ALIAS && \
echo "" && \

echo "Pushing source..." && \
sfdx force:source:push && \
echo "" && \

echo "Assigning permission sets..." && \
sfdx force:user:permset:assign -n ebikes && \
echo "" && \

echo "Importing sample data..." && \
sfdx force:data:tree:import -p data/sample-data-plan.json && \
echo "" && \

echo "Sleeping 30s for XP Cloud deployment..." && \
sleep 30 && \
echo "" && \

echo "Publishing XP Cloud site..." && \
sfdx force:community:publish -n E-Bikes && \
echo "" && \

echo "Deploying guest profile for XP Cloud site..." && \
sfdx force:mdapi:deploy -d guest-profile-metadata -w 10 && \
echo "" && \

echo "Opening org..." && \
sfdx force:org:open -p lightning/n/Product_Explorer && \
echo ""

EXIT_CODE="$?"
echo ""

# Check exit code
echo ""
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "Installation completed."
else
    echo "Installation failed."
fi
exit $EXIT_CODE
