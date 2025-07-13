import { useState } from 'react'
import { AP_SUBJECTS } from '../constants'

const OnboardingSubjects = ({ onNext, onBack }) => {
    const [mentorSubjects, setMentorSubjects] = useState([])

    const handleSubjectToggle = (subject) => {
        setMentorSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
    }

    const handleNext = () => {
        onNext({ mentorSubjects })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Welcome to <span className="text-indigo-600">PeerCodex</span>!
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">Which subjects would you be able to mentor other students on?</p>
                    <p className="text-gray-500">Select any subjects you feel confident helping others with. You can always update this later.</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">🎓 Subjects I Can Mentor</h2>
                    <p className="text-gray-600 mb-6">Choose subjects where you can offer help and guidance to fellow students.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {AP_SUBJECTS.map((subject) => (
                            <button
                                key={subject}
                                onClick={() => handleSubjectToggle(subject)}
                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                    mentorSubjects.includes(subject) ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                    {mentorSubjects.length > 0 && (
                        <div className="mt-4 text-sm text-gray-600">
                            Selected {mentorSubjects.length} subject{mentorSubjects.length !== 1 ? 's' : ''} to mentor
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 transition-colors">
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                    >
                        Complete Setup
                    </button>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">Don't worry if you're not sure - you can always update your mentoring subjects later in your profile.</p>
                </div>
            </div>
        </div>
    )
}

export default OnboardingSubjects
