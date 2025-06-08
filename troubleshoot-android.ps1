# BusinessGOApp Android Environment Troubleshooter
# This script helps diagnose and fix common React Native Android development issues

$host.UI.RawUI.ForegroundColor = "Cyan"
Write-Host "`n========== Business GO App - Android Environment Troubleshooter ==========`n" -ForegroundColor Magenta
$host.UI.RawUI.ForegroundColor = "White"

Write-Host "This script will help diagnose and fix common React Native Android development issues." -ForegroundColor Yellow
Write-Host "Running diagnostics...\n" -ForegroundColor Yellow

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Cyan
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
    $nodeVersion = & node -v
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
    
    # Check npm installation
    $npmCommand = Get-Command npm -ErrorAction SilentlyContinue
    if ($npmCommand) {
        $npmVersion = & npm -v
        Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "✕ npm not found. Please reinstall Node.js." -ForegroundColor Red
    }
} else {
    Write-Host "✕ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
}

# Check Java installation
Write-Host "`nChecking Java installation..." -ForegroundColor Cyan
$javaCommand = Get-Command java -ErrorAction SilentlyContinue
if ($javaCommand) {
    $javaVersion = & java -version 2>&1
    Write-Host "✓ Java is installed: $($javaVersion[0])" -ForegroundColor Green
    
    if ($env:JAVA_HOME) {
        Write-Host "✓ JAVA_HOME is set to: $env:JAVA_HOME" -ForegroundColor Green
    } else {
        Write-Host "! JAVA_HOME is not set" -ForegroundColor Yellow
        Write-Host "  Attempting to find and set JAVA_HOME..." -ForegroundColor Yellow
        
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
                $javaPath = $possiblePaths | Sort-Object -Property FullName -Descending | Select-Object -First 1
                break
            }
        }

        if ($javaPath) {
            Write-Host "  Found Java at: $($javaPath.Path)" -ForegroundColor Green
            Write-Host "  To permanently set JAVA_HOME, run the following command:" -ForegroundColor Yellow
            Write-Host "  [System.Environment]::SetEnvironmentVariable('JAVA_HOME', '$($javaPath.Path)', 'Machine')" -ForegroundColor White
        } else {
            Write-Host "  Could not find a Java installation path" -ForegroundColor Red
        }
    }
} else {
    Write-Host "✕ Java not found. Please install JDK from https://adoptium.net/" -ForegroundColor Red
}

# Check Android SDK installation
Write-Host "`nChecking Android SDK installation..." -ForegroundColor Cyan
if ($env:ANDROID_HOME) {
    Write-Host "✓ ANDROID_HOME is set to: $env:ANDROID_HOME" -ForegroundColor Green
    
    # Check if the directory exists
    if (Test-Path -Path $env:ANDROID_HOME) {
        Write-Host "✓ Android SDK directory exists" -ForegroundColor Green
    } else {
        Write-Host "✕ Android SDK directory not found at $env:ANDROID_HOME" -ForegroundColor Red
    }
    
    # Check platform-tools
    if (Test-Path -Path "$env:ANDROID_HOME\platform-tools") {
        Write-Host "✓ platform-tools found" -ForegroundColor Green
    } else {
        Write-Host "✕ platform-tools not found. Install via Android SDK Manager" -ForegroundColor Red
    }
    
    # Check emulator
    if (Test-Path -Path "$env:ANDROID_HOME\emulator") {
        Write-Host "✓ emulator found" -ForegroundColor Green
    } else {
        Write-Host "✕ emulator not found. Install via Android SDK Manager" -ForegroundColor Red
    }
} else {
    Write-Host "! ANDROID_HOME is not set" -ForegroundColor Yellow
    
    # Try to find Android SDK
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
        Write-Host "  Found Android SDK at: $sdkPath" -ForegroundColor Green
        Write-Host "  To permanently set ANDROID_HOME, run the following command:" -ForegroundColor Yellow
        Write-Host "  [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', '$sdkPath', 'Machine')" -ForegroundColor White
    } else {
        Write-Host "  Could not find Android SDK. Please install Android Studio" -ForegroundColor Red
    }
}

# Check adb connection and devices
Write-Host "`nChecking ADB and connected devices..." -ForegroundColor Cyan
$adbCommand = Get-Command adb -ErrorAction SilentlyContinue
if ($adbCommand) {
    Write-Host "✓ adb found in PATH" -ForegroundColor Green
    
    $devices = & adb devices
    if ($devices.Count -gt 1) {
        Write-Host "✓ Devices found:" -ForegroundColor Green
        $devices | Select-Object -Skip 1 | ForEach-Object {
            if ($_ -match "\w+") {
                Write-Host "  - $_" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "! No devices connected" -ForegroundColor Yellow
        Write-Host "  Start an emulator or connect a device" -ForegroundColor Yellow
    }
} elseif (Test-Path -Path "$env:ANDROID_HOME\platform-tools\adb.exe") {
    Write-Host "! adb found but not in PATH" -ForegroundColor Yellow
    Write-Host "  To permanently add adb to PATH, run the following command:" -ForegroundColor Yellow
    Write-Host "  [System.Environment]::SetEnvironmentVariable('PATH', `"`$env:PATH;$env:ANDROID_HOME\platform-tools`", 'Machine')" -ForegroundColor White
} else {
    Write-Host "✕ adb not found" -ForegroundColor Red
}

# Check project dependencies
Write-Host "`nChecking project dependencies..." -ForegroundColor Cyan
$packageJsonPath = "$PSScriptRoot\package.json"
if (Test-Path -Path $packageJsonPath) {
    Write-Host "✓ package.json found" -ForegroundColor Green
    
    # Check node_modules
    if (Test-Path -Path "$PSScriptRoot\node_modules") {
        Write-Host "✓ node_modules directory exists" -ForegroundColor Green
    } else {
        Write-Host "! node_modules not found. Run 'npm install'" -ForegroundColor Yellow
    }
    
    # Check for important React Native libraries
    $packageJson = Get-Content -Path $packageJsonPath | ConvertFrom-Json
    $reactNative = $packageJson.dependencies.'react-native'
    if ($reactNative) {
        Write-Host "✓ react-native found: $reactNative" -ForegroundColor Green
    } else {
        Write-Host "✕ react-native not found in dependencies" -ForegroundColor Red
    }
    
    # Check for Android directory
    if (Test-Path -Path "$PSScriptRoot\android") {
        Write-Host "✓ android directory exists" -ForegroundColor Green
    } else {
        Write-Host "✕ android directory not found" -ForegroundColor Red
    }
} else {
    Write-Host "✕ package.json not found. Are you in the correct directory?" -ForegroundColor Red
}

# Gradle checks
Write-Host "`nChecking Gradle setup..." -ForegroundColor Cyan
$gradlew = "$PSScriptRoot\android\gradlew.bat"
if (Test-Path -Path $gradlew) {
    Write-Host "✓ gradlew found" -ForegroundColor Green
    
    # Check gradle properties
    $gradleProps = "$PSScriptRoot\android\gradle.properties"
    if (Test-Path -Path $gradleProps) {
        Write-Host "✓ gradle.properties found" -ForegroundColor Green
    } else {
        Write-Host "✕ gradle.properties not found" -ForegroundColor Red
    }
} else {
    Write-Host "✕ gradlew not found. Android setup may be incomplete." -ForegroundColor Red
}

# Final recommendations
Write-Host "`n========== Troubleshooting Recommendations ==========`n" -ForegroundColor Magenta

Write-Host "If you encounter issues with the React Native Android build, try these solutions:" -ForegroundColor Yellow

Write-Host "`n1. Clean the project:" -ForegroundColor White
Write-Host "   cd '$PSScriptRoot'" -ForegroundColor Cyan
Write-Host "   cd android" -ForegroundColor Cyan
Write-Host "   ./gradlew clean" -ForegroundColor Cyan

Write-Host "`n2. Delete build folders:" -ForegroundColor White
Write-Host "   Remove-Item -Recurse -Force '$PSScriptRoot\android\app\build' -ErrorAction SilentlyContinue" -ForegroundColor Cyan
Write-Host "   Remove-Item -Recurse -Force '$PSScriptRoot\android\.gradle' -ErrorAction SilentlyContinue" -ForegroundColor Cyan

Write-Host "`n3. Reset Metro bundler cache:" -ForegroundColor White
Write-Host "   npx react-native start --reset-cache" -ForegroundColor Cyan

Write-Host "`n4. Reinstall node modules:" -ForegroundColor White
Write-Host "   Remove-Item -Recurse -Force '$PSScriptRoot\node_modules' -ErrorAction SilentlyContinue" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor Cyan

Write-Host "`n5. Use the launch script to automatically configure and start the app:" -ForegroundColor White
Write-Host "   ./launch-android.ps1" -ForegroundColor Cyan

Write-Host "`nHappy coding! 🎮🚀" -ForegroundColor Green
