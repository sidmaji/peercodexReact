import { useState } from 'react'
import AboutModal from './AboutModal'
import CareerModal from './CareerModal'
import ContactModal from './ContactModal'
import LoginModal from './LoginModal'
import PrivacyPolicy from './PrivacyPolicy'
import SignupModal from './SignupModal'

const LandingPage = ({ openTerms }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
    const [isCareerModalOpen, setIsCareerModalOpen] = useState(false)

    const openLoginModal = () => {
        setIsLoginModalOpen(true)
        setIsSignupModalOpen(false)
        setIsMenuOpen(false)
    }

    const openSignupModal = () => {
        setIsSignupModalOpen(true)
        setIsLoginModalOpen(false)
        setIsMenuOpen(false)
    }

    const closeModals = () => {
        setIsLoginModalOpen(false)
        setIsSignupModalOpen(false)
        setIsContactModalOpen(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm fixed w-full top-0 z-50 backdrop-blur-md">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-indigo-600">PeerCodex</h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <button onClick={openLoginModal} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out">
                                    Login
                                </button>
                                <button
                                    onClick={openSignupModal}
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-indigo-600 p-2 transition-colors duration-200">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden animate-fade-in">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                <button
                                    onClick={openLoginModal}
                                    className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={openSignupModal}
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section - Full Screen */}
            <div className="min-h-[60vh] flex items-center justify-center pt-20 pb-8">
                <div className="w-full text-center animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                        Connect. Learn. <span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">Grow.</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-4 leading-relaxed px-2">
                        PeerCodex brings together high school students for peer-to-peer mentoring in AP subjects and academic coursework.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-6 leading-relaxed px-2 max-w-3xl mx-auto">
                        Whether you're struggling with AP Chemistry, need help with Calculus, or want to share your expertise in any subject, find your perfect mentor or mentee in our supportive
                        academic community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center px-2">
                        <button
                            onClick={openSignupModal}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded-lg text-base font-medium transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            Join as a Student
                        </button>
                        <button
                            onClick={openSignupModal}
                            className="bg-white text-indigo-600 hover:bg-gray-50 border-2 border-indigo-600 px-6 py-2 rounded-lg text-base font-medium transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg backdrop-blur-sm"
                        >
                            Become a Mentor
                        </button>
                    </div>
                </div>
            </div>

            {/* Marketplace Hero Section - Used Books */}
            <div className="min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 py-12">
                <div className="w-full text-center animate-fade-in">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">Marketplace for Used Books</h2>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-4 leading-relaxed px-2 max-w-2xl mx-auto">
                        Buy, sell, or exchange used textbooks and study materials with fellow students. Save money, reduce waste, and help others succeed by sharing your resources.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center px-2 mt-4">
                        <button
                            onClick={openSignupModal}
                            className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-2 rounded-lg text-base font-medium transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            List a Book
                        </button>
                        <button
                            onClick={openSignupModal}
                            className="bg-white text-orange-600 hover:bg-gray-50 border-2 border-orange-500 px-6 py-2 rounded-lg text-base font-medium transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg backdrop-blur-sm"
                        >
                            Browse Marketplace
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="min-h-[40vh] flex items-center justify-center bg-white">
                <div className="w-full py-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text px-2">
                        How PeerCodex Works
                    </h2>
                    <div className="grid lg:grid-cols-3 gap-4 px-2 lg:px-6 xl:px-10 2xl:px-16">
                        <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300 ease-in-out">
                            <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:shadow-lg transition-shadow duration-300">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">Create Your Profile</h3>
                            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
                                Sign up with your student email and create a profile highlighting the subjects you can mentor others in.
                            </p>
                        </div>

                        <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300 ease-in-out">
                            <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:shadow-lg transition-shadow duration-300">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">Find Your Match</h3>
                            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
                                Search for the perfect mentor, send a compelling request explaining your goals, and get accepted.
                            </p>
                        </div>

                        <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300 ease-in-out">
                            <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:shadow-lg transition-shadow duration-300">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">Start Learning</h3>
                            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
                                Make connections with your mentor, learn together, and award points to recognize their support and guidance.
                            </p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl p-4 mx-2 lg:mx-6 xl:mx-10 2xl:mx-16 backdrop-blur-sm border border-white/20">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                            <div className="group">
                                <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                                    500+
                                </div>
                                <div className="text-base lg:text-lg text-gray-600">Students Connected</div>
                            </div>
                            <div className="group">
                                <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                                    150+
                                </div>
                                <div className="text-base lg:text-lg text-gray-600">Study Sessions</div>
                            </div>
                            <div className="group">
                                <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                                    50+
                                </div>
                                <div className="text-base lg:text-lg text-gray-600">Academic Subjects</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="w-full px-4 lg:px-8 xl:px-16 2xl:px-24">
                    <div className="text-center">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">PeerCodex</h3>
                        <p className="text-lg lg:text-xl text-gray-400 mb-8 max-w-4xl mx-auto">Empowering high school students through peer-to-peer academic mentorship.</p>
                        <div className="flex justify-center space-x-6 lg:space-x-8 mb-8">
                            <a href="/about" className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors">
                                <span
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setIsAboutModalOpen(true)
                                    }}
                                >
                                    About
                                </span>
                            </a>
                            <a href="/privacy" className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors">
                                <span
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setIsPrivacyModalOpen(true)
                                    }}
                                >
                                    Privacy
                                </span>
                            </a>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    openTerms()
                                }}
                                className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                            >
                                Terms
                            </button>
                            <a href="/contact" className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors">
                                <span
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setIsContactModalOpen(true)
                                    }}
                                >
                                    Contact
                                </span>
                            </a>
                            <a href="/career" className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors">
                                <span
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setIsCareerModalOpen(true)
                                    }}
                                >
                                    Career Opportunities
                                </span>
                            </a>
                        </div>
                        <div className="pt-6 border-t border-gray-800 text-gray-400">
                            <p className="text-base lg:text-lg">&copy; 2025 PeerCodex. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Login Modal */}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeModals} onSwitchToSignup={openSignupModal} />

            {/* Signup Modal */}
            <SignupModal isOpen={isSignupModalOpen} onClose={closeModals} onSwitchToLogin={openLoginModal} />

            {/* Contact Modal */}
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

            {/* Privacy Policy Modal */}
            <PrivacyPolicy isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />

            {/* About Modal */}
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />

            {/* Career Opportunities Modal */}
            <CareerModal isOpen={isCareerModalOpen} onClose={() => setIsCareerModalOpen(false)} />
        </div>
    )
}

export default LandingPage
