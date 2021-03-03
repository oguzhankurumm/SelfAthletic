import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

// const firebaseConfig = {
//     apiKey: "AIzaSyAxd8s_fqfWZHHhyKPcO1kSvMoAJt8Ob78",
//     authDomain: "xtuse-app.firebaseapp.com",
//     databaseURL: "https://xtuse-app.firebaseio.com",
//     projectId: "xtuse-app",
//     storageBucket: "xtuse-app.appspot.com",
//     messagingSenderId: "348975098322",
//     appId: "1:348975098322:web:bc500471581b8f6021800b",
//     measurementId: "G-R8QW425ZR1"
// };

// if(!firebase.apps.length){
//   firebase.initializeApp(firebaseConfig);
// }

export const f = firebase;
export const database2 = database();
export const auth2 = auth();
export const messaging2 = messaging();