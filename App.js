import 'react-native-gesture-handler';
import React from 'react'
import CheckAuth from './src/router/CheckAuth';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import userReducer from './src/redux/reducers/profile';
import ReduxThunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux'

LogBox.ignoreAllLogs(true);

const rootReducer = combineReducers({
  user: userReducer
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
