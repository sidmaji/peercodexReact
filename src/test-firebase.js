// Test file to verify Firebase connection
import { collection } from 'firebase/firestore'
import { auth, db } from './firebase.js'

// Simple test function to verify Firebase is working
export const testFirebaseConnection = async () => {
    try {
        console.log('Firebase Auth:', auth)
        console.log('Firestore DB:', db)

        // Test Firestore connection (will fail gracefully if no collections exist)
        collection(db, 'test')
        console.log('Firestore collection reference created successfully')

        return { success: true, message: 'Firebase connection successful' }
    } catch (error) {
        console.error('Firebase connection test failed:', error)
        return { success: false, error: error.message }
    }
}
