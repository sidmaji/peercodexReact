import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ children, requireEmailVerified = true, requireOnboarding = false, redirectCompletedOnboarding = false }) => {
    const { currentUser, userProfile } = useAuth()

    // If not logged in, redirect to home
    if (!currentUser) {
        return <Navigate to="/" replace />
    }

    // If email verification is required and not verified, redirect to verification page
    if (requireEmailVerified && (!currentUser.emailVerified || (userProfile && !userProfile.emailVerified))) {
        return <Navigate to="/verify-email" replace />
    }

    // If this route should redirect users who have completed onboarding (like /onboarding page)
    if (redirectCompletedOnboarding && userProfile && userProfile.onboardingCompleted) {
        return <Navigate to="/dashboard" replace />
    }

    // If onboarding is required and not completed, redirect to onboarding
    if (requireOnboarding && userProfile && !userProfile.onboardingCompleted) {
        return <Navigate to="/onboarding" replace />
    }

    return children
}

export default ProtectedRoute
