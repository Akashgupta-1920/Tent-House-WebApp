import React, { useRef, useEffect } from 'react';
import {
  BackHandler,
  SafeAreaView,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webviewRef = useRef(null);
  const canGoBackRef = useRef(false);
  let backPressCount = 0;

  // Handle Android Back Button
  useEffect(() => {
    const backAction = () => {
      if (canGoBackRef.current) {
        webviewRef.current.goBack();
        return true;
      } else {
        if (backPressCount === 0) {
          backPressCount++;
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

          setTimeout(() => {
            backPressCount = 0; // reset counter after 2 sec
          }, 2000);

          return true;
        }
        BackHandler.exitApp(); // exit on second press
        return true;
      }
    };

    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => handler.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <WebView
        ref={webviewRef}
        source={{ uri: 'http://inv.webloxic.cloud/' }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        onNavigationStateChange={navState => {
          canGoBackRef.current = navState.canGoBack;
        }}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}
