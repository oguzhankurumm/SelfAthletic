import 'react-native-gesture-handler';
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CheckAuth from './src/router/CheckAuth';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import userReducer from './src/redux/reducers/profile';
import bildirimReducer from './src/redux/reducers/bildirim';
import healthReducer from './src/redux/reducers/health';
import ReduxThunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import FlashMessage from "react-native-flash-message";

// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// var PushNotification = require("react-native-push-notification");

LogBox.ignoreAllLogs(true);

const rootReducer = combineReducers({
  user: userReducer,
  bildirimler: bildirimReducer,
  health: healthReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

function App() {
  return (
    <SafeAreaProvider>
      <FlashMessage position="top" />
      <Provider store={store} >
        <CheckAuth />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
