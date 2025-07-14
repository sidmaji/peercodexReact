import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { ALLOWED_TEST_EMAILS } from '../constants'
import { useAuth } from '../hooks/useAuth'
import Modal from './Modal'
import TermsOfService from './TermsOfService'

// List of allowed test emails (case-insensitive)
// const ALLOWED_TEST_EMAILS = new Set(['test1@gmail.com', 'test2@gmail.com', 'admin@peercodex.org', 'dev@peercodex.org'])

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        termsAccepted: false,
    })
    const [loading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState('')
    const { signup } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const emailLower = formData.email.trim().toLowerCase()
        if (!emailLower.endsWith('@k12.friscoisd.org') && !ALLOWED_TEST_EMAILS.has(emailLower)) {
            setEmailError('Use your school email only (must end with @k12.friscoisd.org)')
            return
        } else {
            setEmailError('')
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (!formData.termsAccepted) {
            toast.error('Please accept the terms of service')
            return
        }

        if (!formData.dateOfBirth) {
            toast.error('Please provide your date of birth')
            return
        }

        setLoading(true)
        try {
            const result = await signup(formData.email, formData.password, formData.firstName, formData.lastName, formData.dateOfBirth)

            if (result.needsVerification) {
                navigate('/verify-email')
                onClose()
            }
        } catch (error) {
            console.error('Signup error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            termsAccepted: false,
        })
        onClose()
    }

    const [showTerms, setShowTerms] = useState(false);
    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create Account">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="First name"
                    />
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Last name"
                    />
                </div>

                {/* Email and Password Group */}
                <div className="space-y-3">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="first.last.xyz@k12.friscoisd.org"
                    />
                    {emailError && <p className="text-red-600 text-xs mt-1">{emailError}</p>}
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Password"
                    />
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Confirm password"
                    />
                </div>

                {/* Date of Birth */}
                <div className="relative">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                    </label>
                    <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 22)).toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Terms of Service */}
                <div className="flex items-start">
                    <input
                        id="termsAccepted"
                        name="termsAccepted"
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                    />
                    <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
                        I accept the{' '}
                        <button
                            type="button"
                            className="text-indigo-600 hover:text-indigo-500 underline bg-transparent border-none p-0 m-0 cursor-pointer"
                            onClick={() => setShowTerms(true)}
                        >
                            Terms of Service
                        </button>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !formData.termsAccepted}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="text-center">
                    <span className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button type="button" onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </button>
                    </span>
                </div>
            </form>
            {/* Terms of Service Modal */}
            <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </Modal>
    )
}

export default SignupModal
