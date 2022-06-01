import React from 'react';
import { StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export const WebViewScreen = ({ route }) => {
  const type = route.params;
  const getWebUri = (props) => {
    console.log(props);
    if (props === 'amazon') {
      return 'https://www.amazon.com/gp/product/B084BZW1KH';
    } else if (props === 'terms') {
      return 'https://www.brilcom.com/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4-%EC%95%BD%EA%B4%80';
    } else if (props === 'faq') {
      return 'https://www.brilcom.com/%EC%9E%90%EC%A3%BC-%EB%AC%BB%EB%8A%94-%EC%A7%88%EB%AC%B8';
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <WebView source={{ uri: getWebUri(type) }} />
    </>
  );
};
