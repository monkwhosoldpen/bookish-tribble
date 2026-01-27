# Installation Instructions for APK Device Testing

## What You Need

Your AAB (Android App Bundle) file is located at:
```
c:\Users\Admin\Desktop\work\react-native-reusables\apps\showcase\application-8a35a9e3-6c38-4d9b-8a4e-9b72e6dc6961.aab
```

## Option 1: Using Google Play Console (Recommended for Testing)

1. Upload your AAB to Google Play Console
2. Create an internal test channel
3. Add testers and invite them
4. Testers download the app directly via Google Play

## Option 2: Using Android Studio

1. Open Android Studio
2. Go to: **Build → Analyze APK**
3. Select your AAB file
4. Android Studio will automatically convert it to APK
5. Connect your device and install

## Option 3: Using bundletool (Command Line)

### Prerequisites:
- Install Java JDK 11+
- Download bundletool

### Steps:

```powershell
# 1. Download bundletool (version 1.15.6)
$bundletoolUrl = "https://github.com/google/bundletool/releases/download/1.15.6/bundletool-all-1.15.6.jar"
Invoke-WebRequest -Uri $bundletoolUrl -OutFile "bundletool.jar"

# 2. Generate universal APK from AAB
java -jar bundletool.jar build-apks `
  --bundle=application-8a35a9e3-6c38-4d9b-8a4e-9b72e6dc6961.aab `
  --output=app.apks `
  --mode=universal

# 3. Install on connected device
adb install-multiple app.apks
```

## Option 4: Direct Device Installation (Easiest)

If you have a physical Android device connected with ADB:

```powershell
# Connect device via USB with Developer Mode enabled
adb devices

# Install directly from AAB (requires bundletool + Java)
java -jar bundletool.jar install-apks `
  --apks=app.apks `
  --device-id=<your-device-id>
```

## Next Steps

1. **Install Java**: Download from https://www.oracle.com/java/technologies/downloads/
2. **Connect Android Device**: Enable USB Debugging in Developer Options
3. **Run the conversion**: Use the bundletool commands above
4. **Test**: Open the app on your device

Would you like help with any of these options?
