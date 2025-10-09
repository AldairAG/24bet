
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';



export default function App() {

  return (
    <Provider store={store}>
      <AppNavigator />
      <Toast />
    </Provider>
  );
}
