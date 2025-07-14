import { Toaster } from 'react-hot-toast'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import TermsOfService from './components/TermsOfService'
import { useState } from 'react'
import ResetPassword from './components/ResetPassword'
import LandingPage from './components/LandingPage'
import OnboardingFlow from './components/OnboardingFlow'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import VerifyEmailPage from './components/VerifyEmailPage'
import ThemeProvider from './context/ThemeContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { useAuth } from './hooks/useAuth'
import Marketplace from './components/Marketplace'

// Component to handle authenticated user redirects
const AuthenticatedRedirect = ({ children }) => {
    const { currentUser, userProfile } = useAuth()

    console.log('AuthenticatedRedirect - currentUser:', currentUser) // Debug log
    console.log('AuthenticatedRedirect - userProfile:', userProfile) // Debug log

    if (currentUser) {
        if (!currentUser.emailVerified || (userProfile && !userProfile.emailVerified)) {
            console.log('Redirecting to verify-email') // Debug log
            return <Navigate to="/verify-email" replace />
        }

        // If userProfile doesn't exist or onboardingCompleted is not true, go to onboarding
        if (!userProfile || !userProfile.onboardingCompleted) {
            console.log('Redirecting to onboarding') // Debug log
            return <Navigate to="/onboarding" replace />
        }

        console.log('Redirecting to dashboard') // Debug log
        return <Navigate to="/dashboard" replace />
    }

    return children
}

function App() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const openTerms = () => setIsTermsOpen(true);
    const closeTerms = () => setIsTermsOpen(false);

    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <Routes>
                        {/* Landing page (always accessible) */}
                        <Route
                            path="/"
                            element={
                                <AuthenticatedRedirect>
                                    <LandingPage openTerms={openTerms} />
                                </AuthenticatedRedirect>
                            }
                        />

                        {/* Password reset route */}
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Email verification route */}
                        <Route path="/verify-email" element={<VerifyEmailPage />} />

                        {/* Onboarding route */}
                        <Route
                            path="/onboarding"
                            element={
                                <ProtectedRoute requireEmailVerified={true} redirectCompletedOnboarding={true}>
                                    <OnboardingFlow />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute requireEmailVerified={true} requireOnboarding={true}>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute requireEmailVerified={true} requireOnboarding={true}>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/marketplace" element={<Marketplace />} />

                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ThemeProvider>

                {/* Toast notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 1000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 1000,
                            theme: {
                                primary: '#4ade80',
                                secondary: '#000',
                            },
                        },
                    }}
                />
                {/* Terms of Service Modal */}
                <TermsOfService isOpen={isTermsOpen} onClose={closeTerms} />
            </AuthProvider>
        </Router>
    )
}

export default App
