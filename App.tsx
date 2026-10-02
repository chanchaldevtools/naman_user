import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { setupNotifications } from './src/utils/notificationService';

function App() {
  useEffect(() => {
    const cleanup = setupNotifications();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;