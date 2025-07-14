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
    const [formLoading, setFormLoading] = useState(false) // <-- add this

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
        setFormLoading(true) // <-- use formLoading for modal
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
        setFormLoading(false) // <-- use formLoading for modal
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
        } catch (err) {
            toast.error('Failed to update status')
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Marketplace - Used Books</h1>
            <div className="mb-4">
                <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    onClick={() => setShowForm(true)}
                >
                    Add Book
                </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
                Listings will be automatically removed after 60 days.
            </p>
            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">List a Book</h2>
                        <form onSubmit={handleAddBook}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Book Name"
                                    required
                                    className="px-3 py-2 border rounded"
                                />
                                <input
                                    name="author"
                                    value={form.author}
                                    onChange={handleChange}
                                    placeholder="Author"
                                    required
                                    className="px-3 py-2 border rounded"
                                />
                                <input
                                    name="year"
                                    value={form.year}
                                    onChange={handleChange}
                                    placeholder="Year"
                                    type="number"
                                    required
                                    className="px-3 py-2 border rounded"
                                />
                                <select
                                    name="condition"
                                    value={form.condition}
                                    onChange={handleChange}
                                    className="px-3 py-2 border rounded"
                                >
                                    <option value="new">New</option>
                                    <option value="like new">Like New</option>
                                    <option value="marked">Marked</option>
                                </select>
                                <input
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="Price"
                                    type="number"
                                    required
                                    className="px-3 py-2 border rounded"
                                />
                                <input
                                    name="contact"
                                    value={form.contact}
                                    onChange={handleChange}
                                    placeholder="Contact Info"
                                    required
                                    className="px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end mt-6 space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    disabled={formLoading}
                                >
                                    {formLoading ? 'Listing...' : 'List Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Book Name</th>
                        <th className="py-2 px-4 border-b">Author</th>
                        <th className="py-2 px-4 border-b">Year</th>
                        <th className="py-2 px-4 border-b">Condition</th>
                        <th className="py-2 px-4 border-b">Price ($)</th>
                        <th className="py-2 px-4 border-b">Contact</th>
                        <th className="py-2 px-4 border-b">Listed By</th>
                        <th className="py-2 px-4 border-b">Listed Date</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, idx) => (
                        <tr key={book.id || idx}>
                            <td className="py-2 px-4 border-b">{book.name}</td>
                            <td className="py-2 px-4 border-b">{book.author}</td>
                            <td className="py-2 px-4 border-b">{book.year}</td>
                            <td className="py-2 px-4 border-b">{book.condition}</td>
                            <td className="py-2 px-4 border-b">{book.price}</td>
                            <td className="py-2 px-4 border-b">{book.contact}</td>
                            <td className="py-2 px-4 border-b">{book.userName}</td>
                            <td className="py-2 px-4 border-b">{book.listedDate ? new Date(book.listedDate).toLocaleDateString() : ''}</td>
                            <td className="py-2 px-4 border-b">{book.status}</td>
                            <td className="py-2 px-4 border-b">
                                {book.userId === currentUser?.uid && (
                                    <select
                                        value={book.status}
                                        onChange={e => handleUpdateStatus(book.id, e.target.value)}
                                        className="px-2 py-1 border rounded"
                                    >
                                        <option value="available">Available</option>
                                        <option value="sold">Sold</option>
                                    </select>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Marketplace
