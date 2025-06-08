# ===============================================================
# Business GO App - iOS Development Automation Script
# ===============================================================
#
# This script simplifies iOS development for the Business GO App
# with automated tools for setup, building, and deployment.
#
# Features:
# - CocoaPods and dependency management
# - iOS Simulator management
# - Xcode build configuration
# - Development and production profiles
# - Automatic certificates handling
# - App Store submission preparation

param (
    [Parameter(Position = 0)]
    [ValidateSet("setup", "run", "build", "clean", "pods", "simulator", "archive", "device", "troubleshoot", "help")]
    [string]$Command = "help",
    
    [Parameter(Position = 1)]
    [ValidateSet("debug", "release")]
    [string]$BuildMode = "debug",
    
    [switch]$ResetCache,
    [switch]$Verbose,
    [string]$Simulator
)

# ===== CONFIGURATION =====
$SCRIPT_VERSION = "1.0.0"
$APP_NAME = "Business GO App"
$DEFAULT_SIMULATOR = "iPhone 15 Pro"
$TEAM_ID = "XXXXXXXXXX" # Replace with your Apple Developer Team ID

# ===== STYLING =====
function Write-Header {
    param([string]$Text)
    Write-Host "`n============ $Text ============`n" -ForegroundColor Magenta
}

function Write-StepHeader {
    param([string]$Text)
    Write-Host "`n➤ $Text" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Text)
    Write-Host "✓ $Text" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Text)
    Write-Host "! $Text" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Text)
    Write-Host "✕ $Text" -ForegroundColor Red
}

function Write-Info {
    param([string]$Text)
    if ($Verbose) {
        Write-Host "  $Text" -ForegroundColor Cyan
    }
}

function Write-Command {
    param([string]$Text)
    Write-Host "  > $Text" -ForegroundColor DarkGray
}

# ===== UTILITY FUNCTIONS =====

function Test-Command {
    param([string]$Command)
    $installed = Get-Command $Command -ErrorAction SilentlyContinue
    return $null -ne $installed
}

function Install-HomeBrew {
    Write-StepHeader "Installing Homebrew"
    
    if (-not (Test-Command "brew")) {
        Write-Warning "Homebrew not found. Installing..."
        
        # Check if WSL is available (for Windows)
        $wslAvailable = $false
        try {
            $wslCheck = wsl --list --verbose
            $wslAvailable = $true
        } catch {
            $wslAvailable = $false
        }
        
        if ($wslAvailable) {
            Write-Info "WSL found. You can install Homebrew in WSL with:"
            Write-Command "wsl -e /bin/bash -c `"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)`""
        } else {
            Write-Error "This script requires macOS or WSL to manage iOS development."
            Write-Info "If you're using Windows, please install WSL or run this script on a Mac."
            Write-Info "Visit https://docs.microsoft.com/en-us/windows/wsl/install for WSL installation."
            exit 1
        }
    } else {
        Write-Success "Homebrew is installed"
    }
}

function Install-CocoaPods {
    Write-StepHeader "Setting up CocoaPods"
    
    if (-not (Test-Command "pod")) {
        Write-Warning "CocoaPods not found. Installing..."
        
        # Install with Homebrew for macOS
        if (Test-Command "brew") {
            & brew install cocoapods
        } else {
            # Try with gem if Homebrew is not available
            if (Test-Command "gem") {
                & sudo gem install cocoapods
            } else {
                Write-Error "Neither Homebrew nor Ruby Gem found. Cannot install CocoaPods."
                exit 1
            }
        }
    }
    
    if (Test-Command "pod") {
        Write-Success "CocoaPods is installed"
    } else {
        Write-Error "Failed to install CocoaPods"
        exit 1
    }
}

function Update-Pods {
    Write-StepHeader "Updating CocoaPods dependencies"
    
    if (-not (Test-Path "$PSScriptRoot/ios/Podfile")) {
        Write-Error "No Podfile found in ios directory"
        exit 1
    }
    
    Push-Location "$PSScriptRoot/ios"
    
    # Check for Podfile.lock to determine if we need to install or update
    if (-not (Test-Path "Podfile.lock")) {
        Write-Info "Installing pods for the first time"
        & pod install
    } else {
        Write-Info "Updating existing pods"
        & pod update
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Pod installation/update failed"
    } else {
        Write-Success "Pods updated successfully"
    }
    
    Pop-Location
}

function List-Simulators {
    Write-StepHeader "Available iOS Simulators"
    
    if (Test-Command "xcrun") {
        $simulators = & xcrun simctl list devices available
        foreach ($line in $simulators) {
            if ($line -match "iPhone|iPad" -and $line -match "Booted|Shutdown") {
                Write-Host "  $line" -ForegroundColor Cyan
            }
        }
    } else {
        Write-Error "xcrun not found. Are you on macOS with Xcode installed?"
    }
}

function Start-Simulator {
    param(
        [string]$SimulatorName = $DEFAULT_SIMULATOR
    )
    
    Write-StepHeader "Starting iOS Simulator"
    
    if (-not (Test-Command "xcrun")) {
        Write-Error "xcrun not found. Are you on macOS with Xcode installed?"
        return $false
    }
    
    # Get available simulators
    $simulators = & xcrun simctl list devices available
    $simulatorId = $null
    
    # Find the simulator by name
    foreach ($line in $simulators) {
        if ($line -match $SimulatorName -and $line -match "\(([\w\-]+)\)") {
            $simulatorId = $Matches[1]
            break
        }
    }
    
    if ($null -eq $simulatorId) {
        Write-Warning "Simulator '$SimulatorName' not found"
        List-Simulators
        return $false
    }
    
    # Boot the simulator
    Write-Info "Booting simulator: $SimulatorName ($simulatorId)"
    & xcrun simctl boot $simulatorId
    
    # Open Simulator app
    & open -a Simulator
    
    Write-Success "Simulator started"
    return $true
}

function Clean-Project {
    Write-StepHeader "Cleaning project"
    
    # Clean derived data
    $derivedDataPath = "~/Library/Developer/Xcode/DerivedData"
    if (Test-Path -Path $derivedDataPath) {
        Write-Info "Cleaning Xcode derived data"
        Remove-Item -Recurse -Force "$derivedDataPath/BusinessGoApp-*" -ErrorAction SilentlyContinue
    }
    
    # Clean iOS build folder
    if (Test-Path "$PSScriptRoot/ios/build") {
        Write-Info "Cleaning iOS build folder"
        Remove-Item -Recurse -Force "$PSScriptRoot/ios/build" -ErrorAction SilentlyContinue
    }
    
    # Clean pod caches if needed
    if ($ResetCache -and (Test-Path "$PSScriptRoot/ios/Pods")) {
        Write-Info "Cleaning Pods directory"
        Remove-Item -Recurse -Force "$PSScriptRoot/ios/Pods" -ErrorAction SilentlyContinue
        Remove-Item "$PSScriptRoot/ios/Podfile.lock" -ErrorAction SilentlyContinue
    }
    
    # Clean node_modules if needed
    if ($ResetCache -and (Test-Path "$PSScriptRoot/node_modules")) {
        Write-Info "Cleaning node_modules"
        Remove-Item -Recurse -Force "$PSScriptRoot/node_modules" -ErrorAction SilentlyContinue
    }
    
    Write-Success "Project cleaned successfully"
}

function Start-MetroBundler {
    param (
        [switch]$ResetCache = $ResetCache
    )
    
    Write-StepHeader "Starting Metro bundler"
    
    $metroArgs = "react-native start"
    if ($ResetCache) {
        $metroArgs += " --reset-cache"
        Write-Info "Metro cache will be reset"
    }
    
    # Start Metro bundler in a new window
    Write-Info "Starting Metro bundler in a new window"
    Start-Process powershell -ArgumentList "-Command", "cd '$PSScriptRoot'; npx $metroArgs" -WindowStyle Normal
    
    # Give it a moment to start
    Start-Sleep -Seconds 3
}

function Build-IosApp {
    param(
        [string]$Mode = $BuildMode,
        [string]$SimulatorName = $DEFAULT_SIMULATOR
    )
    
    Write-StepHeader "Building iOS app ($Mode mode)"
    
    if (-not (Test-Command "xcodebuild")) {
        Write-Error "xcodebuild not found. Are you on macOS with Xcode installed?"
        return $false
    }
    
    # Ensure pods are installed
    Update-Pods
    
    # Build configuration based on mode
    $configuration = if ($Mode -eq "release") { "Release" } else { "Debug" }
    
    # Get available simulators
    $simulators = & xcrun simctl list devices available
    $simulatorId = $null
    
    # Find the simulator by name
    foreach ($line in $simulators) {
        if ($line -match $SimulatorName -and $line -match "\(([\w\-]+)\)") {
            $simulatorId = $Matches[1]
            break
        }
    }
    
    if ($null -eq $simulatorId) {
        Write-Warning "Simulator '$SimulatorName' not found, using default destination"
        $destination = "-destination 'platform=iOS Simulator,name=$DEFAULT_SIMULATOR'"
    } else {
        $destination = "-destination 'platform=iOS Simulator,id=$simulatorId'"
    }
    
    # Build the app
    Push-Location "$PSScriptRoot/ios"
    
    Write-Info "Building with configuration: $configuration"
    & xcodebuild -workspace BusinessGoApp.xcworkspace -scheme BusinessGoApp -configuration $configuration $destination clean build
    
    $buildSuccess = $LASTEXITCODE -eq 0
    Pop-Location
    
    if ($buildSuccess) {
        Write-Success "Build completed successfully"
    } else {
        Write-Error "Build failed with exit code $LASTEXITCODE"
    }
    
    return $buildSuccess
}

function Archive-IosApp {
    Write-StepHeader "Creating iOS archive for App Store"
    
    if (-not (Test-Command "xcodebuild")) {
        Write-Error "xcodebuild not found. Are you on macOS with Xcode installed?"
        return $false
    }
    
    # Ensure pods are installed
    Update-Pods
    
    # Archive the app
    Push-Location "$PSScriptRoot/ios"
    
    $archivePath = "$PSScriptRoot/ios/build/BusinessGoApp.xcarchive"
    Write-Info "Creating archive at: $archivePath"
    & xcodebuild -workspace BusinessGoApp.xcworkspace -scheme BusinessGoApp -configuration Release -archivePath $archivePath archive
    
    $archiveSuccess = $LASTEXITCODE -eq 0
    
    if ($archiveSuccess) {
        Write-Success "Archive created successfully"
        
        # Export the archive to IPA
        $exportPath = "$PSScriptRoot/ios/build/Export"
        Write-Info "Exporting IPA to: $exportPath"
        
        # Create export options plist
        $exportOptionsPath = "$PSScriptRoot/ios/build/ExportOptions.plist"
        @"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>$TEAM_ID</string>
</dict>
</plist>
"@ | Set-Content -Path $exportOptionsPath
        
        & xcodebuild -exportArchive -archivePath $archivePath -exportPath $exportPath -exportOptionsPlist $exportOptionsPath
        
        $exportSuccess = $LASTEXITCODE -eq 0
        if ($exportSuccess) {
            Write-Success "App exported successfully for App Store submission"
            Write-Info "IPA file location: $exportPath/BusinessGoApp.ipa"
        } else {
            Write-Error "Export failed with exit code $LASTEXITCODE"
        }
    } else {
        Write-Error "Archive failed with exit code $LASTEXITCODE"
    }
    
    Pop-Location
    return $archiveSuccess
}

function Run-IosApp {
    param(
        [string]$SimulatorName = $DEFAULT_SIMULATOR
    )
    
    Write-StepHeader "Running iOS app"
    
    # Start Metro bundler
    Start-MetroBundler -ResetCache:$ResetCache
    
    # Run on simulator
    Start-Simulator -SimulatorName $SimulatorName
    
    # Run the app
    Write-Info "Building and running the app"
    & npx react-native run-ios --simulator="$SimulatorName"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "App launched successfully"
    } else {
        Write-Error "App launch failed with exit code $LASTEXITCODE"
    }
}

function Run-IosDevice {
    Write-StepHeader "Running on iOS device"
    
    # Start Metro bundler
    Start-MetroBundler -ResetCache:$ResetCache
    
    # Check for connected devices
    if (Test-Command "xcrun") {
        $devices = & xcrun xctrace list devices
        $hasConnected = $false
        
        foreach ($line in $devices) {
            if ($line -match "iPhone|iPad" -and $line -match "\(\d+\.\d+\)" -and -not ($line -match "Simulator")) {
                $hasConnected = $true
                Write-Info "Found device: $line"
            }
        }
        
        if (-not $hasConnected) {
            Write-Error "No iOS devices connected"
            Write-Info "Please connect an iOS device and ensure it's trusted"
            return $false
        }
        
        # Run the app on the device
        Write-Info "Building and running on connected device"
        & npx react-native run-ios --device
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "App launched successfully on device"
        } else {
            Write-Error "App launch failed with exit code $LASTEXITCODE"
        }
    } else {
        Write-Error "xcrun not found. Are you on macOS with Xcode installed?"
        return $false
    }
}

function Troubleshoot-Environment {
    Write-Header "iOS Development Environment Troubleshooting"
    
    # Check for Xcode
    if (Test-Command "xcodebuild") {
        $xcodeVersion = & xcodebuild -version
        Write-Success "Xcode is installed: $($xcodeVersion[0])"
    } else {
        Write-Error "Xcode not found. Please install Xcode from the Mac App Store"
    }
    
    # Check for CocoaPods
    if (Test-Command "pod") {
        $podVersion = & pod --version
        Write-Success "CocoaPods is installed: v$podVersion"
    } else {
        Write-Error "CocoaPods not found. Please run this script with the 'setup' command"
    }
    
    # Check for Node.js
    if (Test-Command "node") {
        $nodeVersion = & node --version
        Write-Success "Node.js is installed: $nodeVersion"
    } else {
        Write-Error "Node.js not found. Please install Node.js from https://nodejs.org/"
    }
    
    # Check for Watchman
    if (Test-Command "watchman") {
        $watchmanVersion = & watchman --version
        Write-Success "Watchman is installed: v$watchmanVersion"
    } else {
        Write-Warning "Watchman not found. It's recommended for React Native development"
        Write-Info "Install with: brew install watchman"
    }
    
    # Check iOS project structure
    if (Test-Path "$PSScriptRoot/ios/BusinessGoApp.xcworkspace") {
        Write-Success "iOS workspace found"
    } else {
        if (Test-Path "$PSScriptRoot/ios/BusinessGoApp.xcodeproj") {
            Write-Warning "Xcode project found, but workspace is missing. Run 'pod install' in the iOS directory"
        } else {
            Write-Error "iOS project files not found"
        }
    }
    
    # Check Ruby version (needed for CocoaPods)
    if (Test-Command "ruby") {
        $rubyVersion = & ruby --version
        Write-Success "Ruby is installed: $($rubyVersion)"
    } else {
        Write-Error "Ruby not found. It's required for CocoaPods"
    }
    
    # Show iOS simulators
    Write-Info "iOS Simulators:"
    if (Test-Command "xcrun") {
        $simulators = & xcrun simctl list devices available | Select-String "iPhone|iPad"
        $simulators | ForEach-Object {
            Write-Info "  $_"
        }
    } else {
        Write-Error "Cannot list simulators - xcrun not found"
    }
    
    Write-Header "Troubleshooting Tips"
    
    Write-Host "Common issues and solutions:" -ForegroundColor Yellow
    Write-Host "  1. 'Command PhaseScriptExecution failed' - Try cleaning the project with '$PSScriptRoot/ios-dev.ps1 clean'" -ForegroundColor White
    Write-Host "  2. Pod installation fails - Try updating CocoaPods with 'sudo gem install cocoapods'" -ForegroundColor White
    Write-Host "  3. App doesn't build - Ensure Xcode is updated to the latest version" -ForegroundColor White
    Write-Host "  4. Metro bundler issues - Try restarting with reset cache option" -ForegroundColor White
    Write-Host "  5. Missing dependencies - Run 'npm install' in the project root" -ForegroundColor White
}

function Show-Help {
    $host.UI.RawUI.ForegroundColor = "Cyan"
    Write-Host "`n========== Business GO App - iOS Development Script v$SCRIPT_VERSION ==========`n"
    $host.UI.RawUI.ForegroundColor = "White"
    
    Write-Host "Usage: .\ios-dev.ps1 [command] [options]`n"
    
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  setup        - Configure your iOS development environment"
    Write-Host "  run          - Run the app on an iOS simulator (default command)"
    Write-Host "  build        - Build the app without running (default: debug build)"
    Write-Host "  clean        - Clean project caches and build files"
    Write-Host "  pods         - Update CocoaPods dependencies"
    Write-Host "  simulator    - List and start iOS simulators"
    Write-Host "  archive      - Create an archive for App Store submission"
    Write-Host "  device       - Run the app on a connected iOS device"
    Write-Host "  troubleshoot - Run diagnostics on your environment"
    Write-Host "  help         - Show this help information"
    
    Write-Host "`nOptions:" -ForegroundColor Yellow
    Write-Host "  -BuildMode    - Specify 'debug' or 'release' (default: debug)"
    Write-Host "  -ResetCache   - Reset Metro bundler and pod caches"
    Write-Host "  -Simulator    - Specify the simulator to use (e.g. 'iPhone 15 Pro')"
    Write-Host "  -Verbose      - Show detailed information during execution"
    
    Write-Host "`nExamples:" -ForegroundColor Yellow
    Write-Host "  .\ios-dev.ps1 run"
    Write-Host "  .\ios-dev.ps1 run -Simulator 'iPhone 14'"
    Write-Host "  .\ios-dev.ps1 build -BuildMode release"
    Write-Host "  .\ios-dev.ps1 clean -ResetCache"
    Write-Host "  .\ios-dev.ps1 device"
    
    Write-Host "`nNote: This script requires macOS for full functionality.`n" -ForegroundColor Yellow
}

# ===== MAIN SCRIPT =====

# Show header
$host.UI.RawUI.ForegroundColor = "Cyan"
Write-Host "`n========== $APP_NAME - iOS Development Script v$SCRIPT_VERSION ==========`n"
$host.UI.RawUI.ForegroundColor = "White"

# Process commands
switch ($Command) {
    "setup" {
        Install-HomeBrew
        Install-CocoaPods
        Update-Pods
        Write-Success "iOS development environment setup complete!"
    }
    
    "run" {
        Run-IosApp -SimulatorName $Simulator
    }
    
    "build" {
        Build-IosApp -Mode $BuildMode -SimulatorName $Simulator
    }
    
    "clean" {
        Clean-Project
    }
    
    "pods" {
        Install-CocoaPods
        Update-Pods
    }
    
    "simulator" {
        if ($Simulator) {
            Start-Simulator -SimulatorName $Simulator
        } else {
            List-Simulators
            $selectedSimulator = Read-Host "`nEnter simulator name to start (or press Enter for default)"
            if ([string]::IsNullOrEmpty($selectedSimulator)) {
                $selectedSimulator = $DEFAULT_SIMULATOR
            }
            Start-Simulator -SimulatorName $selectedSimulator
        }
    }
    
    "archive" {
        Archive-IosApp
    }
    
    "device" {
        Run-IosDevice
    }
    
    "troubleshoot" {
        Troubleshoot-Environment
    }
    
    "help" {
        Show-Help
    }
    
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
    }
}

Write-Host "`nDone!`n" -ForegroundColor Cyan
