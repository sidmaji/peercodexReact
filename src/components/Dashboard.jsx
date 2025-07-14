import { AcademicCapIcon, HomeIcon, InboxIcon, PaperAirplaneIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { db } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import FindMentor from './FindMentor'
import Marketplace from './Marketplace'
import Profile from './Profile'
import RequestsReceived from './RequestsReceived'
import RequestsSent from './RequestsSent'

const Dashboard = () => {
    const [totalPointsReceived, setTotalPointsReceived] = useState(0)
    const { currentUser, userProfile, logout } = useAuth()
    const [sentCounts, setSentCounts] = useState({ accepted: 0, pending: 0, rejected: 0 })
    const [receivedCounts, setReceivedCounts] = useState({ accepted: 0, pending: 0, rejected: 0 })
    // Removed duplicate declaration of totalPointsReceived

    useEffect(() => {
        const fetchRequestCounts = async () => {
            if (!currentUser?.uid) return
            // Sent requests
            const sentQ = query(collection(db, 'requests'), where('requestedui', '==', currentUser.uid))
            const sentSnap = await getDocs(sentQ)
            const sent = { accepted: 0, pending: 0, rejected: 0 }
            sentSnap.forEach((doc) => {
                const status = doc.data().status
                if (status === 'accepted') sent.accepted++
                else if (status === 'pending') sent.pending++
                else if (status === 'rejected' || status === 'cancelled') sent.rejected++
            })
            setSentCounts(sent)

            // Received requests
            const receivedQ = query(collection(db, 'requests'), where('requesteeui', '==', currentUser.uid))
            const receivedSnap = await getDocs(receivedQ)
            const received = { accepted: 0, pending: 0, rejected: 0 }
            receivedSnap.forEach((doc) => {
                const status = doc.data().status
                if (status === 'accepted') received.accepted++
                else if (status === 'pending') received.pending++
                else if (status === 'rejected' || status === 'cancelled') received.rejected++
            })
            setReceivedCounts(received)
        }
        fetchRequestCounts()
        // Fetch total points received for mentor
        const fetchTotalPoints = async () => {
            if (!currentUser?.uid) return
            const pointsSnap = await getDocs(collection(db, `users/${currentUser.uid}/points`))
            let total = 0
            pointsSnap.forEach((doc) => {
                total += doc.data().points || 0
            })
            setTotalPointsReceived(total)
        }
        fetchTotalPoints()
    }, [currentUser])
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [activeSection, setActiveSection] = useState('overview')

    const handleSignOut = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Error signing out:', error)
            toast.error('Failed to sign out')
        }
    }

    const navigationItems = [
        { id: 'overview', label: 'Overview', icon: <HomeIcon className="w-6 h-6" />, available: true },
        { id: 'profile', label: 'My Profile', icon: <UserCircleIcon className="w-6 h-6" />, available: true },
        { id: 'find-mentor', label: 'Find Mentor', icon: <AcademicCapIcon className="w-6 h-6" />, available: true },
        { id: 'mentor-requests', label: 'Requests Received', icon: <InboxIcon className="w-6 h-6" />, available: true },
        { id: 'requests-sent', label: 'Requests Sent', icon: <PaperAirplaneIcon className="w-6 h-6" />, available: true },
        { id: 'marketplace', label: 'Marketplace', icon: <SparklesIcon className="w-6 h-6" />, available: true }, // <-- add this
    ]

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return <OverviewContent userProfile={userProfile} currentUser={currentUser} sentCounts={sentCounts} receivedCounts={receivedCounts} totalPointsReceived={totalPointsReceived} />
            case 'profile':
                return <Profile standalone={false} />
            case 'find-mentor':
                return <FindMentor />
            case 'mentor-requests':
                return <RequestsReceived />
            case 'requests-sent':
                return <RequestsSent />
            case 'marketplace':
                return <Marketplace /> // <-- add this
            default:
                return <OverviewContent userProfile={userProfile} currentUser={currentUser} sentCounts={sentCounts} receivedCounts={receivedCounts} totalPointsReceived={totalPointsReceived} />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Navigation */}
            <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {!isSidebarCollapsed && <h2 className="text-xl font-bold text-indigo-600">PeerCodex</h2>}
                        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
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
                                    ? isSidebarCollapsed
                                        ? 'bg-indigo-50 text-indigo-700' // No border when collapsed
                                        : 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                            } ${isSidebarCollapsed ? 'justify-center p-2' : ''}`}
                            title={isSidebarCollapsed ? item.label : ''}
                        >
                            <span className="text-xl flex items-center justify-center">{item.icon}</span>
                            {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
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
                            {/*<h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>*/}
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* User Info */}
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {userProfile?.firstName} {userProfile?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">Student</p>
                                </div>
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 font-semibold text-sm">
                                        {userProfile?.firstName?.charAt(0)}
                                        {userProfile?.lastName?.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            {/* Sign Out Button */}
                            <button onClick={handleSignOut} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
            </div>
        </div>
    )
}

// Content Components
const OverviewContent = ({ userProfile, currentUser, sentCounts, receivedCounts, totalPointsReceived }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                Welcome back, {userProfile?.firstName}!
                <SparklesIcon className="w-6 h-6 text-indigo-500 inline" />
            </h2>
            <p className="text-gray-600 mb-6">Here's what's happening in your PeerCodex journey today.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900">Mentor Requests Sent</h3>
                    <p className="text-2xl font-bold text-blue-700">{sentCounts.accepted + sentCounts.pending + sentCounts.rejected}</p>
                    <p className="text-sm text-blue-600">
                        Accepted: {sentCounts.accepted} | Pending: {sentCounts.pending} | Rejected: {sentCounts.rejected}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900">Mentor Requests Received</h3>
                    <p className="text-2xl font-bold text-green-700">{receivedCounts.accepted + receivedCounts.pending + receivedCounts.rejected}</p>
                    <p className="text-sm text-green-600">
                        Accepted: {receivedCounts.accepted} | Pending: {receivedCounts.pending} | Rejected: {receivedCounts.rejected}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 flex flex-col items-start justify-center">
                    <h3 className="font-semibold text-yellow-900 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-8 0a4 4 0 008 0m-8 0V5a2 2 0 012-2h4a2 2 0 012 2v16m-8 0h8" />
                        </svg>
                        Total Points Received
                    </h3>
                    <p className="text-2xl font-bold text-yellow-700">{totalPointsReceived}</p>
                    <p className="text-sm text-yellow-600">From mentees </p>
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
                        <span className={`ml-1 ${userProfile?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>{userProfile?.emailVerified ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                        <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                        <p className="text-gray-900">{userProfile?.dateOfBirth || 'Not set'}</p>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-500">Member Since:</span>
                        <p className="text-gray-900">{userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default Dashboard
