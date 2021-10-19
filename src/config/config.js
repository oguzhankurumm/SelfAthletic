import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCaosXz4_tVl1e1q-nh-CaepVMWK7JnGgU",
    authDomain: "selfathletic-d8b9a.firebaseapp.com",
    databaseURL: "https://selfathletic-d8b9a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "selfathletic-d8b9a",
    storageBucket: "selfathletic-d8b9a.appspot.com",
    messagingSenderId: "1053407049319",
    appId: "1:1053407049319:web:1e362a93b8d026bc9f86c2",
    measurementId: "G-P58S3K2MQ1"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase, database, firestore, auth, messaging, storage };