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
sf org delete scratch -p -o $ORG_ALIAS &> /dev/null
echo ""

echo "Creating scratch org..." && \
sf org create scratch -f config/project-scratch-def.json -a $ORG_ALIAS -d -y 30 && \
echo "" && \

echo "Pushing source..." && \
sf project deploy start && \
echo "" && \

echo "Assigning permission sets..." && \
sf org assign permset -n ebikes && \
echo "" && \

echo "Importing sample data..." && \
sf data tree import -p data/sample-data-plan.json && \
echo "" && \

echo "Sleeping 30s for XP Cloud deployment..." && \
sleep 30 && \
echo "" && \

echo "Publishing XP Cloud site..." && \
sf community publish -n E-Bikes && \
echo "" && \

echo "Deploying guest profile for XP Cloud site..." && \
sf project deploy start --metadata-dir=guest-profile-metadata -w 10 && \
echo "" && \

echo "Opening org..." && \
sf org open -p lightning/n/Product_Explorer && \
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
