const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-0 relative animate-fade-in border-2 border-indigo-400 flex flex-col" style={{ maxHeight: '90vh' }}>
                {/* Close button - sticky to top */}
                <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-indigo-200 flex justify-end p-2">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close About"
                        className="text-white bg-indigo-600 hover:bg-indigo-700 font-bold text-2xl w-10 h-10 flex items-center justify-center rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                        &times;
                    </button>
                </div>
                <div className="overflow-y-auto p-8" style={{ maxHeight: 'calc(90vh - 56px)' }}>
                    <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">About PeerCodex</h1>
                    <p className="mb-4 text-gray-700">
                        PeerCodex is a peer-to-peer academic mentorship platform designed for high school students. Our mission is to empower students to learn, connect, and grow by sharing knowledge
                        and supporting each other in AP subjects and academic coursework.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">How It Works</h2>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                        <li>Create a profile and highlight the subjects you can mentor others in.</li>
                        <li>Search for mentors or mentees and send requests with a compelling message.</li>
                        <li>Connect, learn together, and award points to recognize support and guidance.</li>
                        <li>Buy, sell, or exchange used textbooks in our marketplace.</li>
                    </ul>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">Our Values</h2>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                        <li>Collaboration and mutual respect</li>
                        <li>Academic integrity</li>
                        <li>Inclusivity and support</li>
                        <li>Student empowerment</li>
                    </ul>
                    <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">Contact Us</h2>
                    <p className="mb-4 text-gray-700">
                        For questions or feedback, email us at{' '}
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

export default AboutModal
