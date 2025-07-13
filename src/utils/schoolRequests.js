import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

export const submitSchoolRequest = async (schoolName, userUid) => {
  try {
    await addDoc(collection(db, 'requests'), {
      type: 'school_add',
      desc: schoolName,
      userRequest: userUid,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    toast.success('School request submitted! We\'ll review it soon.');
    return true;
  } catch (error) {
    console.error('Error submitting school request:', error);
    toast.error('Failed to submit school request. Please try again.');
    return false;
  }
};
