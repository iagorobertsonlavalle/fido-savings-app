import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

function applyPhoneFrame() {
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      min-height: 100vh !important;
    }
    html {
      background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0d1b3e 100%) !important;
      background-attachment: fixed !important;
    }
    body {
      margin: 0 !important;
      overflow: auto !important;
      background: transparent !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: flex-start !important;
      padding: 48px 20px !important;
      box-sizing: border-box !important;
    }
    #root {
      flex: none !important;
      width: 390px !important;
      height: 844px !important;
      border-radius: 50px !important;
      overflow: hidden !important;
      box-shadow:
        0 0 0 12px #1c1c1e,
        0 0 0 14px #3a3a3c,
        0 40px 100px rgba(0, 0, 0, 0.7) !important;
      position: relative !important;
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web') applyPhoneFrame();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
