import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

/**
 * Error Testing Screen
 * A simple screen to test various error scenarios
 */
export default function ErrorTestScreen() {
  const causeFatalError = () => {
    // This will cause a fatal JS error that should be caught by the global handler
    throw new Error('Test fatal JavaScript error - this should trigger the global error handler');
  };

  const causeTypeError = () => {
    // This will cause a type error
    const nullVar: any = null;
    nullVar.someMethod();
  };

  const causeReferenceError = () => {
    // This will cause a reference error
    (window as any).nonExistentObject.nonExistentMethod();
  };

  const causeAsyncError = async () => {
    // This will cause an async error
    await new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Test async error')), 100);
    });
  };

  const causeReactRenderError = () => {
    // This will cause a React render error that should be caught by Error Boundary
    throw new Error('Test React render error - should be caught by CodeBoundary');
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <View className="flex-1">
        <View className="items-center mb-8">
          <MaterialIcons name="bug-report" size={48} className="text-primary mb-4" />
          <Text className="text-2xl font-bold text-foreground text-center mb-2">
            Error Testing Lab
          </Text>
          <Text className="text-muted-foreground text-center">
            Test different types of errors to verify error handling
          </Text>
        </View>

        <View className="space-y-4">
          <Text className="font-semibold text-foreground mb-2">JavaScript Errors:</Text>
          
          <TouchableOpacity
            onPress={causeFatalError}
            className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl"
          >
            <Text className="text-destructive font-medium text-center">
              🚨 Cause Fatal Error
            </Text>
            <Text className="text-muted-foreground text-sm text-center mt-1">
              Triggers global error handler
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={causeTypeError}
            className="bg-warning/10 border border-warning/20 p-4 rounded-xl"
          >
            <Text className="text-warning font-medium text-center">
              ⚠️ Cause Type Error
            </Text>
            <Text className="text-muted-foreground text-sm text-center mt-1">
              null.method() error
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={causeReferenceError}
            className="bg-warning/10 border border-warning/20 p-4 rounded-xl"
          >
            <Text className="text-warning font-medium text-center">
              🔗 Cause Reference Error
            </Text>
            <Text className="text-muted-foreground text-sm text-center mt-1">
              undefined property access
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={causeAsyncError}
            className="bg-secondary/10 border border-secondary/20 p-4 rounded-xl"
          >
            <Text className="text-secondary font-medium text-center">
              ⏳ Cause Async Error
            </Text>
            <Text className="text-muted-foreground text-sm text-center mt-1">
              Promise rejection
            </Text>
          </TouchableOpacity>

          <View className="border-t border-border pt-4 mt-6">
            <Text className="font-semibold text-foreground mb-2">React Errors:</Text>
            
            <TouchableOpacity
              onPress={causeReactRenderError}
              className="bg-primary/10 border border-primary/20 p-4 rounded-xl"
            >
              <Text className="text-primary font-medium text-center">
                ⚛️ Cause React Render Error
              </Text>
              <Text className="text-muted-foreground text-sm text-center mt-1">
                Triggers Error Boundary
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8 p-4 bg-muted/30 rounded-xl">
          <Text className="text-xs text-muted-foreground text-center">
            💡 Tip: Use the debug button (bottom-right) for more testing options
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
