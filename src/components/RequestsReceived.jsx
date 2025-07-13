import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

const RequestsReceived = () => {
    const { currentUser, userProfile } = useAuth();
    const [requests, setRequests] = useState([]);
    const [requesterProfiles, setRequesterProfiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [pointsReceived, setPointsReceived] = useState({});

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'requests'),
                    where('requesteeui', '==', currentUser?.uid || '')
                );
                const snapshot = await getDocs(q);
                const reqs = [];
                snapshot.forEach(docSnap => {
                    reqs.push({ id: docSnap.id, ...docSnap.data() });
                });
                setRequests(reqs);
                // Fetch requester profiles
                const uids = reqs.map(r => r.requestedui).filter(Boolean);
                if (uids.length > 0) {
                    const usersQuery = query(collection(db, 'users'), where('uid', 'in', uids));
                    const usersSnap = await getDocs(usersQuery);
                    const profiles = {};
                    usersSnap.forEach(userDoc => {
                        const data = userDoc.data();
                        profiles[data.uid] = data;
                    });
                    setRequesterProfiles(profiles);
                } else {
                    setRequesterProfiles({});
                }
                // Fetch points received for each mentee
                const pointsMap = {};
                for (const req of reqs) {
                    if (req.status === 'accepted' && req.requestedui) {
                        try {
                            const pointsDoc = await getDocs(query(collection(db, `users/${currentUser.uid}/points`)));
                            let points = 0;
                            pointsDoc.forEach(docSnap => {
                                if (docSnap.id === req.requestedui) {
                                    points = docSnap.data().points || 0;
                                }
                            });
                            pointsMap[req.requestedui] = points;
                        } catch (error) {
                            console.error('Error fetching points for user:', req.requestedui, error);
                            pointsMap[req.requestedui] = 0; // Default to 0 if error occurs
                        }
                    }
                }
                setPointsReceived(pointsMap);
            } catch {
                setRequests([]);
                setRequesterProfiles({});
                setPointsReceived({});
            }
            setLoading(false);
        };
        if (currentUser?.uid) fetchRequests();
    }, [currentUser]);

    const handleAction = async (req, status) => {
        setActionLoading(true);
        try {
            await updateDoc(doc(db, 'requests', req.id), {
                status,
                phoneNumber: userProfile?.phoneNumber || '',
                discord: userProfile?.discord || ''
            });
            setToastMsg(`Request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
            setShowDisclaimer(false);
            setSelectedRequest(null);
            setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status, phoneNumber: userProfile?.phoneNumber || '', discord: userProfile?.discord || '' } : r));
        } catch {
            setToastMsg('Failed to update request.');
        }
        setActionLoading(false);
    };

    return (

        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-2">
                {/* Header Section */}
                <div className="mb-2">
                    <h2 className="text-2xl font-bold text-indigo-700">Requests Received</h2>
                    <p className="text-gray-500 mt-2 text-base">Mentor Requests You've Received</p>
                </div>
            </div>
            <div>

                {loading ? (
                    <div className="text-center text-gray-500 py-8">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No mentor requests found.</div>
                ) : (
                    <div className="space-y-6">
                        {requests.map((req) => {
                            const profile = requesterProfiles[req.requestedui];
                            const requesterName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'Unknown User';
                            return (
                                <div key={req.id} className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-indigo-700 text-lg">{requesterName}</div>
                                            <div className="text-xs text-gray-500">Status: <span className={`font-semibold ${req.status === 'pending' ? 'text-yellow-600' : req.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{req.status}</span></div>
                                        </div>
                                        {req.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium" onClick={() => { setSelectedRequest(req); setShowDisclaimer(true); }}>Accept</button>
                                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium" onClick={() => handleAction(req, 'rejected')}>Reject</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-700 mt-2">{req.message}</div>
                                    {req.status === 'accepted' && (
                                        <>
                                            <div className="mt-2 text-xs text-gray-500">Your phone number and Discord have been shared.</div>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-bold text-sm shadow-md">
                                                    {/* Trophy icon from Heroicons */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-8 0a4 4 0 008 0m-8 0V5a2 2 0 012-2h4a2 2 0 012 2v16m-8 0h8" /></svg>
                                                    {pointsReceived[req.requestedui] ?? 0} Points Awarded
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* Disclaimer Modal */}
            {showDisclaimer && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative">
                        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowDisclaimer(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <h3 className="text-xl font-bold text-indigo-700 mb-2">Accept Request</h3>
                        <p className="text-sm text-gray-600 mb-4">By accepting, your phone number and Discord will be shared with the requester. Are you sure you want to proceed?</p>
                        <div className="flex justify-end gap-2">
                            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium" disabled={actionLoading} onClick={() => handleAction(selectedRequest, 'accepted')}>{actionLoading ? 'Accepting...' : 'Accept'}</button>
                            <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium" onClick={() => setShowDisclaimer(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Toast Message */}
            {toastMsg && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center text-sm font-medium">
                    {toastMsg}
                    <button className="ml-4 text-white/80" onClick={() => setToastMsg('')}>Dismiss</button>
                </div>
            )}
        </div>

    );
};

export default RequestsReceived;
