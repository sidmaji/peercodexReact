const PrivacyPolicy = ({ isOpen, onClose }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-0 relative animate-fade-in border-2 border-indigo-400 flex flex-col" style={{ maxHeight: '90vh' }}>
                {/* Close button - sticky to top */}
                <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-indigo-200 flex justify-end p-2">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close Privacy Policy"
                        className="text-white bg-indigo-600 hover:bg-indigo-700 font-bold text-2xl w-10 h-10 flex items-center justify-center rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                        &times;
                    </button>
                </div>
                <div className="overflow-y-auto p-8" style={{ maxHeight: 'calc(90vh - 56px)' }}>
                    <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Privacy Policy</h1>
                    <p className="mb-4 text-gray-700">
                        Your privacy is important to PeerCodex. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">1. Information We Collect</h2>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                        <li>Account information such as your name, email address, and school details.</li>
                        <li>Mentoring and tutoring activity, including messages and requests.</li>
                        <li>Usage data, such as log files, device information, and analytics.</li>
                    </ul>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                        <li>To provide and improve our mentoring and tutoring services.</li>
                        <li>To communicate with you about your account and activity.</li>
                        <li>To maintain the safety and integrity of the PeerCodex community.</li>
                    </ul>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">3. Sharing of Information</h2>
                    <p className="mb-4 text-gray-700">
                        We do not sell your personal information. We may share information with trusted service providers who help us operate PeerCodex, or if required by law.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">4. Data Security</h2>
                    <p className="mb-4 text-gray-700">We use industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">5. Children's Privacy</h2>
                    <p className="mb-4 text-gray-700">PeerCodex is intended for students age 13 and older. We do not knowingly collect personal information from children under 13.</p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">6. Changes to This Policy</h2>
                    <p className="mb-4 text-gray-700">
                        We may update this Privacy Policy from time to time. Changes will be posted on this page, and continued use of PeerCodex means you accept the updated policy.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">7. Contact</h2>
                    <p className="mb-4 text-gray-700">
                        If you have any questions about this Privacy Policy, please contact us at{' '}
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

export default PrivacyPolicy
