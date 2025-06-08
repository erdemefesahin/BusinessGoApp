# Business GO App - Complete Android Deployment Script
# This script provides a comprehensive deployment workflow
# for running BusinessGoApp on an Android emulator

param (
    [Parameter(Position = 0)]
    [ValidateSet("emulator", "device")]
    [string]$Target = "emulator",
    
    [Parameter(Position = 1)]
    [ValidateSet("debug", "release")]
    [string]$BuildType = "debug",
    
    [switch]$CleanCache = $true,
    [switch]$ResetMetroCache = $false,
    [switch]$Verbose = $false
)

# ===== STYLING AND UTILITIES =====
function Write-Header {
    param([string]$Text)
    Write-Host "`n=========== $Text ===========" -ForegroundColor Cyan
}

function Write-StepHeader {
    param([string]$Text)
    Write-Host "`nâ¤ $Text" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Text)
    Write-Host "âœ“ $Text" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Text)
    Write-Host "! $Text" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Text)
    Write-Host "âœ• $Text" -ForegroundColor Red
}

function Write-Info {
    param([string]$Text)
    if ($Verbose) {
        Write-Host "  $Text" -ForegroundColor White
    }
}

function Write-Command {
    param([string]$Text)
    Write-Host "  > $Text" -ForegroundColor DarkGray
}

function Stop-OnError {
    param(
        [string]$ErrorMessage,
        [switch]$Retry = $false
    )
    
    Write-Error $ErrorMessage
    
    if ($Retry) {
        $continue = Read-Host "Would you like to retry? (y/n)"
        if ($continue -eq "y") {
            return $false
        }
    }
    
    Write-Host "`nDeployment failed. Please check the errors above." -ForegroundColor Red
    exit 1
}

# ===== MAIN FUNCTIONS =====

function Initialize-Environment {
    Write-Header "Environment Setup"
    
    # Find Java Home
    Write-StepHeader "Checking Java installation"
    
    $javaInstallPaths = @(
        "${env:ProgramFiles}\Java\jdk*",
        "${env:ProgramFiles(x86)}\Java\jdk*",
        "${env:LOCALAPPDATA}\Android\Sdk\jdk*",
        "C:\Program Files\Android\Android Studio\jbr",
        "C:\Program Files\Android\Android Studio\jre"
    )
    
    $javaPath = $null
    
    if ($env:JAVA_HOME -and (Test-Path $env:JAVA_HOME)) {
        $javaPath = $env:JAVA_HOME
    } else {
        foreach ($path in $javaInstallPaths) {
            $possiblePaths = Resolve-Path -Path $path -ErrorAction SilentlyContinue
            if ($possiblePaths) {
                $javaPath = $possiblePaths | Sort-Object -Property FullName -Descending | Select-Object -First 1
                break
            }
        }
        
        if ($javaPath) {
            $env:JAVA_HOME = $javaPath.Path
            $env:Path = "$env:JAVA_HOME\bin;$env:Path"
        }
    }
    
    if (-not $javaPath) {
        Stop-OnError -ErrorMessage "Java not found. Please install JDK or set JAVA_HOME manually." -Retry
    }
    
    Write-Success "Found Java at: $env:JAVA_HOME"
    
    # Find Android SDK
    Write-StepHeader "Checking Android SDK"
    
    $androidSdkPaths = @(
        "$env:LOCALAPPDATA\Android\Sdk",
        "${env:ProgramFiles(x86)}\Android\android-sdk",
        "${env:ProgramFiles}\Android\android-sdk",
        "C:\Android\android-sdk"
    )
    
    $sdkPath = $null
    
    if ($env:ANDROID_HOME -and (Test-Path $env:ANDROID_HOME)) {
        $sdkPath = $env:ANDROID_HOME
    } else {
        foreach ($path in $androidSdkPaths) {
            if (Test-Path -Path $path) {
                $sdkPath = $path
                break
            }
        }
        
        if ($sdkPath) {
            $env:ANDROID_HOME = $sdkPath
            $env:Path = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:ANDROID_HOME\emulator;$env:Path"
        }
    }
    
    if (-not $sdkPath) {
        Stop-OnError -ErrorMessage "Android SDK not found. Please install Android Studio or set ANDROID_HOME manually." -Retry
    }
    
    Write-Success "Found Android SDK at: $env:ANDROID_HOME"
    
    # Check project structure
    Write-StepHeader "Checking project structure"
    
    if (-not (Test-Path "$PSScriptRoot\package.json")) {
        Stop-OnError -ErrorMessage "No package.json found. Are you in the correct project directory?" -Retry
    }
    
    if (-not (Test-Path "$PSScriptRoot\android")) {
        Stop-OnError -ErrorMessage "No android directory found. This doesn't appear to be a React Native project." -Retry
    }
    
    Write-Success "Project structure verified"
    
    # Check for node_modules
    if (-not (Test-Path "$PSScriptRoot\node_modules")) {
        Write-Warning "node_modules directory not found. Installing dependencies..."
        try {
            npm install
        } catch {
            Stop-OnError -ErrorMessage "Failed to install dependencies. Please run 'npm install' manually." -Retry
        }
    }
}

function Clear-ProjectCaches {
    if ($CleanCache) {
        Write-Header "Cleaning Project Caches"
        
        # Stop any running processes
        Write-StepHeader "Stopping any running React Native processes"
        
        $reactNativeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "react-native" }
        foreach ($process in $reactNativeProcesses) {
            try {
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                Write-Info "Stopped process: $($process.Id)"
            } catch {
                Write-Warning "Could not stop process $($process.Id). It may be needed by another application."
            }
        }
        
        # Clean Android build folders
        Write-StepHeader "Cleaning Android build folders"
        
        $foldersToClean = @(
            "$PSScriptRoot\android\app\build",
            "$PSScriptRoot\android\.gradle"
        )
        
        foreach ($folder in $foldersToClean) {
            if (Test-Path -Path $folder) {
                try {
                    Remove-Item -Recurse -Force $folder -ErrorAction Stop
                    Write-Success "Cleaned: $folder"
                } catch {
                    Write-Warning "Could not clean $folder completely. Some files may be locked."
                    # Don't exit, just continue with partial clean
                }
            }
        }
        
        # Clean Gradle cache (optional - more aggressive cleaning)
        # If you're having persistent build problems, uncomment this
        # Write-StepHeader "Cleaning Gradle global cache"
        # $gradleCachePath = "$env:USERPROFILE\.gradle\caches"
        # if (Test-Path -Path $gradleCachePath) {
        #    Remove-Item -Path "$gradleCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
        # }
        
        # Clean watchman cache if available
        $watchman = Get-Command watchman -ErrorAction SilentlyContinue
        if ($watchman) {
            Write-StepHeader "Cleaning Watchman cache"
            & watchman watch-del-all
        }
        
        Write-Success "Cache cleaning complete"
    } else {
        Write-Info "Cache cleaning skipped (use -CleanCache to enable)"
    }
}

function Start-DeviceOrEmulator {
    if ($Target -eq "emulator") {
        Write-Header "Starting Android Emulator"
        
        # Get available emulators
        $emulators = & "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds 2>$null
        
        if ($emulators.Count -eq 0) {
            Stop-OnError -ErrorMessage "No emulators found. Please create one using Android Studio." -Retry
            return $false
        }
        
        # Use the first emulator
        $emulatorName = $emulators[0]
        Write-StepHeader "Starting emulator: $emulatorName"
        
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
            # Start the emulator
            Start-Process -FilePath "$env:ANDROID_HOME\emulator\emulator.exe" -ArgumentList "-avd", $emulatorName, "-no-boot-anim" -NoNewWindow
            
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
        } else {
            Write-Success "Using already running emulator"
        }
    } else {
        Write-Header "Connecting to Physical Device"
        
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
        } else {
            Write-Warning "No physical devices connected"
            Write-Info "Please connect an Android device via USB and ensure:"
            Write-Info "  1. USB debugging is enabled in Developer options"
            Write-Info "  2. You've authorized the computer on your device"
            
            Write-Info "Waiting for device connection..."
            & "$env:ANDROID_HOME\platform-tools\adb.exe" wait-for-device
            
            # Check again after waiting
            $devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>$null
            $deviceList = $devices | Where-Object { $_ -match "\tdevice$" }
            
            if ($deviceList.Count -gt 0) {
                Write-Success "Device connected!"
            } else {
                Stop-OnError -ErrorMessage "Failed to connect to a physical device. Please check your USB connection and device settings." -Retry
                return $false
            }
        }
    }
    
    return $true
}

function Start-MetroBundlerBackground {
    Write-Header "Starting Metro Bundler"
    
    # Determine if we should reset the cache
    $metroArgs = "react-native start"
    if ($ResetMetroCache) {
        $metroArgs += " --reset-cache"
        Write-Info "Metro cache will be reset"
    }
    
    # Start Metro bundler in a new window
    Write-StepHeader "Starting Metro bundler in a new window"
    Write-Info "Command: npx $metroArgs"
    Start-Process powershell -ArgumentList "-Command", "cd '$PSScriptRoot'; npx $metroArgs" -WindowStyle Normal
    
    # Give Metro a moment to start
    Write-Info "Waiting for Metro to initialize..."
    Start-Sleep -Seconds 5
    Write-Success "Metro bundler started"
}

function Build-AndInstallApp {
    Write-Header "Building and Installing the App"
    
    # Build command with options
    $buildCommand = "npx react-native run-android"
    
    if ($BuildType -eq "release") {
        $buildCommand += " --variant=release"
    }
    
    # Execute the build
    Write-StepHeader "Building and installing the app ($BuildType mode)"
    Write-Info "Command: $buildCommand"
    
    $buildOutput = Invoke-Expression $buildCommand 2>&1
    
    # Check for build failures
    $buildFailed = $LASTEXITCODE -ne 0
    $gradleError = $buildOutput -match "FAILURE: Build failed"
    $javaError = $buildOutput -match "Unable to make field"
    $installError = $buildOutput -match "Could not install"
    $bundleError = $buildOutput -match "Failed to create bundle"
    
    if ($buildFailed -or $gradleError -or $javaError -or $installError -or $bundleError) {
        # Common errors and solutions
        if ($bundleError) {
            Write-Error "Metro bundler error detected. Check for JavaScript syntax errors."
            Write-Info "Possible solutions:"
            Write-Info "1. Check your JavaScript code for syntax errors"
            Write-Info "2. Restart Metro with cache reset: npx react-native start --reset-cache"
        }
        elseif ($gradleError) {
            Write-Error "Gradle build error detected."
            Write-Info "Possible solutions:"
            Write-Info "1. Clean project: .\deploy-android.ps1 -CleanCache"
            Write-Info "2. Check android/build.gradle and android/app/build.gradle for errors"
            Write-Info "3. Update Gradle in android/gradle/wrapper/gradle-wrapper.properties"
        }
        elseif ($javaError) {
            Write-Error "Java compatibility error detected."
            Write-Info "Possible solutions:"
            Write-Info "1. Make sure Java 11 is being used (check JAVA_HOME)"
            Write-Info "2. Clean project caches: .\deploy-android.ps1 -CleanCache"
        }
        elseif ($installError) {
            Write-Error "App installation error detected."
            Write-Info "Possible solutions:"
            Write-Info "1. Check if the app is already running (try closing it first)"
            Write-Info "2. Uninstall the app manually and try again"
            Write-Info "3. Check device storage space"
        }
        
        $retryBuild = Read-Host "Would you like to retry the build with cache reset? (y/n)"
        if ($retryBuild -eq "y") {
            Write-Info "Restarting build with clean caches..."
            return $false
        } else {
            Stop-OnError -ErrorMessage "Build and installation failed." -Retry:$false
            return $false
        }
    }
    
    Write-Success "App built and installed successfully!"
    return $true
}

function Launch-App {
    Write-Header "Launching the App"
    
    # Get the package name and main activity
    $packageName = "com.businessgoapp" # Default package name, adjust if needed
    $mainActivity = ".MainActivity"     # Default main activity, adjust if needed
    
    # Launch the app
    Write-StepHeader "Starting the app on the device"
    & "$env:ANDROID_HOME\platform-tools\adb.exe" shell am start -n "$packageName/$packageName$mainActivity"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "App launched successfully!"
    } else {
        Write-Warning "Failed to launch the app automatically."
        Write-Info "You may need to open the app manually on your device."
    }
}

function Show-DeviceLogs {
    Write-Header "Showing App Logs (press Ctrl+C to stop)"
    Start-Sleep -Seconds 2
    & "$env:ANDROID_HOME\platform-tools\adb.exe" logcat *:E ReactNative:V ReactNativeJS:V
}

# ===== MAIN EXECUTION FLOW =====

Write-Header "Business GO App - Android Deployment Script"

# Step 1: Initialize environment
Initialize-Environment

# Step 2: Clean caches if requested
Clear-ProjectCaches

# Step 3: Start emulator or connect to device
$deviceReady = Start-DeviceOrEmulator
if (-not $deviceReady) {
    Stop-OnError -ErrorMessage "Device setup failed." -Retry
}

# Step 4: Start Metro bundler
Start-MetroBundlerBackground

# Step 5: Build and install the app
$buildSuccess = Build-AndInstallApp
if (-not $buildSuccess) {
    # If the initial build fails, try once more with clean caches
    $CleanCache = $true
    $ResetMetroCache = $true
    Clear-ProjectCaches
    $buildSuccess = Build-AndInstallApp
    
    if (-not $buildSuccess) {
        Stop-OnError -ErrorMessage "Build failed after retry. Please check build errors." -Retry:$false
    }
}

# Step 6: Launch the app
Launch-App

# Final step: Show logs
$showLogs = Read-Host "Would you like to see the app logs? (y/n)"
if ($showLogs -eq "y") {
    Show-DeviceLogs
}

Write-Header "Deployment Complete!"
Write-Host "The Business GO App should now be running on your device." -ForegroundColor Cyan
Write-Host "If you encounter any issues, you can run this script again with different options:" -ForegroundColor White
Write-Host "  - .\deploy-android.ps1 -CleanCache       (to clean all caches)" -ForegroundColor White
Write-Host "  - .\deploy-android.ps1 -ResetMetroCache  (to reset JS bundler)" -ForegroundColor White
Write-Host "  - .\deploy-android.ps1 -Target device    (to use a physical device)" -ForegroundColor White
Write-Host "  - .\deploy-android.ps1 -BuildType release (to build release version)" -ForegroundColor White
Write-Host "`nHappy coding! ğŸš€" -ForegroundColor Green
