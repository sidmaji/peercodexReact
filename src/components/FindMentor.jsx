import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { useState } from 'react'
import { AP_SUBJECTS, SCHOOLS, GRADE_LEVELS } from '../constants'
import { db } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import Select from 'react-select'

const FindMentor = ({ onSearch }) => {
    const [criteria, setCriteria] = useState({
        school: '',
        subjects: [],
        grade: '',
    })
    const { currentUser } = useAuth()
    const [results, setResults] = useState(null) // null = not searched yet
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalMentor, setModalMentor] = useState(null)
    const [requestMsg, setRequestMsg] = useState('')
    const [sending, setSending] = useState(false)
    const [toastMsg, setToastMsg] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setCriteria((prev) => ({ ...prev, [name]: value }))
    }

    

    const handleSubjectsChange = (selectedOptions) => {
        setCriteria((prev) => ({ ...prev, subjects: selectedOptions ? selectedOptions.map(opt => opt.value) : [] }))
    }

    // Real Firestore query for mentors
    const handleSearch = async (e) => {
        e.preventDefault()
        if (criteria.subjects.length === 0) {
            setToastMsg('Please select at least one subject to search for mentors.')
            return
        }
        setLoading(true)
        // Build Firestore query
        try {
            let q = query(collection(db, 'users'), where('onboardingCompleted', '==', true))
            const snapshot = await getDocs(q)
            let mentors = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                if (data.uid && currentUser?.uid && data.uid === currentUser.uid) return
                const subjectsMatch = Array.isArray(data.mentorSubjects) && criteria.subjects.some((subj) => data.mentorSubjects.includes(subj))
                const schoolMatch = !criteria.school || data.school === criteria.school
                const gradeMatch = !criteria.grade || data.grade === criteria.grade
                if (subjectsMatch && schoolMatch && gradeMatch) {
                    mentors.push({
                        uid: data.uid,
                        name: `${data.firstName} ${data.lastName}`,
                        school: data.school,
                        grade: data.grade,
                        subjects: data.mentorSubjects,
                        email: data.email,
                        discord: data.discord,
                        phoneNumber: data.phoneNumber,
                    })
                }
            })
            setResults(mentors)
        } catch {
            setResults([])
        }
        setLoading(false)
        if (onSearch) onSearch(criteria)
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-full">
                {/* Header Section */}
                <div className="mb-6 ">
                    <h2 className="text-2xl font-bold text-indigo-700">Find Your Mentor</h2>
                    <p className="text-gray-500 mt-2 text-base">Search for mentors by subject or school. Connect and start learning together!</p>
                </div>

                <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* School Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Any specific school you want to connect with?</label>
                            <select
                                name="school"
                                value={criteria.school}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                            >
                                <option value="">Select school</option>
                                {SCHOOLS.map((school) => (
                                    <option key={school} value={school}>
                                        {school}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Grade Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Any specific grade you want to connect with?</label>
                            <select
                                name="grade"
                                value={criteria.grade}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                            >
                                <option value="">Select grade</option>
                                {GRADE_LEVELS.map((grade) => (
                                    <option key={grade} value={grade}>
                                        {grade}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Subjects Multi-select (React Select) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subjects (Select at least one) *</label>
                        <Select
                            isMulti
                            options={AP_SUBJECTS.map(subj => ({ value: subj, label: subj }))}
                            value={criteria.subjects.map(subj => ({ value: subj, label: subj }))}
                            onChange={handleSubjectsChange}
                            classNamePrefix="react-select"
                            placeholder="Select subjects..."
                            styles={{
                                placeholder: (base) => ({
                                    ...base,
                                    fontSize: '1rem',
                                    fontWeight: '400',
                                    color: '#374151',
                                    opacity: 1,
                                }),
                                indicatorsContainer: (base) => ({
                                    ...base,
                                    opacity: 1,
                                }),
                                dropdownIndicator: (base) => ({
                                    ...base,
                                    opacity: 1,
                                    color: '#374151',
                                })
                            }}
                        />
                        {criteria.subjects.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                Selected {criteria.subjects.length} subject{criteria.subjects.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl">
                            Search
                        </button>
                    </div>
                </form>
                {/* Search Results */}
                {results !== null && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mentor Results</h2>
                        {loading ? (
                            <div className="text-center text-gray-500 py-8">Searching mentors...</div>
                        ) : results.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">No mentors available for your criteria.</div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {results.map((mentor, idx) => (
                                    <div key={idx} className="bg-white rounded-xl shadow-lg p-5 flex flex-col gap-3 border border-indigo-100 hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">
                                                {mentor.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg text-indigo-700">{mentor.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {mentor.school}{mentor.grade ? ` • ${mentor.grade}` : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {mentor.subjects.map((subject, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium whitespace-nowrap max-w-[120px] truncate border border-indigo-200"
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 items-center text-sm mt-2">
                                            <button
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                                onClick={() => {
                                                    setModalMentor(mentor)
                                                    setShowModal(true)
                                                    setRequestMsg('')
                                                }}
                                            >
                                                Connect
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {/* Connect Modal */}
                {showModal && modalMentor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative">
                            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h3 className="text-xl font-bold text-indigo-700 mb-2">Connect with {modalMentor.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">Send a brief request (max 100 words) to introduce yourself and explain why you'd like to connect.</p>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                rows={4}
                                maxLength={600}
                                value={requestMsg}
                                onChange={(e) => setRequestMsg(e.target.value)}
                                placeholder="Write your request here (max 100 words)..."
                            />
                            <div className="flex justify-end">
                                <button
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                    disabled={sending || requestMsg.trim().split(/\s+/).length > 100 || requestMsg.trim().length === 0}
                                    onClick={async () => {
                                        setSending(true)
                                        try {
                                            await addDoc(collection(db, 'requests'), {
                                                requesteeui: modalMentor.uid,
                                                requestedui: currentUser?.uid || '',
                                                message: requestMsg.trim(),
                                                time: new Date().toISOString(),
                                                status: 'pending',
                                            })
                                            setShowModal(false)
                                            setToastMsg('Request sent successfully!')
                                        } catch {
                                            setToastMsg('Failed to send request.')
                                        }
                                        setSending(false)
                                    }}
                                >
                                    {sending ? 'Sending...' : 'Send Request'}
                                </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">{requestMsg.trim().split(/\s+/).length} / 100 words</div>
                        </div>
                    </div>
                )}
                {/* Toast Message */}
                {toastMsg && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center text-sm font-medium">
                        {toastMsg}
                        <button className="ml-4 text-white/80" onClick={() => setToastMsg('')}>
                            Dismiss
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FindMentor
