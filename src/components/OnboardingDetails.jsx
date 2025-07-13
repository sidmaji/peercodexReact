import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SCHOOLS, GRADE_LEVELS } from '../constants';
import { submitSchoolRequest } from '../utils/schoolRequests';
import { toast } from 'react-hot-toast';

const OnboardingDetails = ({ onNext }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    school: '',
    grade: '',
    phoneNumber: '',
    discord: '',
    emailConfirm: ''
  });
  const [errors, setErrors] = useState({});
  const [showSchoolRequest, setShowSchoolRequest] = useState(false);
  const [customSchoolName, setCustomSchoolName] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'school' && value === 'REQUEST_NEW_SCHOOL') {
      setShowSchoolRequest(true);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.school.trim()) {
      newErrors.school = 'School name is required';
    }
    
    if (!formData.grade.trim()) {
      newErrors.grade = 'Grade is required';
    }
    
    // Phone number is optional, but if provided, it should be valid
    if (formData.phoneNumber.trim() && !/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.emailConfirm.trim()) {
      newErrors.emailConfirm = 'Please confirm your email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleSchoolRequest = async () => {
    if (!customSchoolName.trim()) {
      toast.error('Please enter a school name');
      return;
    }

    setIsSubmittingRequest(true);
    const success = await submitSchoolRequest(customSchoolName, currentUser.uid);
    
    if (success) {
      // Add the requested school to the form data temporarily
      setFormData(prev => ({
        ...prev,
        school: customSchoolName
      }));
      setShowSchoolRequest(false);
      setCustomSchoolName('');
    }
    setIsSubmittingRequest(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tell us about yourself
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Help us create your profile with some additional information
          </p>
          <p className="text-sm text-gray-500">
            Your phone number and Discord will only be shared with students you choose to mentor or get mentored by
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="space-y-6">
            {/* School */}
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <select
                id="school"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.school ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your school</option>
                {SCHOOLS.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
                <option value="REQUEST_NEW_SCHOOL">🏫 Request to add my school</option>
              </select>
              {errors.school && (
                <p className="mt-1 text-sm text-red-600">{errors.school}</p>
              )}
              
              {/* School Request Modal */}
              {showSchoolRequest && (
                <div className="mt-4 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                  <h4 className="font-medium text-gray-900 mb-2">Request New School</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Can't find your school? We'll add it to our list after review.
                  </p>
                  <input
                    type="text"
                    value={customSchoolName}
                    onChange={(e) => setCustomSchoolName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-3"
                    placeholder="Enter your school name"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSchoolRequest}
                      disabled={isSubmittingRequest}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmittingRequest ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button
                      onClick={() => {
                        setShowSchoolRequest(false);
                        setFormData(prev => ({...prev, school: ''}));
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Grade */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level *
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.grade ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your grade level</option>
                {GRADE_LEVELS.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
                <span className="text-xs text-gray-500 ml-1">
                  (optional - will be shared with accepted connections)
                </span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Discord */}
            <div>
              <label htmlFor="discord" className="block text-sm font-medium text-gray-700 mb-2">
                Discord Username
                <span className="text-xs text-gray-500 ml-1">
                  (optional - will be shared with accepted connections)
                </span>
              </label>
              <input
                type="text"
                id="discord"
                name="discord"
                value={formData.discord}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="username#1234 or @username"
              />
            </div>

            {/* Email Confirmation */}
            <div>
              <label htmlFor="emailConfirm" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Email Address *
              </label>
              <input
                type="email"
                id="emailConfirm"
                name="emailConfirm"
                value={formData.emailConfirm}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.emailConfirm ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your email address"
              />
              {errors.emailConfirm && (
                <p className="mt-1 text-sm text-red-600">{errors.emailConfirm}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                setFormData({ school: '', grade: '', phoneNumber: '', discord: '', emailConfirm: '' });
                setErrors({});
              }}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            📱 Your contact information helps facilitate better mentoring connections
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDetails;
