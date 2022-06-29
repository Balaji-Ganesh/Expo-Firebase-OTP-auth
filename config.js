import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

export const firebaseConfig = {
    apiKey: "AIzaSyBlogWaHR9D2vBQJxS6XNTUyF_GQRxAByM",
    authDomain: "otp-auth-devlopment.firebaseapp.com",
    projectId: "otp-auth-devlopment",
    storageBucket: "otp-auth-devlopment.appspot.com",
    messagingSenderId: "303178606334",
    appId: "1:303178606334:web:bb7c0f9b94f817ffa3e7af",
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}