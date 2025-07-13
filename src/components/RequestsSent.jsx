import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

const RequestsSent = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactProfile, setContactProfile] = useState(null);
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [requesteeProfiles, setRequesteeProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'requests'),
          where('requestedui', '==', currentUser?.uid || '')
        );
        const snapshot = await getDocs(q);
        const reqs = [];
        snapshot.forEach(docSnap => {
          reqs.push({ id: docSnap.id, ...docSnap.data() });
        });
        setRequests(reqs);
        // Fetch requestee profiles
        const uids = reqs.map(r => r.requesteeui).filter(Boolean);
        if (uids.length > 0) {
          const usersQuery = query(collection(db, 'users'), where('uid', 'in', uids));
          const usersSnap = await getDocs(usersQuery);
          const profiles = {};
          usersSnap.forEach(userDoc => {
            const data = userDoc.data();
            profiles[data.uid] = data;
          });
          setRequesteeProfiles(profiles);
        } else {
          setRequesteeProfiles({});
        }
      } catch {
        setRequests([]);
        setRequesteeProfiles({});
      }
      setLoading(false);
    };
    if (currentUser?.uid) fetchRequests();
  }, [currentUser]);

  const handleAction = async (req, status) => {
    try {
      await updateDoc(doc(db, 'requests', req.id), {
        status
      });
      setToastMsg(`Request ${status === 'cancelled' ? 'cancelled' : 'updated'} successfully!`);
      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status } : r));
    } catch {
      setToastMsg('Failed to update request.');
    }
  };

  return (

    <div className="bg-white rounded-xl shadow-lg p-8">
       {/* Header Section */}
        <div className="mb-2">
            <h2 className="text-2xl font-bold text-indigo-700">Requests Sent</h2>
            <p className="text-gray-500 mt-2 text-base">Mentor Requests You've Sent</p>
        </div>

      <div className="mb-8">
       
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No mentor requests sent.</div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => {
              const profile = requesteeProfiles[req.requesteeui];
              const requesteeName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'Unknown User';
              return (
                <div key={req.id} className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-indigo-700 text-lg">{requesteeName}</div>
                      <div className="text-xs text-gray-500">Status: <span className={`font-semibold ${req.status === 'pending' ? 'text-yellow-600' : req.status === 'accepted' ? 'text-green-600' : req.status === 'rejected' ? 'text-red-600' : 'text-gray-600'}`}>{req.status}</span></div>
                    </div>
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium" onClick={() => handleAction(req, 'cancelled')}>Cancel</button>
                      </div>
                    )}
                    {req.status === 'accepted' && profile && (
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium" onClick={() => { setContactProfile(profile); setShowContactModal(true); }}>View Contact Info</button>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 mt-2">{req.message}</div>
                  {req.status === 'accepted' && (
                    <div className="mt-2 text-xs text-green-600">Your request was accepted. Contact info may be shared.</div>
                  )}
                  {req.status === 'rejected' && (
                    <div className="mt-2 text-xs text-red-600">Your request was rejected.</div>
                  )}
                  {req.status === 'cancelled' && (
                    <div className="mt-2 text-xs text-gray-500">You cancelled this request.</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Toast Message */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center text-sm font-medium">
          {toastMsg}
          <button className="ml-4 text-white/80" onClick={() => setToastMsg('')}>Dismiss</button>
        </div>
      )}
      {/* Contact Info Modal */}
      {showContactModal && contactProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setShowContactModal(false)}>
              &times;
            </button>
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Mentor Contact Info</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Name:</span> {contactProfile.firstName} {contactProfile.lastName}
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span> {contactProfile.email || 'Not provided'}
              </div>
              <div>
                <span className="font-medium text-gray-700">School:</span> {contactProfile.school || 'Not provided'}
              </div>
              <div>
                <span className="font-medium text-gray-700">Grade:</span> {contactProfile.grade || 'Not provided'}
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span> {contactProfile.phoneNumber || contactProfile.phone || 'Not provided'}
              </div>
              <div>
                <span className="font-medium text-gray-700">Discord:</span> {contactProfile.discord || 'Not provided'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default RequestsSent;
