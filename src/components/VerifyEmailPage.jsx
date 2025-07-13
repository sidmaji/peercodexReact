import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const { resendVerification, checkEmailVerification, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      console.log('Checking email verification...'); // Debug log
      const isVerified = await checkEmailVerification();
      console.log('Verification result:', isVerified); // Debug log
      
      if (isVerified) {
        // Navigate to root path to let AuthenticatedRedirect handle proper routing
        navigate('/');
      } else {
        // Check if email is actually verified but function returned false
        if (currentUser) {
          await currentUser.reload();
          console.log('Current user email verified:', currentUser.emailVerified); // Debug log
          if (currentUser.emailVerified) {
            // Email is verified, navigate anyway
            navigate('/');
          } else {
            toast.error('Email not yet verified. Please check your email and click the verification link.');
          }
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      toast.error('Error checking email verification. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await resendVerification();
    } catch (error) {
      console.error('Error resending verification:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-indigo-600">PeerCodex</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Check your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification link to your email address
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Email Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
              <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Please check your email and click the verification link to activate your account.
              </p>
              
              <p className="text-sm text-gray-500">
                After clicking the verification link in your email, click the button below to continue.
              </p>

              <button
                onClick={handleCheckVerification}
                disabled={checking}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checking ? 'Checking...' : 'I\'ve verified my email'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Didn't receive the email?</span>
                </div>
              </div>

              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? 'Sending...' : 'Resend verification email'}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-300">
                <p className="text-xs text-gray-500 text-center">
                  Make sure to check your spam folder if you don't see the email in your inbox.
                </p>
              </div>

              <div className="text-center">
                <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
