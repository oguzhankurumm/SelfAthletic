import 'react-native-gesture-handler';
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Route from './src/navigation/main';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import rootReducer from './src/redux/reducers';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux'
import FlashMessage from "react-native-flash-message";

LogBox.ignoreAllLogs(true);

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

function App() {
  return (
    <SafeAreaProvider>
      <FlashMessage position="top" />
      <Provider store={store} >
        <Route />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;