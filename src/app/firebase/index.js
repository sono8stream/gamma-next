import firebase from 'firebase';
import { firebaseConfig } from './config.js';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const firebaseApp = firebase.app();
export const firebaseAuth = firebase.auth;
export const firebaseDB=firebaseApp.database();