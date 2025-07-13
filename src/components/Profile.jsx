import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';
import { AP_SUBJECTS, SCHOOLS, GRADE_LEVELS } from '../constants';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { submitSchoolRequest } from '../utils/schoolRequests';

const Profile = ({ standalone = true }) => {
  const { userProfile, setUserProfile, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    mentorSubjects: [],
    school: '',
    grade: '',
    phoneNumber: '',
    discord: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSchoolRequest, setShowSchoolRequest] = useState(false);
  const [customSchoolName, setCustomSchoolName] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  useEffect(() => {
    if (userProfile) {
      console.log('UserProfile data:', userProfile); // Debug log
      setEditData({
        mentorSubjects: userProfile.mentorSubjects || [],
        school: userProfile.school || '',
        grade: userProfile.grade || '',
        phoneNumber: userProfile.phoneNumber || '',
        discord: userProfile.discord || ''
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'school' && value === 'REQUEST_NEW_SCHOOL') {
      setShowSchoolRequest(true);
      return;
    }
    
    setEditData(prev => ({
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

  const handleSchoolRequest = async () => {
    if (!customSchoolName.trim()) {
      toast.error('Please enter a school name');
      return;
    }

    setIsSubmittingRequest(true);
    const success = await submitSchoolRequest(customSchoolName, currentUser.uid);
    
    if (success) {
      // Add the requested school to the form data temporarily
      setEditData(prev => ({
        ...prev,
        school: customSchoolName
      }));
      setShowSchoolRequest(false);
      setCustomSchoolName('');
    }
    setIsSubmittingRequest(false);
  };

  // Calculate profile completion percentage
  const calculateCompletionPercentage = () => {
    if (!userProfile) return 0;
    
    const fields = [
      { key: 'firstName', required: true },
      { key: 'lastName', required: true },
      { key: 'email', required: true },
      { key: 'dateOfBirth', required: true },
      { key: 'school', required: true },
      { key: 'grade', required: true },
      { key: 'phoneNumber', required: false },
      { key: 'discord', required: false },
      { key: 'mentorSubjects', required: false, isArray: true }
    ];

    const totalFields = fields.length;
    let completedFields = 0;

    fields.forEach(field => {
      const value = userProfile[field.key];
      if (field.isArray) {
        // For arrays, consider it complete if it has at least one item
        if (value && Array.isArray(value) && value.length > 0) {
          completedFields += 1;
        }
      } else {
        // For regular fields, check if value exists and is not empty
        if (value && value.toString().trim() !== '') {
          completedFields += 1;
        }
      }
    });

    return Math.round((completedFields / totalFields) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  const handleMentorSubjectToggle = (subject) => {
    setEditData(prev => {
      if (prev.mentorSubjects.includes(subject)) {
        // Remove from mentor subjects
        return {
          ...prev,
          mentorSubjects: prev.mentorSubjects.filter(s => s !== subject)
        };
      } else {
        // Add to mentor subjects
        return {
          ...prev,
          mentorSubjects: [...prev.mentorSubjects, subject]
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!editData.school.trim()) {
      newErrors.school = 'School name is required';
    }
    
    if (!editData.grade.trim()) {
      newErrors.grade = 'Grade is required';
    }
    
    if (editData.phoneNumber && !/^\+?[\d\s\-()]+$/.test(editData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const userDoc = doc(db, 'users', userProfile.uid);
      await updateDoc(userDoc, {
        mentorSubjects: editData.mentorSubjects,
        school: editData.school,
        grade: editData.grade,
        phoneNumber: editData.phoneNumber,
        discord: editData.discord,
        updatedAt: new Date()
      });

      setUserProfile(prev => ({
        ...prev,
        mentorSubjects: editData.mentorSubjects,
        school: editData.school,
        grade: editData.grade,
        phoneNumber: editData.phoneNumber,
        discord: editData.discord
      }));

      setIsEditing(false);
      setErrors({});
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setEditData({
      mentorSubjects: userProfile.mentorSubjects || [],
      school: userProfile.school || '',
      grade: userProfile.grade || '',
      phoneNumber: userProfile.phoneNumber || '',
      discord: userProfile.discord || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const profileContent = (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    completionPercentage === 100 ? 'bg-green-500' : 
                    completionPercentage >= 80 ? 'bg-blue-500' :
                    completionPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {completionPercentage}% complete
              </span>
            </div>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <p className="text-gray-900">{userProfile.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <p className="text-gray-900">{userProfile.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{userProfile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <p className="text-gray-900">{userProfile.dateOfBirth}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School *
            </label>
            {isEditing ? (
              <div>
                <select
                  name="school"
                  value={editData.school}
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
                <option value="REQUEST_NEW_SCHOOL">
                  <span className="inline-flex items-center gap-1">
                    <BuildingLibraryIcon className="w-5 h-5 text-indigo-500 inline" />
                    Request to add my school
                  </span>
                </option>
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
                          setEditData(prev => ({...prev, school: ''}));
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-900">{userProfile.school || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level *
            </label>
            {isEditing ? (
              <div>
                <select
                  name="grade"
                  value={editData.grade}
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
            ) : (
              <p className="text-gray-900">{userProfile.grade || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Shared with mentoring connections</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-900">{userProfile.phoneNumber || 'Not provided'}</p>
                {userProfile.phoneNumber && (
                  <p className="text-xs text-gray-500 mt-1">Shared with mentoring connections</p>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discord
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="discord"
                  value={editData.discord}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="username#1234 or @username"
                />
                <p className="text-xs text-gray-500 mt-1">Shared with mentoring connections</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-900">{userProfile.discord || 'Not provided'}</p>
                {userProfile.discord && (
                  <p className="text-xs text-gray-500 mt-1">Shared with mentoring connections</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mentoring Subjects */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <span className="inline-flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5 text-indigo-500 inline" />
            Subjects I Can Mentor
          </span>
        </h2>
        <p className="text-gray-600 mb-4">
          Select subjects where you feel confident helping other students.
        </p>
        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {AP_SUBJECTS.map((subject) => {
              const isSelected = editData.mentorSubjects.includes(subject);
              
              return (
                <button
                  key={subject}
                  onClick={() => handleMentorSubjectToggle(subject)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {subject}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userProfile.mentorSubjects?.length > 0 ? (
              userProfile.mentorSubjects.map((subject) => (
                <span
                  key={subject}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {subject}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No mentoring subjects selected yet</p>
            )}
          </div>
        )}
        {!isEditing && editData.mentorSubjects.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            You can mentor {editData.mentorSubjects.length} subject{editData.mentorSubjects.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );

  return standalone ? (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {profileContent}
      </div>
    </div>
  ) : (
    profileContent
  );
};

export default Profile;
