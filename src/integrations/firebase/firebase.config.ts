import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
   apiKey: 'AIzaSyDnGwqQKbi-8oZp2StPKiYppC1hvSyY5ws',
   authDomain: 'droppybuilder-e41c3.firebaseapp.com',
   projectId: 'droppybuilder-e41c3',
   storageBucket: 'droppybuilder-e41c3.firebasestorage.app',
   messagingSenderId: '423515003927',
   appId: '1:423515003927:web:3441e077d82bed66af5052',
   measurementId: 'G-QD0N1244G3',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
const analytics = getAnalytics(app)
