import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

const Marketplace = () => {
    const { currentUser, userProfile } = useAuth()
    const [books, setBooks] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        name: '',
        author: '',
        year: '',
        condition: 'new',
        price: '',
        contact: '',
    })
    const [loading, setLoading] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({})

    // Fetch books from Firestore
    const fetchBooks = async () => {
        setLoading(true)
        const q = query(collection(db, 'marketplace'), where('status', 'in', ['available', 'sold']))
        const snap = await getDocs(q)
        const items = []
        snap.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() })
        })
        setBooks(items)
        setLoading(false)
    }

    // Initial fetch (fix: use useEffect instead of useState)
    useEffect(() => {
        fetchBooks()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddBook = async (e) => {
        e.preventDefault()
        if (!currentUser || !userProfile) {
            toast.error('You must be logged in to list a book.')
            return
        }

        // Phone validation (contact field, must be exactly 10 digits)
        const digits = form.contact.replace(/\D/g, '')
        if (!form.contact.trim() || digits.length !== 10) {
            setFormErrors({ contact: 'Please enter a valid 10-digit phone number.' })
            return
        }
        setFormErrors({})

        setFormLoading(true)
        try {
            const listedDate = new Date().toISOString()
            await addDoc(collection(db, 'marketplace'), {
                ...form,
                year: Number(form.year),
                price: Number(form.price),
                status: 'available',
                listedDate,
                userId: currentUser.uid,
                userName: `${userProfile.firstName} ${userProfile.lastName}`,
                userEmail: currentUser.email,
                removeAfter: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
            })
            toast.success('Book listed!')
            setForm({
                name: '',
                author: '',
                year: '',
                condition: 'new',
                price: '',
                contact: '',
            })
            setShowForm(false)
            fetchBooks()
        } catch (err) {
            toast.error('Failed to list book' + err.message)
        }
        setFormLoading(false)
    }

    const handleUpdateStatus = async (bookId, newStatus) => {
        const book = books.find(b => b.id === bookId)
        if (!book || book.userId !== currentUser?.uid) {
            toast.error('You can only update your own listings.')
            return
        }
        try {
            await updateDoc(doc(db, 'marketplace', bookId), { status: newStatus })
            toast.success('Status updated')
            fetchBooks()
        } catch {
            toast.error('Failed to update status')
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Used Books</h1>
                    <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-600">Listings are automatically removed after <span className="font-semibold text-indigo-600">60 days</span>.</span>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + List a Book
                </button>
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative border-2 border-indigo-400">
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-white bg-indigo-600 hover:bg-indigo-700 font-bold text-2xl w-10 h-10 flex items-center justify-center rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            onClick={() => setShowForm(false)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">List a Book</h2>
                        <form onSubmit={handleAddBook} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Name *</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Book Name"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                                    <input
                                        name="author"
                                        value={form.author}
                                        onChange={handleChange}
                                        placeholder="Author"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                                    <input
                                        name="year"
                                        value={form.year}
                                        onChange={handleChange}
                                        placeholder="Year"
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                                    <select
                                        name="condition"
                                        value={form.condition}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="new">New</option>
                                        <option value="like new">Like New</option>
                                        <option value="marked">Marked</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                    <input
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="Price"
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info *</label>
                                    <input
                                        name="contact"
                                        value={form.contact}
                                        onChange={handleChange}
                                        placeholder="Contact Info (Phone number)"
                                        required
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${formErrors.contact ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.contact && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.contact}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end mt-8 space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    disabled={formLoading}
                                >
                                    {formLoading ? 'Listing...' : 'List Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Book Listings Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Listed Books</h2>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mr-4"></div>
                        <span className="text-lg text-gray-600">Loading books...</span>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {books.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 py-12 text-lg">No books listed yet.</div>
                        ) : (
                            books.map((book, idx) => (
                                <div key={book.id || idx} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-lg font-bold text-indigo-700">{book.name}</span>
                                        <span className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-600 font-semibold">{book.condition}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-1">by {book.author} ({book.year})</div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded">${book.price}</span>
                                        <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded">Contact: {book.contact}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">Listed by <span className="font-semibold">{book.userName}</span> on {book.listedDate ? new Date(book.listedDate).toLocaleDateString() : ''}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${book.status === 'available' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{book.status}</span>
                                        {book.userId === currentUser?.uid && (
                                            <select
                                                value={book.status}
                                                onChange={e => handleUpdateStatus(book.id, e.target.value)}
                                                className="px-2 py-1 border rounded text-xs"
                                            >
                                                <option value="available">Available</option>
                                                <option value="sold">Sold</option>
                                            </select>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>


        </div>
    )
}

export default Marketplace
