import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { AuthContext } from './authContext'

import toast from 'react-hot-toast'

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    // Register user with email verification
    const signup = async (email, password, firstName, lastName, dateOfBirth) => {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password)

            // Send email verification
            await sendEmailVerification(user)

            // Create user profile in Firestore
            const userProfileData = {
                uid: user.uid,
                firstName,
                lastName,
                dateOfBirth, // Now a date string instead of {month, year} object
                email,
                role: 'user',
                emailVerified: false,
                onboardingCompleted: false,
                menteeSubjects: [],
                mentorSubjects: [],
                acceptedDate: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            }

            await setDoc(doc(db, 'users', user.uid), userProfileData)

            toast.success('Account created! Please check your email for verification.')
            return { user, needsVerification: true }
        } catch (error) {
            toast.error(error.message)
            throw error
        }
    }

    // Login user
    const login = async (email, password) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password)

            if (!user.emailVerified) {
                toast.error('Please verify your email before logging in.')
                await signOut(auth)
                return { needsVerification: true }
            }

            toast.success('Welcome back!')
            return { user }
        } catch (error) {
            toast.error(error.message)
            throw error
        }
    }

    // Logout user
    const logout = async () => {
        try {
            await signOut(auth)
            setUserProfile(null)
            toast.success('Logged out successfully')
        } catch (error) {
            toast.error(error.message)
            throw error
        }
    }

    // Resend verification email
    const resendVerification = async () => {
        try {
            if (currentUser) {
                await sendEmailVerification(currentUser)
                toast.success('Verification email sent!')
            }
        } catch (error) {
            toast.error(error.message)
            throw error
        }
    }

    // Check email verification and update user profile
    const checkEmailVerification = async () => {
        try {
            if (currentUser) {
                await currentUser.reload()
                console.log('Current user email verified status:', currentUser.emailVerified) // Debug log

                if (currentUser.emailVerified) {
                    // If userProfile exists and emailVerified is false, update it
                    if (userProfile && !userProfile.emailVerified) {
                        await setDoc(
                            doc(db, 'users', currentUser.uid),
                            {
                                ...userProfile,
                                emailVerified: true,
                                lastModified: new Date().toISOString(),
                            },
                            { merge: true }
                        )

                        // Refresh user profile
                        await fetchUserProfile(currentUser.uid)
                    }

                    toast.success('Email verified successfully!')
                    return true
                }
            }
            return false
        } catch (error) {
            console.error('Error in checkEmailVerification:', error)
            toast.error(error.message)
            throw error
        }
    }

    // Fetch user profile from Firestore
    const fetchUserProfile = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid))
            if (userDoc.exists()) {
                const profile = userDoc.data()
                setUserProfile(profile)
                return profile
            }
        } catch (error) {
            console.error('Error fetching user profile:', error)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
            if (user) {
                await fetchUserProfile(user.uid)
            } else {
                setUserProfile(null)
            }
            setLoading(false)
        })
        return unsubscribe
    }, [])

    // Points balance check runs every time currentUser changes
    useEffect(() => {
        const checkPointBalance = async () => {
            if (!currentUser?.uid) return
            try {
                const now = new Date()
                const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
                const balanceRef = doc(db, 'users', currentUser.uid, 'pointBalance', 'main')
                const balanceSnap = await getDoc(balanceRef)
                if (!balanceSnap.exists() || balanceSnap.data().monthYear !== currentMonthYear) {
                    await setDoc(balanceRef, {
                        monthYear: currentMonthYear,
                        balance: 50,
                    })
                }
                //console.log('Point balance set for current month:', currentMonthYear);
            } catch (err) {
                console.error('Error setting point balance:', err)
            }
        }
        checkPointBalance()
    }, [currentUser])

    const value = {
        currentUser,
        userProfile,
        setUserProfile,
        signup,
        login,
        logout,
        resendVerification,
        checkEmailVerification,
    }

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
