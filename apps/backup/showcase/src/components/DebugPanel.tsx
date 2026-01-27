import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

/**
 * Visual Debug Component
 * Provides tools to test error handling and debug app state
 */
export const DebugPanel: React.FC<{ visible: boolean; onClose: () => void }> = ({ 
  visible, 
  onClose 
}) => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testJavaScriptError = () => {
    try {
      addTestResult('Testing JavaScript error...');
      // This will throw a reference error
      const undefinedVariable = (this as any).nonExistentMethod();
      // Use the variable to avoid unused warning
      if (undefinedVariable) {
        // This will never execute but satisfies the linter
        addTestResult('This should never happen');
      }
    } catch (error) {
      addTestResult(`✅ Caught JS error: ${(error as Error).message}`);
    }
  };

  const testTypeError = () => {
    try {
      addTestResult('Testing Type error...');
      // This will throw a type error
      const obj = null;
      (obj as any).someMethod();
    } catch (error) {
      addTestResult(`✅ Caught Type error: ${(error as Error).message}`);
    }
  };

  const testAsyncError = async () => {
    try {
      addTestResult('Testing Async error...');
      // Simulate an async error
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Async operation failed')), 100);
      });
    } catch (error) {
      addTestResult(`✅ Caught Async error: ${(error as Error).message}`);
    }
  };

  const testReactError = () => {
    addTestResult('Testing React render error...');
    // This will be caught by the Error Boundary
    throw new Error('Test React render error - this should be caught by Error Boundary');
  };

  const testMemoryLeak = () => {
    addTestResult('Testing memory allocation...');
    // Allocate some memory (not a real leak, just testing)
    const largeArray = new Array(1000000).fill('test');
    addTestResult(`✅ Allocated ${largeArray.length} items`);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getDeviceInfo = () => {
    const info = [
      `User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}`,
      `Platform: ${typeof navigator !== 'undefined' ? navigator.platform : 'N/A'}`,
      `Language: ${typeof navigator !== 'undefined' ? navigator.language : 'N/A'}`,
      `Timestamp: ${new Date().toISOString()}`,
    ];
    addTestResult('📱 Device Info:');
    info.forEach(line => addTestResult(`  ${line}`));
  };

  if (!visible) return null;

  return (
    <SafeAreaView className="absolute inset-0 bg-background/95 z-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-card border-b border-border p-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="bug-report" size={24} className="text-primary mr-2" />
            <Text className="text-lg font-bold text-foreground">Debug Panel</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2">
            <MaterialIcons name="close" size={24} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 flex-row">
          {/* Test Buttons */}
          <View className="w-1/2 p-4 border-r border-border">
            <Text className="font-semibold text-foreground mb-3">Error Tests</Text>
            
            <View className="space-y-2">
              <TouchableOpacity 
                onPress={testJavaScriptError}
                className="bg-warning/10 border border-warning/20 p-3 rounded-lg"
              >
                <Text className="text-warning text-sm font-medium">Test JS Error</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={testTypeError}
                className="bg-warning/10 border border-warning/20 p-3 rounded-lg"
              >
                <Text className="text-warning text-sm font-medium">Test Type Error</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={testAsyncError}
                className="bg-warning/10 border border-warning/20 p-3 rounded-lg"
              >
                <Text className="text-warning text-sm font-medium">Test Async Error</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={testReactError}
                className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg"
              >
                <Text className="text-destructive text-sm font-medium">Test React Error ⚠️</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={testMemoryLeak}
                className="bg-secondary/10 border border-secondary/20 p-3 rounded-lg"
              >
                <Text className="text-secondary text-sm font-medium">Test Memory</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={getDeviceInfo}
                className="bg-primary/10 border border-primary/20 p-3 rounded-lg"
              >
                <Text className="text-primary text-sm font-medium">Get Device Info</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={clearResults}
                className="bg-muted border border-border p-3 rounded-lg"
              >
                <Text className="text-muted-foreground text-sm font-medium">Clear Results</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Results */}
          <View className="w-1/2 p-4">
            <Text className="font-semibold text-foreground mb-3">Test Results</Text>
            <ScrollView className="flex-1 bg-muted/30 rounded-lg p-3">
              {testResults.length === 0 ? (
                <Text className="text-muted-foreground text-xs italic">No tests run yet</Text>
              ) : (
                testResults.map((result, index) => (
                  <Text key={index} className="text-xs font-mono text-muted-foreground mb-1">
                    {result}
                  </Text>
                ))
              )}
            </ScrollView>
          </View>
        </View>

        {/* Footer */}
        <View className="bg-card border-t border-border p-3">
          <Text className="text-xs text-muted-foreground text-center">
            💡 Use this panel to test error handling and debug app behavior
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Debug Button - Floating action button to open debug panel
 */
export const DebugButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-4 right-4 bg-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40"
    >
      <MaterialIcons name="bug-report" size={24} color="white" />
    </TouchableOpacity>
  );
};
