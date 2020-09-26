import * as firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyCxpPFRiuyrhH_IMnYstWsXdkg_a2f04hc",
    authDomain: "wily-app-f908c.firebaseapp.com",
    databaseURL: "https://wily-app-f908c.firebaseio.com",
    projectId: "wily-app-f908c",
    storageBucket: "wily-app-f908c.appspot.com",
    messagingSenderId: "980193191494",
    appId: "1:980193191494:web:3a617d53a907c28a920c47",
    measurementId: "G-T0G27XK81T"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();