import 'react-native-gesture-handler';
import React from 'react'
import CheckAuth from './src/router/CheckAuth';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import userReducer from './src/redux/reducers/profile';
import bildirimReducer from './src/redux/reducers/bildirim';
import ReduxThunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux'

// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// var PushNotification = require("react-native-push-notification");

LogBox.ignoreAllLogs(true);

const rootReducer = combineReducers({
  user: userReducer,
  bildirimler: bildirimReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

function App() {
  return (
    <Provider store={store} >
      <CheckAuth />
    </Provider>
  );
}

export default App;
