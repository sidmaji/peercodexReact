import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALLOWED_TEST_EMAILS } from '../constants'
import { useAuth } from '../hooks/useAuth'
import Modal from './Modal'

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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

        setLoading(true)
        try {
            const result = await login(formData.email, formData.password)
            if (result.needsVerification) {
                navigate('/verify-email')
            } else {
                navigate('/dashboard')
            }
            onClose()
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setFormData({ email: '', password: '' })
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Sign In">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email (first.last.xyz@k12.friscoisd.org)
                    </label>
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
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Password"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="text-center">
                    <span className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button type="button" onClick={onSwitchToSignup} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </button>
                    </span>
                </div>
            </form>
        </Modal>
    )
}

export default LoginModal
