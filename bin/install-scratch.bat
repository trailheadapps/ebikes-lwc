@echo OFF

rem Set parameters
set ORG_ALIAS=ebikes

@echo:
echo Installing E-Bikes scratch org (%ORG_ALIAS%)
@echo:

rem Install script
echo Cleaning previous scratch org...
cmd.exe /c sf org delete scratch -p -o %ORG_ALIAS% 2>NUL
@echo:

echo Creating scratch org...
cmd.exe /c sf org create scratch -f config/project-scratch-def.json -a %ORG_ALIAS% -d -y 30
call :checkForError
@echo:

echo Pushing source...
cmd.exe /c sf project deploy start
call :checkForError
@echo:

echo Assigning permission sets...
cmd.exe /c sf org assign permset -n ebikes
call :checkForError
@echo:
cd %CD%/..

echo Importing sample data...
cmd.exe /c sf data tree import -p data/sample-data-plan.json
call :checkForError
@echo:

echo Sleeping 30s for XP Cloud deployment...
timeout /T 30 /NOBREAK
@echo:

echo Publishing XP Cloud site...
cmd.exe /c sf community publish -n E-Bikes
call :checkForError
@echo:

echo Deploying guest profile for XP Cloud site...
cmd.exe /c sf project deploy start --metadata-dir=guest-profile-metadata -w 10
call :checkForError
@echo:

rem Report install success if no error
@echo:
if ["%errorlevel%"]==["0"] (
  echo Installation completed.
  @echo:
  cmd.exe /c sf org open -p lightning/n/Product_Explorer
)

:: ======== FN ======
GOTO :EOF

rem Display error if the install has failed
:checkForError
if NOT ["%errorlevel%"]==["0"] (
    echo Installation failed.
    exit /b %errorlevel%
)