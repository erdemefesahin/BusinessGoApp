# Business GO App - Complete Android Deployment Script
# This script provides a comprehensive deployment workflow

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

$ErrorActionPreference = "Stop"

# Display header
Write-Host "`n=========== Business GO App - Android Deployment ===========`n" -ForegroundColor Cyan

# Step 1: Setup environment
Write-Host "`n> Setting up environment...`n" -ForegroundColor Yellow

# Find Java Home
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
    Write-Host "Error: Java not found. Please install JDK or set JAVA_HOME manually." -ForegroundColor Red
    exit 1
}

Write-Host "Found Java at: $env:JAVA_HOME" -ForegroundColor Green

# Find Android SDK
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
    Write-Host "Error: Android SDK not found. Please install Android Studio or set ANDROID_HOME manually." -ForegroundColor Red
    exit 1
}

Write-Host "Found Android SDK at: $env:ANDROID_HOME" -ForegroundColor Green

# Step 2: Clean caches if requested
if ($CleanCache) {
    Write-Host "`n> Cleaning project caches...`n" -ForegroundColor Yellow
    
    # Stop any running React Native packager
    $reactNativeProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "react-native" }
    if ($reactNativeProcess) {
        Write-Host "Stopping React Native packager" -ForegroundColor Gray
        Stop-Process -Id $reactNativeProcess.Id -Force
    }
    
    # Clean Android build folders
    if (Test-Path -Path "$PSScriptRoot\android\app\build") {
        Remove-Item -Recurse -Force "$PSScriptRoot\android\app\build" -ErrorAction SilentlyContinue
        Write-Host "Cleaned: android\app\build" -ForegroundColor Green
    }
    
    # Clean project Gradle cache
    if (Test-Path -Path "$PSScriptRoot\android\.gradle") {
        Remove-Item -Recurse -Force "$PSScriptRoot\android\.gradle" -ErrorAction SilentlyContinue
        Write-Host "Cleaned: android\.gradle" -ForegroundColor Green
    }
    
    # Clean watchman cache if available
    $watchman = Get-Command watchman -ErrorAction SilentlyContinue
    if ($watchman) {
        Write-Host "Cleaning Watchman cache" -ForegroundColor Gray
        & watchman watch-del-all
    }
    
    Write-Host "Cache cleaning complete" -ForegroundColor Green
}

# Step 3: Start emulator or check device
if ($Target -eq "emulator") {
    Write-Host "`n> Starting Android emulator...`n" -ForegroundColor Yellow
    
    # Get list of available emulators
    $emulators = & "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds 2>$null
    
    if ($emulators.Count -eq 0) {
        Write-Host "Error: No emulators found. Please create one using Android Studio." -ForegroundColor Red
        exit 1
    }
    
    # Use the first emulator
    $emulatorName = $emulators[0]
    Write-Host "Starting emulator: $emulatorName" -ForegroundColor Gray
    
    # Check if emulator is already running
    $runningDevices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>$null
    $emulatorRunning = $false
    foreach ($line in $runningDevices) {
        if ($line -match "emulator-") {
            $emulatorRunning = $true
            Write-Host "An emulator is already running" -ForegroundColor Gray
            break
        }
    }
    
    if (-not $emulatorRunning) {
        # Start emulator in background
        Start-Process -FilePath "$env:ANDROID_HOME\emulator\emulator.exe" -ArgumentList "-avd", $emulatorName, "-no-boot-anim" -NoNewWindow
        
        # Wait for emulator to boot
        Write-Host "Waiting for emulator to boot (this may take a minute)..." -ForegroundColor Gray
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
            Write-Host "Emulator is ready" -ForegroundColor Green
        } else {
            Write-Host "Warning: Emulator boot timeout. Continuing anyway..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Using already running emulator" -ForegroundColor Green
    }
} else {
    Write-Host "`n> Checking for physical device...`n" -ForegroundColor Yellow
    
    # Check for connected devices
    $devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>$null
    
    # Filter actual devices (remove empty lines and header)
    $deviceList = $devices | Where-Object { $_ -match "\tdevice$" }
    
    if ($deviceList.Count -gt 0) {
        Write-Host "Physical device(s) connected:" -ForegroundColor Green
        foreach ($device in $deviceList) {
            $deviceId = ($device -split "\t")[0]
            $deviceModel = & "$env:ANDROID_HOME\platform-tools\adb.exe" -s $deviceId shell getprop ro.product.model 2>$null
            Write-Host "- $deviceModel ($deviceId)" -ForegroundColor Gray
        }
    } else {
        Write-Host "Warning: No physical devices connected. Please connect a device and ensure USB debugging is enabled." -ForegroundColor Yellow
        Write-Host "Waiting for device connection..." -ForegroundColor Gray
        
        & "$env:ANDROID_HOME\platform-tools\adb.exe" wait-for-device
        
        $devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>$null
        $deviceList = $devices | Where-Object { $_ -match "\tdevice$" }
        
        if ($deviceList.Count -gt 0) {
            Write-Host "Device connected!" -ForegroundColor Green
        } else {
            Write-Host "Error: Failed to connect to a device." -ForegroundColor Red
            exit 1
        }
    }
}

# Step 4: Start Metro bundler
Write-Host "`n> Starting Metro bundler...`n" -ForegroundColor Yellow

$metroArgs = "react-native start"
if ($ResetMetroCache) {
    $metroArgs += " --reset-cache"
    Write-Host "Metro cache will be reset" -ForegroundColor Gray
}

Write-Host "Starting Metro in a new window" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-Command", "cd '$PSScriptRoot'; npx $metroArgs" -WindowStyle Normal

# Give Metro a moment to start
Write-Host "Waiting for Metro to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Step 5: Build and install the app
Write-Host "`n> Building and installing the app...`n" -ForegroundColor Yellow

$buildCommand = "npx react-native run-android"
if ($BuildType -eq "release") {
    $buildCommand += " --variant=release"
}

Write-Host "Running: $buildCommand" -ForegroundColor Gray
Invoke-Expression $buildCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "App built and installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Error: Build or installation failed with code $LASTEXITCODE" -ForegroundColor Red
    
    $retry = Read-Host "Would you like to retry with cache reset? (y/n)"
    if ($retry -eq "y") {
        Write-Host "Retrying with cache reset..." -ForegroundColor Yellow
        
        # Clean caches
        if (Test-Path -Path "$PSScriptRoot\android\app\build") {
            Remove-Item -Recurse -Force "$PSScriptRoot\android\app\build" -ErrorAction SilentlyContinue
        }
        
        if (Test-Path -Path "$PSScriptRoot\android\.gradle") {
            Remove-Item -Recurse -Force "$PSScriptRoot\android\.gradle" -ErrorAction SilentlyContinue
        }
        
        # Try to build again with reset cache
        $buildCommand = "npx react-native run-android --reset-cache"
        if ($BuildType -eq "release") {
            $buildCommand += " --variant=release"
        }
        
        Write-Host "Running: $buildCommand" -ForegroundColor Gray
        Invoke-Expression $buildCommand
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "App built and installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "Error: Build failed again with code $LASTEXITCODE" -ForegroundColor Red
            exit 1
        }
    } else {
        exit 1
    }
}

# Step 6: Launch the app
Write-Host "`n> Launching the app...`n" -ForegroundColor Yellow

$packageName = "com.businessgoapp"
$mainActivity = ".MainActivity"

& "$env:ANDROID_HOME\platform-tools\adb.exe" shell am start -n "$packageName/$packageName$mainActivity"

if ($LASTEXITCODE -eq 0) {
    Write-Host "App launched successfully!" -ForegroundColor Green
} else {
    Write-Host "Warning: Failed to launch the app automatically. You may need to open it manually." -ForegroundColor Yellow
}

# Final message
Write-Host "`n=========== Deployment Complete! ===========`n" -ForegroundColor Cyan
Write-Host "The Business GO App should now be running on your device." -ForegroundColor Green
Write-Host "Would you like to see the app logs? (y/n)" -ForegroundColor White
$showLogs = Read-Host

if ($showLogs -eq "y") {
    Write-Host "`n> Showing app logs (press Ctrl+C to stop)...`n" -ForegroundColor Yellow
    & "$env:ANDROID_HOME\platform-tools\adb.exe" logcat *:E ReactNative:V ReactNativeJS:V
}
