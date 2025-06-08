# Robust Android Deployment Script for BusinessGoApp
# Handles emulator issues and System UI problems

param(
    [switch]$SkipEmulator,
    [switch]$ForceRestart,
    [switch]$CleanBuild,
    [switch]$Verbose
)

# Enhanced logging function
function Write-LogMessage {
    param($Message, $Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

# Error handling
$ErrorActionPreference = "Continue"

Write-LogMessage "Starting robust Android deployment for BusinessGoApp..." "SUCCESS"

# Set JAVA_HOME if not set
if (-not $env:JAVA_HOME -or $env:JAVA_HOME -notlike "*Android Studio*") {
    $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
    Write-LogMessage "Set JAVA_HOME to: $env:JAVA_HOME"
}

# Set Android SDK paths
if (-not $env:ANDROID_HOME) {
    $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
    Write-LogMessage "Set ANDROID_HOME to: $env:ANDROID_HOME"
}

if (-not $env:ANDROID_SDK_ROOT) {
    $env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
}

# Add Android tools to PATH
$androidToolsPaths = @(
    "$env:ANDROID_HOME\platform-tools",
    "$env:ANDROID_HOME\tools",
    "$env:ANDROID_HOME\tools\bin",
    "$env:ANDROID_HOME\emulator"
)

foreach ($path in $androidToolsPaths) {
    if (Test-Path $path) {
        if ($env:PATH -notlike "*$path*") {
            $env:PATH = "$path;$env:PATH"
            Write-LogMessage "Added to PATH: $path"
        }
    }
}

# Function to check emulator status
function Test-EmulatorHealth {
    param($DeviceName)
    
    try {
        Write-LogMessage "Checking emulator health for $DeviceName"
        
        # Check if device is online
        $devices = adb devices | Select-String -Pattern "$DeviceName\s+device"
        if (-not $devices) {
            Write-LogMessage "Device $DeviceName not found or offline" "WARN"
            return $false
        }
        
        # Test system responsiveness
        Write-LogMessage "Testing system responsiveness..."
        $result = adb -s $DeviceName shell "getprop sys.boot_completed" 2>$null
        if ($result -ne "1") {
            Write-LogMessage "Device not fully booted" "WARN"
            return $false
        }
        
        # Test if System UI is responsive
        Write-LogMessage "Testing System UI responsiveness..."
        $uiResult = adb -s $DeviceName shell "dumpsys activity activities | grep -i systemui" 2>$null
        
        # Check if we can interact with the device
        $touchResult = adb -s $DeviceName shell "input keyevent KEYCODE_HOME" 2>$null
        Start-Sleep -Seconds 2
        
        Write-LogMessage "Emulator health check completed" "SUCCESS"
        return $true
    }
    catch {
        Write-LogMessage "Emulator health check failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Function to restart emulator if needed
function Restart-Emulator {
    Write-LogMessage "Restarting Android emulator..." "WARN"
    
    # Kill existing emulator processes
    try {
        Get-Process -Name "qemu-system-*" -ErrorAction SilentlyContinue | Stop-Process -Force
        Get-Process -Name "emulator*" -ErrorAction SilentlyContinue | Stop-Process -Force
        Start-Sleep -Seconds 3
    }
    catch {
        Write-LogMessage "No existing emulator processes to kill"
    }
    
    # Kill adb server
    adb kill-server
    Start-Sleep -Seconds 2
    adb start-server
    
    # Start emulator
    Write-LogMessage "Starting fresh emulator..."
    $emulatorProcess = Start-Process -FilePath "emulator" -ArgumentList "@Pixel_7_Pro_API_34", "-no-snapshot-load", "-wipe-data" -PassThru
    
    Write-LogMessage "Waiting for emulator to boot..."
    $bootTimeout = 0
    do {
        Start-Sleep -Seconds 5
        $bootTimeout += 5
        $devices = adb devices 2>$null
        Write-LogMessage "Waiting for emulator... ($bootTimeout seconds)"
        
        if ($bootTimeout -gt 120) {
            Write-LogMessage "Emulator boot timeout!" "ERROR"
            return $false
        }
    } while (-not ($devices -match "emulator-\d+\s+device"))
    
    # Wait additional time for full boot
    Write-LogMessage "Emulator detected, waiting for full boot..."
    Start-Sleep -Seconds 30
    
    return $true
}

# Main deployment logic
try {
    # Check current emulator status
    Write-LogMessage "Checking current emulator status..."
    $devices = adb devices 2>$null
    
    if ($devices -match "emulator-(\d+)\s+device") {
        $deviceName = $matches[0].Split()[0]
        Write-LogMessage "Found emulator: $deviceName"
        
        if (-not $ForceRestart) {
            $isHealthy = Test-EmulatorHealth -DeviceName $deviceName
            if (-not $isHealthy) {
                Write-LogMessage "Emulator is unhealthy, restarting..." "WARN"
                $ForceRestart = $true
            }
        }
    }
    else {
        Write-LogMessage "No emulator found, will start new one" "WARN"
        $ForceRestart = $true
    }
    
    # Restart emulator if needed
    if ($ForceRestart -and -not $SkipEmulator) {
        if (-not (Restart-Emulator)) {
            throw "Failed to restart emulator"
        }
        
        # Update device name after restart
        $devices = adb devices 2>$null
        if ($devices -match "emulator-(\d+)\s+device") {
            $deviceName = $matches[0].Split()[0]
            Write-LogMessage "Using restarted emulator: $deviceName"
        }
    }
    
    # Clean build if requested
    if ($CleanBuild) {
        Write-LogMessage "Performing clean build..."
        
        # Clean Gradle cache
        if (Test-Path "android\.gradle") {
            Remove-Item -Path "android\.gradle" -Recurse -Force
            Write-LogMessage "Cleaned Gradle cache"
        }
        
        # Clean build directory
        if (Test-Path "android\app\build") {
            Remove-Item -Path "android\app\build" -Recurse -Force
            Write-LogMessage "Cleaned build directory"
        }
        
        # Clean React Native cache
        npx react-native clean
        Write-LogMessage "Cleaned React Native cache"
    }
    
    # Start Metro bundler
    Write-LogMessage "Starting Metro bundler..."
    $metroProcess = Start-Process -FilePath "npx" -ArgumentList "react-native", "start", "--reset-cache" -PassThru
    
    # Wait a moment for Metro to start
    Start-Sleep -Seconds 5
    
    # Build and install the app
    Write-LogMessage "Building and installing app..."
    npx react-native run-android --verbose
    
    if ($LASTEXITCODE -eq 0) {
        Write-LogMessage "App deployment completed successfully!" "SUCCESS"
        Write-LogMessage "App should now be running on the emulator" "SUCCESS"
    }
    else {
        Write-LogMessage "App deployment failed with exit code: $LASTEXITCODE" "ERROR"
    }
}
catch {
    Write-LogMessage "Deployment failed: $($_.Exception.Message)" "ERROR"
    Write-LogMessage "Try running with -ForceRestart and -CleanBuild flags" "WARN"
}
finally {
    Write-LogMessage "Deployment script completed"
}

# Show final status
Write-LogMessage "Final device status:"
adb devices
