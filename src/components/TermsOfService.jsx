const TermsOfService = ({ isOpen, onClose }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-0 relative animate-fade-in border-2 border-indigo-400 flex flex-col" style={{ maxHeight: '90vh' }}>
                {/* Close button - sticky to top */}
                <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-indigo-200 flex justify-end p-2">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close Terms of Service"
                        className="text-white bg-indigo-600 hover:bg-indigo-700 font-bold text-2xl w-10 h-10 flex items-center justify-center rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                        &times;
                    </button>
                </div>
                <div className="overflow-y-auto p-8" style={{ maxHeight: 'calc(90vh - 56px)' }}>
                    <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Terms of Service</h1>
                    <p className="mb-4 text-gray-700">Welcome to PeerCodex! By using our website and services, you agree to the following terms and conditions. Please read them carefully.</p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">1. Eligibility</h2>
                    <p className="mb-4 text-gray-700">
                        PeerCodex is intended for high school students seeking academic mentorship and tutoring. You must be at least 13 years old to use this service.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">2. Account Registration</h2>
                    <p className="mb-4 text-gray-700">
                        You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">3. Code of Conduct</h2>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                        <li>Respect all members of the PeerCodex community.</li>
                        <li>Do not share inappropriate, offensive, or harmful content.</li>
                        <li>Use the platform only for academic mentoring and tutoring purposes.</li>
                        <li>Do not attempt to impersonate others or provide false information.</li>
                    </ul>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">4. Privacy</h2>
                    <p className="mb-4 text-gray-700">Your privacy is important to us. Please review our Privacy Policy to understand how your information is collected, used, and protected.</p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">5. Content Ownership</h2>
                    <p className="mb-4 text-gray-700">
                        You retain ownership of the content you create and share on PeerCodex. By posting content, you grant PeerCodex a license to use, display, and distribute it within the platform.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">6. Termination</h2>
                    <p className="mb-4 text-gray-700">PeerCodex reserves the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.</p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">7. Changes to Terms</h2>
                    <p className="mb-4 text-gray-700">We may update these Terms of Service from time to time. Continued use of PeerCodex after changes constitutes acceptance of the new terms.</p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">8. Contact</h2>
                    <p className="mb-4 text-gray-700">
                        If you have any questions about these terms, please contact us at{' '}
                        <a href="mailto:info@peercodex.com" className="text-indigo-600 underline">
                            info@peercodex.com
                        </a>
                        .
                    </p>
                    <div className="text-center mt-8 text-gray-500 text-sm">&copy; 2025 PeerCodex. All rights reserved.</div>
                </div>
            </div>
        </div>
    )
}

export default TermsOfService
