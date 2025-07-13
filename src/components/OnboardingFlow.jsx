import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';
import OnboardingDetails from './OnboardingDetails';
import OnboardingSubjects from './OnboardingSubjects';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState('details'); // 'details' or 'subjects'
  const [detailsData, setDetailsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, setUserProfile, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleDetailsNext = (data) => {
    // Validate email confirmation
    if (data.emailConfirm !== userProfile?.email) {
      toast.error('Email confirmation does not match your account email');
      return;
    }
    
    setDetailsData(data);
    setCurrentStep('subjects');
  };

  const handleDetailsBack = () => {
    // Go back to dashboard or wherever they came from
    navigate('/dashboard');
  };

  const handleSubjectsBack = () => {
    setCurrentStep('details');
  };

  const handleComplete = async (subjectsData) => {
    setIsLoading(true);
    try {
      // Combine details and subjects data
      const completeData = {
        ...detailsData,
        ...subjectsData,
        role: 'student', // All users are students now
        onboardingCompleted: true,
        updatedAt: new Date()
      };

      // Update user profile in Firestore
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, completeData);

      // Update local user profile
      setUserProfile(prev => ({
        ...prev,
        ...completeData
      }));

      toast.success('Welcome to PeerCodex! Your profile has been set up.');
      
      // Navigate to dashboard after successful completion
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete setup. Please try again.');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'details') {
    return (
      <OnboardingDetails
        onNext={handleDetailsNext}
        onBack={handleDetailsBack}
      />
    );
  }

  return (
    <OnboardingSubjects
      onNext={handleComplete}
      onBack={handleSubjectsBack}
    />
  );
};

export default OnboardingFlow;
