# BusinessGOApp Android Launch Script
# This script automates the entire Android development environment setup and app launch process

# Set console colors for better visibility
$host.UI.RawUI.ForegroundColor = "Cyan"
Write-Host "`n========== Business GO App - Android Launch Script ==========`n" -ForegroundColor Green
$host.UI.RawUI.ForegroundColor = "White"

# Step 1: Find and set JAVA_HOME path
Write-Host "Step 1: Setting up Java environment..." -ForegroundColor Yellow

# Common Java installation paths to check
$javaInstallPaths = @(
    "${env:ProgramFiles}\Java\jdk*",
    "${env:ProgramFiles(x86)}\Java\jdk*",
    "${env:LOCALAPPDATA}\Android\Sdk\jdk*",
    "C:\Program Files\Android\Android Studio\jbr",
    "C:\Program Files\Android\Android Studio\jre"
)

$javaPath = $null
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
    Write-Host "✓ JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
} else {
    Write-Host "✕ Couldn't find Java installation. Please install JDK or specify JAVA_HOME manually." -ForegroundColor Red
    exit 1
}

# Step 2: Find and set Android SDK paths
Write-Host "`nStep 2: Setting up Android SDK environment..." -ForegroundColor Yellow

# Common Android SDK installation paths
$androidSdkPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "${env:ProgramFiles(x86)}\Android\android-sdk",
    "${env:ProgramFiles}\Android\android-sdk",
    "C:\Android\android-sdk"
)

$sdkPath = $null
foreach ($path in $androidSdkPaths) {
    if (Test-Path -Path $path) {
        $sdkPath = $path
        break
    }
}

if ($sdkPath) {
    $env:ANDROID_HOME = $sdkPath
    $env:Path = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:ANDROID_HOME\emulator;$env:Path"
    Write-Host "✓ ANDROID_HOME set to: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "✕ Couldn't find Android SDK. Please install Android Studio or specify ANDROID_HOME manually." -ForegroundColor Red
    exit 1
}

# Step 3: Clean Gradle cache
Write-Host "`nStep 3: Cleaning Gradle cache..." -ForegroundColor Yellow

$gradleCachePath = "$env:USERPROFILE\.gradle\caches"
$projectGradlePath = "$PSScriptRoot\android\.gradle"

try {
    if (Test-Path -Path $projectGradlePath) {
        Remove-Item -Path "$projectGradlePath\*" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Project Gradle cache cleaned" -ForegroundColor Green
    }
    
    # Optional deeper clean - can be uncommented if needed
    # if (Test-Path -Path $gradleCachePath) {
    #     Remove-Item -Path "$gradleCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
    #     Write-Host "✓ Global Gradle cache cleaned" -ForegroundColor Green
    # }
} catch {
    Write-Host "! Warning: Could not clean some Gradle cache files. Continuing anyway..." -ForegroundColor Yellow
}

# Step 4: Launch Android emulator
Write-Host "`nStep 4: Starting Android emulator..." -ForegroundColor Yellow

# Get list of available emulators
$emulators = & "$env:ANDROID_HOME\emulator\emulator" -list-avds

if ($emulators) {
    # Use the first available emulator
    $emulatorName = $emulators[0]
    Write-Host "Starting emulator: $emulatorName" -ForegroundColor Cyan
    
    # Start the emulator in a separate process
    Start-Process -FilePath "$env:ANDROID_HOME\emulator\emulator" -ArgumentList "-avd", $emulatorName, "-no-boot-anim" -NoNewWindow
    
    # Wait for emulator to boot
    Write-Host "Waiting for emulator to boot..." -ForegroundColor Cyan
    $booted = $false
    $attempts = 0
    $maxAttempts = 30
    
    while (-not $booted -and $attempts -lt $maxAttempts) {
        $bootCheck = & "$env:ANDROID_HOME\platform-tools\adb" shell getprop sys.boot_completed
        if ($bootCheck -eq "1") {
            $booted = $true
        } else {
            Start-Sleep -Seconds 2
            $attempts++
            Write-Host "." -NoNewline -ForegroundColor Yellow
        }
    }
    
    if ($booted) {
        Write-Host "`n✓ Emulator is ready" -ForegroundColor Green
    } else {
        Write-Host "`n! Emulator boot timeout. Continuing anyway..." -ForegroundColor Yellow
    }
} else {
    Write-Host "! No emulators found. Please create one using Android Studio. Trying to proceed anyway..." -ForegroundColor Yellow
    Write-Host "  To create an emulator, open Android Studio > Tools > AVD Manager > Create Virtual Device" -ForegroundColor Yellow
}

# Step 5 & 6: Start Metro and build the app
Write-Host "`nStep 5 & 6: Building and launching the app..." -ForegroundColor Yellow

# Check if the react-native CLI is installed
$reactNative = Get-Command npx -ErrorAction SilentlyContinue

if (-not $reactNative) {
    Write-Host "✕ npx command not found. Make sure Node.js is installed properly." -ForegroundColor Red
    exit 1
}

# Project directory check
$packageJsonPath = "$PSScriptRoot\package.json"
if (-not (Test-Path -Path $packageJsonPath)) {
    Write-Host "✕ No package.json found in current directory. Are you in the right project folder?" -ForegroundColor Red
    exit 1
}

# Launch the app
Write-Host "Starting Metro bundler and launching the app..." -ForegroundColor Cyan
Write-Host "NOTE: This will open a new terminal window for the Metro bundler." -ForegroundColor Yellow

# Start Metro bundler in a new window
Start-Process powershell -ArgumentList "-Command", "cd '$PSScriptRoot'; npx react-native start"

# Wait a moment for Metro to initialize
Start-Sleep -Seconds 5

# Run the Android app
Start-Process powershell -ArgumentList "-Command", "cd '$PSScriptRoot'; npx react-native run-android"

Write-Host "`n========== Setup Complete! ==========`n" -ForegroundColor Green
Write-Host "The Business GO App should now be building and launching on your Android emulator." -ForegroundColor Cyan
Write-Host "Metro bundler is running in a separate terminal window." -ForegroundColor Cyan
Write-Host "`nIf the app doesn't start automatically, you can manually run:" -ForegroundColor White
Write-Host "npx react-native run-android" -ForegroundColor Yellow
Write-Host "`nHappy Coding! 🚀" -ForegroundColor Green
