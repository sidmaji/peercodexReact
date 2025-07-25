import { addDoc, collection } from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import { db } from '../firebase'

export const submitSchoolRequest = async (schoolName, userUid) => {
    try {
        await addDoc(collection(db, 'schoolrequests'), {
            type: 'school_add',
            desc: schoolName,
            requesteeui: userUid,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        toast.success("School request submitted! We'll review it soon.")
        return true
    } catch (error) {
        console.error('Error submitting school request:', error)
        toast.error('Failed to submit school request. Please try again.')
        return false
    }
}
