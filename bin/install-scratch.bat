@echo OFF

rem Set parameters
set ORG_ALIAS=ebikes

@echo:
echo Installing E-Bikes scratch org (%ORG_ALIAS%)
@echo:

rem Install script
echo Cleaning previous scratch org...
cmd.exe /c sfdx force:org:delete -p -u %ORG_ALIAS% 2>NUL
@echo:

echo Creating scratch org...
cmd.exe /c sfdx force:org:create -s -f config/project-scratch-def.json -d 30 -a %ORG_ALIAS%
call :checkForError
@echo:

echo Pushing source...
cmd.exe /c sfdx force:source:push
call :checkForError
@echo:

echo Assigning permission sets...
cmd.exe /c sfdx force:user:permset:assign -n ebikes
call :checkForError
@echo:
cd %CD%/..

echo Importing sample data...
cmd.exe /c sfdx force:data:tree:import -p data/sample-data-plan.json
call :checkForError
@echo:

echo Sleeping 30s for Community deployment...
timeout /T 30 /NOBREAK
@echo:

echo Publishing Community...
cmd.exe /c sfdx force:community:publish -n E-Bikes
call :checkForError
@echo:

rem Report install success if no error
@echo:
if ["%errorlevel%"]==["0"] (
  echo Installation completed.
  @echo:
  cmd.exe /c sfdx force:org:open -p lightning/n/Product_Explorer
)

:: ======== FN ======
GOTO :EOF

rem Display error if the install has failed
:checkForError
if NOT ["%errorlevel%"]==["0"] (
    echo Installation failed.
    exit /b %errorlevel%
)