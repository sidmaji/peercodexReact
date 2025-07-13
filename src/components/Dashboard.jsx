import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import Profile from './Profile';

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊', available: true },
    { id: 'profile', label: 'My Profile', icon: '👤', available: true },
    { id: 'find-help', label: 'Find Help', icon: '🔍', available: true },
    { id: 'help-requests', label: 'Help Requests', icon: '📤', available: true },
    { id: 'mentor-requests', label: 'Mentor Requests', icon: '📥', available: true },
    { id: 'connections', label: 'My Connections', icon: '👥', available: true },
    { id: 'sessions', label: 'Study Sessions', icon: '📚', available: true },
    { id: 'messages', label: 'Messages', icon: '💬', available: true },
    { id: 'settings', label: 'Settings', icon: '⚙️', available: true },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewContent userProfile={userProfile} currentUser={currentUser} />;
      case 'profile':
        return <Profile standalone={false} />;
      case 'find-help':
        return <FindHelpContent />;
      case 'help-requests':
        return <HelpRequestsContent />;
      case 'mentor-requests':
        return <MentorRequestsContent />;
      case 'connections':
        return <ConnectionsContent />;
      case 'sessions':
        return <SessionsContent />;
      case 'messages':
        return <MessagesContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <OverviewContent userProfile={userProfile} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <h2 className="text-xl font-bold text-indigo-600">PeerCodex</h2>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isSidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              title={isSidebarCollapsed ? item.label : ''}
            >
              <span className="text-xl">{item.icon}</span>
              {!isSidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Student
                  </p>
                </div>
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {userProfile?.firstName?.charAt(0)}{userProfile?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Content Components
const OverviewContent = ({ userProfile, currentUser }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Welcome back, {userProfile?.firstName}! 👋
      </h2>
      <p className="text-gray-600 mb-6">
        Here's what's happening in your PeerCodex journey today.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900">Active Sessions</h3>
          <p className="text-2xl font-bold text-blue-700">3</p>
          <p className="text-sm text-blue-600">Upcoming this week</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <h3 className="font-semibold text-green-900">Connections</h3>
          <p className="text-2xl font-bold text-green-700">12</p>
          <p className="text-sm text-green-600">Mentors & Mentees</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900">Subjects</h3>
          <p className="text-2xl font-bold text-purple-700">
            {(userProfile?.menteeSubjects?.length || 0) + (userProfile?.mentorSubjects?.length || 0)}
          </p>
          <p className="text-sm text-purple-600">Learning & Teaching</p>
        </div>
      </div>
    </div>

    {/* Profile Summary */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <p className="text-gray-900">{currentUser?.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Role:</span>
            <p className="text-gray-900 capitalize">{userProfile?.role}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Email Verified:</span>
            <span className={`ml-1 ${userProfile?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
              {userProfile?.emailVerified ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
            <p className="text-gray-900">{userProfile?.dateOfBirth || 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Member Since:</span>
            <p className="text-gray-900">
              {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-green-500">✅</span>
          <div>
            <p className="text-sm font-medium">Profile setup completed</p>
            <p className="text-xs text-gray-500">Welcome to PeerCodex!</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-blue-500">📚</span>
          <div>
            <p className="text-sm font-medium">Ready to start your mentoring journey</p>
            <p className="text-xs text-gray-500">Explore the features in the sidebar</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MentorSearchContent = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Mentors</h2>
      <p className="text-gray-600 mb-6">
        Search for mentors who can help you with your academic subjects.
      </p>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by subject, name, or expertise..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="text-center text-gray-500 py-12">
        <p>🔍 Mentor search functionality coming soon...</p>
        <p className="text-sm mt-2">You'll be able to browse mentors by subject and send connection requests.</p>
      </div>
    </div>
  </div>
);

const MentorRequestsSentContent = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Mentor Requests Sent</h2>
    <p className="text-gray-600 mb-6">
      Track the status of your mentor requests.
    </p>
    <div className="text-center text-gray-500 py-12">
      <p>📤 No requests sent yet.</p>
      <p className="text-sm mt-2">Start by finding mentors in the "Find Mentors" section!</p>
    </div>
  </div>
);

const MentorRequestsReceivedContent = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Mentor Requests Received</h2>
    <p className="text-gray-600 mb-6">
      Review and respond to mentoring requests from students.
    </p>
    <div className="text-center text-gray-500 py-12">
      <p>📥 No requests received yet.</p>
      <p className="text-sm mt-2">Students will be able to find you and send mentoring requests.</p>
    </div>
  </div>
);

const MyMenteesContent = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">My Mentees</h2>
    <p className="text-gray-600 mb-6">
      Manage your current mentoring relationships.
    </p>
    <div className="text-center text-gray-500 py-12">
      <p>👥 No mentees yet.</p>
      <p className="text-sm mt-2">Accept some mentoring requests to get started!</p>
    </div>
  </div>
);

const SessionsContent = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Study Sessions</h2>
    <p className="text-gray-600 mb-6">
      Schedule and manage your tutoring sessions.
    </p>
    <div className="text-center text-gray-500 py-12">
      <p>📚 No sessions scheduled yet.</p>
      <p className="text-sm mt-2">Sessions will appear here once you connect with mentors or mentees.</p>
    </div>
  </div>
);

const MessagesContent = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
    <p className="text-gray-600 mb-6">
      Communicate with your mentors and mentees.
    </p>
    <div className="text-center text-gray-500 py-12">
      <p>💬 No messages yet.</p>
      <p className="text-sm mt-2">Start conversations with your connections here.</p>
    </div>
  </div>
);

const SettingsContent = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
    <p className="text-gray-600 mb-6">
      Manage your account settings and preferences.
    </p>
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Account preferences and security settings.</p>
      </div>
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="text-sm text-gray-500 mt-1">Manage how you receive notifications.</p>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Control your profile visibility and data sharing.</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
