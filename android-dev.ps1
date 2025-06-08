# ===============================================================
# Business GO App - Advanced Android Development Automation Script
# ===============================================================
#
# This script provides a comprehensive development workflow for the Business GO App
# on Android, including setup, troubleshooting, building, and deployment options.
#
# Features:
# - Environment auto-detection and configuration
# - Multiple AVD (emulator) management
# - Gradle caching and optimization
# - Development, testing, and production build options
# - Bundle creation and signing for release
# - Auto-reconnect for physical devices

param (
    [Parameter(Position = 0)]
    [ValidateSet("setup", "run", "build", "bundle", "clean", "device", "emulator", "troubleshoot", "logs", "help")]
    [string]$Command = "help",
    
    [Parameter(Position = 1)]
    [ValidateSet("debug", "release", "all")]
    [string]$BuildType = "debug",
    
    [switch]$ResetCache,
    [switch]$NoAnimation,
    [switch]$Verbose
)

# ===== CONFIGURATION =====
$SCRIPT_VERSION = "1.0.0"
$APP_NAME = "Business GO App"
$RELEASE_KEYSTORE_PATH = "$PSScriptRoot\android\app\business-go.keystore"
$DEFAULT_EMULATOR = "Pixel_6_API_33"  # Set your preferred default emulator here

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

function Find-JavaHome {
    Write-StepHeader "Finding Java installation"
    
    $javaInstallPaths = @(
        "${env:ProgramFiles}\Java\jdk*",
        "${env:ProgramFiles(x86)}\Java\jdk*",
        "${env:LOCALAPPDATA}\Android\Sdk\jdk*",
        "C:\Program Files\Android\Android Studio\jbr",
        "C:\Program Files\Android\Android Studio\jre"
    )

    $javaPath = $null
    
    # First check if JAVA_HOME is already set and valid
    if ($env:JAVA_HOME -and (Test-Path $env:JAVA_HOME)) {
        $javaPath = $env:JAVA_HOME
        Write-Info "Using existing JAVA_HOME: $javaPath"
        return $javaPath
    }
    
    # Otherwise search common locations
    foreach ($path in $javaInstallPaths) {
        $possiblePaths = Resolve-Path -Path $path -ErrorAction SilentlyContinue
        if ($possiblePaths) {
            # Get the most recent Java version if multiple are found
            $javaPath = $possiblePaths | Sort-Object -Property FullName -Descending | Select-Object -First 1
            break
        }
    }

    if ($javaPath) {
        $env:JAVA_HOME = $javaPath.Path
        $env:Path = "$env:JAVA_HOME\bin;$env:Path"
        Write-Success "JAVA_HOME set to: $env:JAVA_HOME"
        Write-Info "To permanently set this path, run:"
        Write-Command "[System.Environment]::SetEnvironmentVariable('JAVA_HOME', '$($env:JAVA_HOME)', 'Machine')"
    } else {
        Write-Error "Couldn't find Java installation. Please install JDK or specify JAVA_HOME manually."
        Write-Info "Download JDK from: https://adoptium.net/"
        exit 1
    }
    
    return $env:JAVA_HOME
}

function Find-AndroidHome {
    Write-StepHeader "Finding Android SDK"
    
    $androidSdkPaths = @(
        "$env:LOCALAPPDATA\Android\Sdk",
        "${env:ProgramFiles(x86)}\Android\android-sdk",
        "${env:ProgramFiles}\Android\android-sdk",
        "C:\Android\android-sdk"
    )

    $sdkPath = $null
    
    # First check if ANDROID_HOME is already set and valid
    if ($env:ANDROID_HOME -and (Test-Path $env:ANDROID_HOME)) {
        $sdkPath = $env:ANDROID_HOME
        Write-Info "Using existing ANDROID_HOME: $sdkPath"
        return $sdkPath
    }
    
    # Otherwise search common locations
    foreach ($path in $androidSdkPaths) {
        if (Test-Path -Path $path) {
            $sdkPath = $path
            break
        }
    }

    if ($sdkPath) {
        $env:ANDROID_HOME = $sdkPath
        $env:Path = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:ANDROID_HOME\emulator;$env:Path"
        Write-Success "ANDROID_HOME set to: $env:ANDROID_HOME"
        Write-Info "To permanently set this path, run:"
        Write-Command "[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', '$($env:ANDROID_HOME)', 'Machine')"
    } else {
        Write-Error "Couldn't find Android SDK. Please install Android Studio or specify ANDROID_HOME manually."
        Write-Info "Download Android Studio from: https://developer.android.com/studio"
        exit 1
    }
    
    return $env:ANDROID_HOME
}

function Test-ProjectStructure {
    Write-StepHeader "Checking project structure"
    
    if (-not (Test-Path "$PSScriptRoot\package.json")) {
        Write-Error "No package.json found. Are you in the right project directory?"
        exit 1
    }
    
    if (-not (Test-Path "$PSScriptRoot\android")) {
        Write-Error "No android directory found. This doesn't appear to be a React Native project."
        exit 1
    }
    
    Write-Success "Project structure looks good"
    
    # Check for node_modules
    if (-not (Test-Path "$PSScriptRoot\node_modules")) {
        Write-Warning "node_modules directory not found. Installing dependencies..."
        npm install
    }
}

function Get-AvailableEmulators {
    $emulators = & "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds 2>$null
    return $emulators
}

function Start-Emulator {
    param (
        [string]$EmulatorName = $DEFAULT_EMULATOR,
        [switch]$NoAnimation = $NoAnimation
    )
    
    Write-StepHeader "Starting Android emulator"
    
    # Get list of available emulators
    $emulators = Get-AvailableEmulators
    
    if ($emulators.Count -eq 0) {
        Write-Error "No emulators found. Please create one using Android Studio."
        Write-Info "To create an emulator: Open Android Studio > Tools > AVD Manager > Create Virtual Device"
        return $false
    }
    
    # If specified emulator doesn't exist, use first available
    if ($EmulatorName -and -not ($emulators -contains $EmulatorName)) {
        Write-Warning "Specified emulator '$EmulatorName' not found"
        $EmulatorName = $emulators[0]
    } else {
        # Default to the first emulator if none specified
        if (-not $EmulatorName) {
            $EmulatorName = $emulators[0]
        }
    }
    
    Write-Info "Available emulators:"
    foreach ($emulator in $emulators) {
        if ($emulator -eq $EmulatorName) {
            Write-Info "  * $emulator (selected)"
        } else {
            Write-Info "  - $emulator"
        }
    }
    
    # Check if emulator is already running
    $runningDevices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>$null
    $emulatorRunning = $false
    foreach ($line in $runningDevices) {
        if ($line -match "emulator-") {
            $emulatorRunning = $true
            Write-Info "An emulator is already running"
            break
        }
    }
    
    if (-not $emulatorRunning) {
        # Build arguments list
        $emulatorArgs = @("-avd", $EmulatorName)
        if ($NoAnimation) {
            $emulatorArgs += "-no-boot-anim"
        }
        
        Write-Info "Starting emulator: $EmulatorName"
        Start-Process -FilePath "$env:ANDROID_HOME\emulator\emulator.exe" -ArgumentList $emulatorArgs -NoNewWindow
        
        # Wait for emulator to boot
        Write-Info "Waiting for emulator to boot (this may take a minute)..."
        $booted = $false
        $attempts = 0
        $maxAttempts = 30
        
        while (-not $booted -and $attempts -lt $maxAttempts) {
            $bootCheck = & "$env:ANDROID_HOME\platform-tools\adb.exe" shell getprop sys.boot_completed 2>$null
            if ($bootCheck -eq "1") {
                $booted = $true
            } else {
                Start-Sleep -Seconds 2
                $attempts++
                Write-Host "." -NoNewline -ForegroundColor Yellow
            }
        }
        
        Write-Host ""
        
        if ($booted) {
            Write-Success "Emulator is ready"
        } else {
            Write-Warning "Emulator boot timeout. Continuing anyway..."
        }
    }
    
    return $true
}

function Clean-Project {
    Write-StepHeader "Cleaning project"
    
    # Stop any running React Native packager
    $reactNativeProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "react-native" }
    if ($reactNativeProcess) {
        Write-Info "Stopping React Native packager"
        Stop-Process -Id $reactNativeProcess.Id -Force
    }
    
    # Clean Android build folders
    Write-Info "Cleaning Android build folders"
    Remove-Item -Recurse -Force "$PSScriptRoot\android\app\build" -ErrorAction SilentlyContinue
    
    # Clean project Gradle cache
    Write-Info "Cleaning project Gradle cache"
    Remove-Item -Recurse -Force "$PSScriptRoot\android\.gradle" -ErrorAction SilentlyContinue
    
    # Clean watchman cache if available
    $watchman = Get-Command watchman -ErrorAction SilentlyContinue
    if ($watchman) {
        Write-Info "Cleaning Watchman cache"
        & watchman watch-del-all
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

function Build-AndroidApp {
    param (
        [ValidateSet("debug", "release")]
        [string]$BuildType = "debug"
    )
    
    Write-StepHeader "Building Android app ($BuildType)"
    
    if ($BuildType -eq "release" -and -not (Test-Path $RELEASE_KEYSTORE_PATH)) {
        Write-Warning "Release keystore not found at $RELEASE_KEYSTORE_PATH"
        $createKeystore = Read-Host "Would you like to create a new keystore for signing? (y/n)"
        
        if ($createKeystore -eq "y") {
            Create-Keystore
        } else {
            Write-Error "Cannot build release without a keystore. Aborting."
            return $false
        }
    }
    
    # Build the app
    $gradleCommand = ".\gradlew"
    $gradleTask = "app:assemble$($BuildType.ToUpper()[0] + $BuildType.Substring(1))"
    
    Push-Location "$PSScriptRoot\android"
    Write-Info "Running Gradle task: $gradleTask"
    & $gradleCommand $gradleTask
    $buildSuccess = $LASTEXITCODE -eq 0
    Pop-Location
    
    if ($buildSuccess) {
        Write-Success "Build completed successfully"
        
        # Show APK location
        $apkDir = "$PSScriptRoot\android\app\build\outputs\apk\$BuildType"
        $apkPath = Get-ChildItem -Path $apkDir -Filter "*.apk" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        
        if ($apkPath) {
            Write-Info "APK created at: $($apkPath.FullName)"
            Write-Info "You can install it on a device with:"
            Write-Command "adb install -r `"$($apkPath.FullName)`""
        }
    } else {
        Write-Error "Build failed with exit code $LASTEXITCODE"
    }
    
    return $buildSuccess
}

function Create-Keystore {
    Write-StepHeader "Creating a new keystore for app signing"
    
    $keystoreDir = Split-Path -Parent $RELEASE_KEYSTORE_PATH
    if (-not (Test-Path $keystoreDir)) {
        New-Item -ItemType Directory -Path $keystoreDir -Force | Out-Null
    }
    
    Write-Info "We'll create a keystore for signing your app"
    $keystoreAlias = Read-Host "Enter keystore alias (e.g., 'business-go-key')"
    $keystorePassword = Read-Host "Enter keystore password" -AsSecureString
    $passwordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($keystorePassword))
    
    # Create keystore using keytool
    $keytoolArgs = "-genkeypair -v -keystore `"$RELEASE_KEYSTORE_PATH`" -alias $keystoreAlias -keyalg RSA -keysize 2048 -validity 10000 -storepass $passwordText -keypass $passwordText"
    & keytool $keytoolArgs
    
    if (Test-Path $RELEASE_KEYSTORE_PATH) {
        Write-Success "Keystore created successfully at $RELEASE_KEYSTORE_PATH"
        
        # Add keystore config to gradle.properties
        $gradlePropsPath = "$PSScriptRoot\android\gradle.properties"
        $gradleProps = Get-Content $gradlePropsPath -ErrorAction SilentlyContinue
        
        # Check if keystore props are already there
        $hasKeystoreProps = $gradleProps -match "MYAPP_RELEASE_STORE_FILE"
        
        if (-not $hasKeystoreProps) {
            Write-Info "Adding keystore configuration to gradle.properties"
            
            $keystoreConfig = @"

# Keystore configuration
MYAPP_RELEASE_STORE_FILE=business-go.keystore
MYAPP_RELEASE_KEY_ALIAS=$keystoreAlias
MYAPP_RELEASE_STORE_PASSWORD=$passwordText
MYAPP_RELEASE_KEY_PASSWORD=$passwordText
"@
            
            Add-Content $gradlePropsPath $keystoreConfig
        }
        
        # Update build.gradle
        $buildGradlePath = "$PSScriptRoot\android\app\build.gradle"
        $buildGradle = Get-Content $buildGradlePath -Raw
        
        if (-not ($buildGradle -match "signingConfigs.release")) {
            Write-Info "Updating build.gradle with signing configuration"
            
            # Find the android { block and add signingConfigs
            if ($buildGradle -match "android\s*{") {
                $signingConfig = @"
    signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
"@
                
                $buildGradle = $buildGradle -replace "(android\s*{)", "`$1`n$signingConfig"
                
                # Find the buildTypes block and update release config
                $buildGradle = $buildGradle -replace "(release\s*{[^}]*)(signingConfig\s+signingConfigs\.debug)?([^}]*})", "`$1signingConfig signingConfigs.release`$3"
                
                Set-Content $buildGradlePath $buildGradle
            }
        }
        
        return $true
    } else {
        Write-Error "Failed to create keystore"
        return $false
    }
}

function Bundle-AndroidApp {
    Write-StepHeader "Creating Android bundle for Play Store"
    
    if (-not (Test-Path $RELEASE_KEYSTORE_PATH)) {
        Write-Error "Release keystore not found at $RELEASE_KEYSTORE_PATH"
        $createKeystore = Read-Host "Would you like to create a new keystore for signing? (y/n)"
        
        if ($createKeystore -eq "y") {
            Create-Keystore
        } else {
            Write-Error "Cannot create bundle without a keystore. Aborting."
            return $false
        }
    }
    
    # Create the bundle
    Push-Location "$PSScriptRoot\android"
    Write-Info "Running Gradle task: bundleRelease"
    & .\gradlew bundleRelease
    $bundleSuccess = $LASTEXITCODE -eq 0
    Pop-Location
    
    if ($bundleSuccess) {
        Write-Success "Bundle created successfully"
        
        # Show Bundle location
        $bundlePath = "$PSScriptRoot\android\app\build\outputs\bundle\release\app-release.aab"
        
        if (Test-Path $bundlePath) {
            Write-Info "AAB Bundle created at: $bundlePath"
            Write-Info "You can upload this file to the Google Play Console"
        }
    } else {
        Write-Error "Bundle creation failed with exit code $LASTEXITCODE"
    }
    
    return $bundleSuccess
}

function Display-DeviceLogs {
    Write-StepHeader "Displaying device logs"
    
    Write-Info "Press Ctrl+C to stop displaying logs"
    Start-Sleep -Seconds 1
    
    & "$env:ANDROID_HOME\platform-tools\adb.exe" logcat *:E ReactNative:V ReactNativeJS:V
}

function Connect-PhysicalDevice {
    Write-StepHeader "Connecting to physical device"
    
    # Check for connected devices
    $devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>$null
    
    # Filter actual devices (remove empty lines and header)
    $deviceList = $devices | Where-Object { $_ -match "\tdevice$" }
    
    if ($deviceList.Count -gt 0) {
        Write-Success "Physical device(s) connected:"
        foreach ($device in $deviceList) {
            $deviceId = ($device -split "\t")[0]
            $deviceModel = & "$env:ANDROID_HOME\platform-tools\adb.exe" -s $deviceId shell getprop ro.product.model 2>$null
            Write-Info "  - $deviceModel ($deviceId)"
        }
        
        return $true
    } else {
        Write-Warning "No physical devices connected"
        Write-Info "Please connect an Android device via USB and ensure:"
        Write-Info "  1. USB debugging is enabled in Developer options"
        Write-Info "  2. You've authorized the computer on your device"
        
        # Offer to wait for device
        $waitForDevice = Read-Host "Would you like to wait for a device to be connected? (y/n)"
        
        if ($waitForDevice -eq "y") {
            Write-Info "Waiting for device. Please connect your Android device..."
            & "$env:ANDROID_HOME\platform-tools\adb.exe" wait-for-device
            
            # Check again after waiting
            $devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>$null
            $deviceList = $devices | Where-Object { $_ -match "\tdevice$" }
            
            if ($deviceList.Count -gt 0) {
                Write-Success "Device connected!"
                return $true
            } else {
                Write-Error "Still no device connected. Please try again later."
                return $false
            }
        }
        
        return $false
    }
}

function Run-OnDevice {
    param (
        [switch]$UseEmulator = $true,
        [switch]$ResetCache = $ResetCache
    )
    
    Write-StepHeader "Running app on Android device"
    
    # Start Metro bundler
    Start-MetroBundler -ResetCache:$ResetCache
    
    # Build and launch the app
    if ($UseEmulator) {
        $deviceReady = Start-Emulator -NoAnimation:$NoAnimation
    } else {
        $deviceReady = Connect-PhysicalDevice
    }
    
    if ($deviceReady) {
        # Run the app
        Write-Info "Installing and launching the app"
        & npx react-native run-android
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "App launched successfully"
        } else {
            Write-Error "App launch failed with exit code $LASTEXITCODE"
        }
    } else {
        Write-Error "No device available to run the app"
        return $false
    }
    
    return $true
}

function Show-Help {
    $host.UI.RawUI.ForegroundColor = "Cyan"
    Write-Host "`n========== Business GO App - Android Development Script v$SCRIPT_VERSION ==========`n"
    $host.UI.RawUI.ForegroundColor = "White"
    
    Write-Host "Usage: .\android-dev.ps1 [command] [options]`n"
    
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  setup        - Configure your development environment"
    Write-Host "  run          - Run the app on an emulator (default command)"
    Write-Host "  device       - Run the app on a connected physical device"
    Write-Host "  build        - Build the app (default: debug build)"
    Write-Host "  bundle       - Create a release bundle for Play Store"
    Write-Host "  clean        - Clean project caches and build files"
    Write-Host "  emulator     - List and start Android emulators"
    Write-Host "  logs         - Show device logs"
    Write-Host "  troubleshoot - Run diagnostics on your environment"
    Write-Host "  help         - Show this help information"
    
    Write-Host "`nOptions:" -ForegroundColor Yellow
    Write-Host "  -BuildType    - Specify 'debug' or 'release' (default: debug)"
    Write-Host "  -ResetCache   - Reset Metro bundler cache"
    Write-Host "  -NoAnimation  - Disable boot animation when starting emulator"
    Write-Host "  -Verbose      - Show detailed information during execution"
    
    Write-Host "`nExamples:" -ForegroundColor Yellow
    Write-Host "  .\android-dev.ps1 run"
    Write-Host "  .\android-dev.ps1 build -BuildType release"
    Write-Host "  .\android-dev.ps1 clean"
    Write-Host "  .\android-dev.ps1 device -ResetCache"
    
    Write-Host ""
}

# ===== MAIN SCRIPT =====

# Show header
$host.UI.RawUI.ForegroundColor = "Cyan"
Write-Host "`n========== $APP_NAME - Android Development Script v$SCRIPT_VERSION ==========`n"
$host.UI.RawUI.ForegroundColor = "White"

# Process commands
switch ($Command) {
    "setup" {
        Find-JavaHome
        Find-AndroidHome
        Test-ProjectStructure
        Write-Success "Environment setup complete!"
    }
    
    "run" {
        Find-JavaHome | Out-Null
        Find-AndroidHome | Out-Null
        Test-ProjectStructure
        Run-OnDevice -UseEmulator -ResetCache:$ResetCache
    }
    
    "build" {
        Find-JavaHome | Out-Null
        Find-AndroidHome | Out-Null
        Test-ProjectStructure
        Build-AndroidApp -BuildType $BuildType
    }
    
    "bundle" {
        Find-JavaHome | Out-Null
        Find-AndroidHome | Out-Null
        Test-ProjectStructure
        Bundle-AndroidApp
    }
    
    "clean" {
        Find-JavaHome | Out-Null
        Find-AndroidHome | Out-Null
        Test-ProjectStructure
        Clean-Project
    }
    
    "device" {
        Find-JavaHome | Out-Null
        Find-AndroidHome | Out-Null
        Test-ProjectStructure
        Run-OnDevice -UseEmulator:$false -ResetCache:$ResetCache
    }
    
    "emulator" {
        Find-AndroidHome | Out-Null
        
        $emulators = Get-AvailableEmulators
        
        if ($emulators.Count -gt 0) {
            Write-StepHeader "Available emulators:"
            foreach ($emulator in $emulators) {
                Write-Host "  - $emulator"
            }
            
            $selectedEmulator = Read-Host "`nEnter emulator name to start (or press Enter for default)"
            if ([string]::IsNullOrEmpty($selectedEmulator)) {
                $selectedEmulator = $emulators[0]
            }
            
            Start-Emulator -EmulatorName $selectedEmulator -NoAnimation:$NoAnimation
        } else {
            Write-Error "No emulators found. Please create one using Android Studio."
        }
    }
    
    "logs" {
        Find-AndroidHome | Out-Null
        Display-DeviceLogs
    }
    
    "troubleshoot" {
        # Run the dedicated troubleshooting script
        & "$PSScriptRoot\troubleshoot-android.ps1"
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
