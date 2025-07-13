import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ALLOWED_TEST_EMAILS } from '../constants'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
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
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center">
                    <h1 className="text-3xl font-bold text-indigo-600">PeerCodeX</h1>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">Welcome back to the peer mentoring community</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                                    emailError ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="first.last.xyz@k12.friscoisd.org"
                            />
                            {emailError && <p className="text-red-600 text-xs mt-1">{emailError}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Sign up
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
