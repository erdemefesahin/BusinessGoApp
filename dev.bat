@echo off
REM ===============================================================
REM Business GO App - Development Launcher
REM ===============================================================
REM This script provides a user-friendly interface to launch
REM the appropriate development tools for Business GO App.

echo.
echo ========== Business GO App - Development Launcher ==========
echo.
echo This script helps you quickly start development for Android or iOS.
echo.

:menu
echo Please select a platform:
echo.
echo [1] Android Development
echo [2] iOS Development
echo [3] View Documentation
echo [4] Exit
echo.

set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" goto android
if "%choice%"=="2" goto ios
if "%choice%"=="3" goto docs
if "%choice%"=="4" goto end

echo Invalid choice. Please try again.
goto menu

:android
cls
echo.
echo ========== Android Development ==========
echo.
echo Please select an action:
echo.
echo [1] Run on Android emulator
echo [2] Run on Android device
echo [3] Build Android app
echo [4] Clean Android project
echo [5] Troubleshoot Android environment
echo [6] Advanced options (launch PowerShell script)
echo [7] Back to main menu
echo.

set /p android_choice=Enter your choice (1-7): 

if "%android_choice%"=="1" (
    powershell -ExecutionPolicy Bypass -File .\android-dev.ps1 run
    goto end
)
if "%android_choice%"=="2" (
    powershell -ExecutionPolicy Bypass -File .\android-dev.ps1 device
    goto end
)
if "%android_choice%"=="3" (
    powershell -ExecutionPolicy Bypass -File .\android-dev.ps1 build
    goto end
)
if "%android_choice%"=="4" (
    powershell -ExecutionPolicy Bypass -File .\android-dev.ps1 clean
    goto end
)
if "%android_choice%"=="5" (
    powershell -ExecutionPolicy Bypass -File .\android-dev.ps1 troubleshoot
    goto end
)
if "%android_choice%"=="6" (
    powershell -ExecutionPolicy Bypass -File .\android-dev.ps1 help
    powershell -ExecutionPolicy Bypass -NoExit -Command "Write-Host 'Run commands with: .\android-dev.ps1 [command] [options]' -ForegroundColor Yellow"
    goto end
)
if "%android_choice%"=="7" (
    cls
    goto menu
)

echo Invalid choice. Please try again.
goto android

:ios
cls
echo.
echo ========== iOS Development ==========
echo.
echo Please select an action:
echo.
echo [1] Run on iOS simulator
echo [2] Run on iOS device
echo [3] Build iOS app
echo [4] Clean iOS project
echo [5] Update CocoaPods
echo [6] Troubleshoot iOS environment
echo [7] Advanced options (launch PowerShell script)
echo [8] Back to main menu
echo.

set /p ios_choice=Enter your choice (1-8): 

if "%ios_choice%"=="1" (
    powershell -ExecutionPolicy Bypass -File .\ios-dev.ps1 run
    goto end
)
if "%ios_choice%"=="2" (
    powershell -ExecutionPolicy Bypass -File .\ios-dev.ps1 device
    goto end
)
if "%ios_choice%"=="3" (
    powershell -ExecutionPolicy Bypass -File .\ios-dev.ps1 build
    goto end
)
if "%ios_choice%"=="4" (
    powershell -ExecutionPolicy Bypass -File .\ios-dev.ps1 clean
    goto end
)
if "%ios_choice%"=="5" (
    powershell -ExecutionPolicy Bypass -File .\ios-dev.ps1 pods
    goto end
)
if "%ios_choice%"=="6" (
    powershell -ExecutionPolicy Bypass -File .\ios-dev.ps1 troubleshoot
    goto end
)
if "%ios_choice%"=="7" (
    powershell -ExecutionPolicy Bypass -File .\ios-dev.ps1 help
    powershell -ExecutionPolicy Bypass -NoExit -Command "Write-Host 'Run commands with: .\ios-dev.ps1 [command] [options]' -ForegroundColor Yellow"
    goto end
)
if "%ios_choice%"=="8" (
    cls
    goto menu
)

echo Invalid choice. Please try again.
goto ios

:docs
cls
echo.
echo ========== Documentation ==========
echo.
echo Please select a document to open:
echo.
echo [1] Development Workflow (Overview)
echo [2] Android Workflow
echo [3] iOS Workflow
echo [4] Android Setup Guide
echo [5] Project README
echo [6] Back to main menu
echo.

set /p docs_choice=Enter your choice (1-6): 

if "%docs_choice%"=="1" (
    start "" "DEVELOPMENT_WORKFLOW.md"
    goto docs
)
if "%docs_choice%"=="2" (
    start "" "ANDROID_WORKFLOW.md"
    goto docs
)
if "%docs_choice%"=="3" (
    start "" "IOS_WORKFLOW.md"
    goto docs
)
if "%docs_choice%"=="4" (
    start "" "ANDROID_SETUP.md"
    goto docs
)
if "%docs_choice%"=="5" (
    start "" "README.md"
    goto docs
)
if "%docs_choice%"=="6" (
    cls
    goto menu
)

echo Invalid choice. Please try again.
goto docs

:end
echo.
echo Thank you for using Business GO App Development Launcher!
echo.
pause
