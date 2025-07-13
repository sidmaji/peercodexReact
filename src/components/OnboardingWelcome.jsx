import { useState } from 'react'

const OnboardingWelcome = ({ onNext }) => {
    const [selectedRole, setSelectedRole] = useState('')

    const handleNext = () => {
        if (selectedRole) {
            onNext({ role: selectedRole })
        }
    }

    const roles = [
        {
            id: 'mentee',
            title: 'Mentee',
            description: 'I want to find mentors to help me with my studies',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            ),
        },
        {
            id: 'mentor',
            title: 'Mentor',
            description: 'I want to help other students with subjects I excel in',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
            ),
        },
        {
            id: 'both',
            title: 'Both',
            description: 'I want to both receive help and offer mentorship',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Welcome to <span className="text-indigo-600">PeerCodex</span>!
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Let's get you set up. First, tell us how you'd like to use PeerCodex.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                selectedRole === role.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <div className={`text-center ${selectedRole === role.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                                <div className="flex justify-center mb-4">{role.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                                <p className="text-gray-600 text-sm">{role.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={handleNext}
                        disabled={!selectedRole}
                        className={`px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                            selectedRole ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OnboardingWelcome
