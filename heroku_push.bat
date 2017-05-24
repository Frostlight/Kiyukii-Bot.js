@ECHO off

for %%* in (.) do set CurrDirName=%%~nx*

REM If the current directory name isn't kiyukii-js (folder I use for heroku build, this shouldn't commit and run)
if "%CurrDirName%" == "kiyukii-js" (
    call git add -A
    call git commit -m "An update of unknown contents"
    call git push heroku master
) ELSE (
    echo This file must be run in kiyukii-js folder
)
pause