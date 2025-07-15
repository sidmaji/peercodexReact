import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const ContactModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            await addDoc(collection(db, 'contactMessages'), {
                name,
                email,
                message,
                createdAt: new Date().toISOString(),
            });
            setSuccess(true);
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            setError('Failed to send message. Please try again.');
        }
        setLoading(false);
    };

    // Reset success and error when modal is closed
    const handleClose = () => {
        setSuccess(false);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in relative border border-gray-100">
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 text-2xl font-bold focus:outline-none"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Us</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Your Email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Your Message"
                            rows={4}
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                    {success && <div className="text-green-600 text-sm mb-2">Message sent!</div>}
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium shadow-md transition"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;
