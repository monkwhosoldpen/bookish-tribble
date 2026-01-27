import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Import react-native-exception-handler only for native platforms
let setJSExceptionHandler, setNativeExceptionHandler;
if (Platform.OS !== 'web') {
  try {
    const exceptionHandler = require('react-native-exception-handler');
    setJSExceptionHandler = exceptionHandler.setJSExceptionHandler;
    setNativeExceptionHandler = exceptionHandler.setNativeExceptionHandler;
  } catch (e) {
    console.warn('[INDEX] react-native-exception-handler not available:', e);
  }
}

/**
 * Register Background Message Handler for Firebase
 * This MUST be done in index.js before registerRootComponent
 */
if (Platform.OS !== 'web') {
  try {
    const { setupBackgroundMessageHandler } = require('./src/hooks/useFirebaseMessaging');
    setupBackgroundMessageHandler();
    console.log('[INDEX] Native Background Message Handler registered');
  } catch (e) {
    console.warn('[INDEX] Failed to register background handler:', e);
  }
}

/**
 * Global Error Handlers - Catch fatal errors that would normally crash the app
 */
const saveErrorLogToDisk = async (error, type = 'JS') => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `fatal-error-${type}-${timestamp}.txt`;
    
    let errorReport = '=====================================\n';
    errorReport += `     FATAL ${type} ERROR REPORT       \n`;
    errorReport += '=====================================\n\n';
    
    errorReport += `📅 Timestamp: ${new Date().toISOString()}\n`;
    errorReport += `📱 Platform: ${Platform.OS}\n`;
    errorReport += `🚨 Error Type: ${type}\n\n`;
    
    errorReport += 'ERROR DETAILS\n';
    errorReport += '-------------------------------------\n';
    
    if (typeof error === 'string') {
      errorReport += `Error: ${error}\n`;
    } else if (error && typeof error === 'object') {
      errorReport += `Name: ${error.name || 'Unknown'}\n`;
      errorReport += `Message: ${error.message || 'No message'}\n`;
      if (error.stack) {
        errorReport += `\nStack Trace:\n${error.stack}\n`;
      }
    }
    
    errorReport += '\n=====================================\n';
    errorReport += '           END OF REPORT              \n';
    errorReport += '=====================================\n';
    
    let fileUri;
    if (Platform.OS === 'android') {
      const downloadsDir = FileSystem.documentDirectory + 'ErrorLogs/';
      await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
      fileUri = downloadsDir + fileName;
    } else {
      fileUri = FileSystem.documentDirectory + fileName;
    }
    
    await FileSystem.writeAsStringAsync(fileUri, errorReport, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    console.log(`✅ Fatal ${type} error report saved to:`, fileUri);
    return fileUri;
  } catch (saveError) {
    console.error('❌ Failed to save fatal error report:', saveError);
    return null;
  }
};

if (Platform.OS !== 'web' && setJSExceptionHandler && setNativeExceptionHandler) {
  // Catch JavaScript errors (e.g., undefined is not a function, null reference errors)
  setJSExceptionHandler(async (error, isFatal) => {
    console.error('[GLOBAL JS ERROR]', error);
    
    // Try to save the error to disk first
    const savedFile = await saveErrorLogToDisk(error, 'JS');
    
    if (isFatal) {
      Alert.alert(
        '🚨 Fatal Error',
        `The app encountered a critical error:\n\n${error.name}: ${error.message}\n\n${error.stack ? 'Stack: ' + error.stack.substring(0, 200) + '...' : ''}\n\n${savedFile ? '📁 Error log saved to device storage' : ''}`,
        [
          { text: 'Reload App', onPress: () => {
            // Attempt to reload the app
            if (typeof Updates !== 'undefined' && Updates.reloadAsync) {
              Updates.reloadAsync();
            } else {
              // Fallback: location.reload for web or restart suggestion
              console.log('Please restart the app manually');
            }
          }},
          { text: 'Close', style: 'cancel' }
        ],
        { cancelable: false }
      );
    } else {
      // For non-fatal errors, show a less intrusive alert
      Alert.alert(
        '⚠️ Error',
        `Something went wrong:\n\n${error.message}\n\n${savedFile ? '📁 Error log saved' : ''}`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  }, true); // true = handle in development mode too

  // Catch Native errors (e.g., missing permissions, API key issues, native module crashes)
  setNativeExceptionHandler(async (exceptionString) => {
    console.error('[GLOBAL NATIVE ERROR]', exceptionString);
    
    // Try to save the error to disk first
    const savedFile = await saveErrorLogToDisk(exceptionString, 'NATIVE');
    
    // Try to show the error before the app closes
    Alert.alert(
      '🔥 Native Crash',
      `A native error occurred:\n\n${exceptionString.substring(0, 300)}...\n\n${savedFile ? '📁 Error log saved to device storage' : ''}\n\nThe app may close now.`,
      [{ text: 'OK', style: 'default' }]
    );
  });
}

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
