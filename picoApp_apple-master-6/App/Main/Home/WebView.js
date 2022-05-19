import React from 'react';
import { StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export const WebViewScreen = ({ route }) => {
  const type = route.params;
  const getWebUri = (props) => {
    console.log(props);
    if (props === 'amazon') {
      return 'https://www.amazon.com/gp/product/B084BZW1KH';
    } else if (props === 'faq') {
      return 'https://www.brilcom.com/how-to-use';
    } else if (props === 'terms') {
      return 'https://www.brilcom.com/terms-privacy';
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <WebView source={{ uri: getWebUri(type) }} />
    </>
  );
};
