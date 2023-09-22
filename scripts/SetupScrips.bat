cmd /c sf project deploy start -d force-app
cmd /c sf org assign permset -n ebikes
cmd /c sf data tree import -p ./data/sample-data-plan.json
cmd /c sf community publish -n E-Bikes
cmd /c sf project deploy start --metadata-dir=guest-profile-metadata -w 10
cmd /c sf org open