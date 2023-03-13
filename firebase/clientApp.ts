import 'firebase/auth'
import 'firebase/firestore'

import { initializeApp } from 'firebase/app'
const clientCredentials = {
  apiKey: 'AIzaSyDobnkgySgzKK4xkYdBu41btFJphXgqyrQ',
  authDomain: 'time-log-7f2ee.firebaseapp.com',
  projectId: 'time-log-7f2ee',
  storageBucket: 'time-log-7f2ee.appspot.com',
  messagingSenderId: '210478898192',
  appId: '1:210478898192:web:5cebd9767fa1cb223bbe95'
}
const app = initializeApp(clientCredentials)
export default app
