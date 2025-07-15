import React from 'react';

const CareerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-0 relative animate-fade-in border-2 border-indigo-400 flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Close button - sticky to top */}
        <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-indigo-200 flex justify-end p-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Career Opportunities"
            className="text-white bg-indigo-600 hover:bg-indigo-700 font-bold text-2xl w-10 h-10 flex items-center justify-center rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto p-8" style={{ maxHeight: 'calc(90vh - 56px)' }}>
          <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Career Opportunities</h1>
          <p className="mb-4 text-gray-700">
            PeerCodex is growing! We're looking for passionate individuals to help us expand mentor connections and promote our platform. If you enjoy building communities and supporting student success, we want to hear from you.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">Open Roles</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Mentor Connection Ambassadors: Help onboard new mentors and mentees.</li>
            <li>Campus Promoters: Spread the word about PeerCodex in your school or community.</li>
            <li>Paid Tutor Program: Tutors can promote themselves for a small monthly fee and reach more students.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">How to Apply</h2>
          <p className="mb-4 text-gray-700">
            Interested? Email us at <a href="mailto:info.peercodex@gmail.com" className="text-indigo-600 underline">info.peercodex@gmail.com</a> with your background and how you'd like to contribute.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">Coming Soon</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><span className="font-semibold text-indigo-600">Paid Tutoring:</span> Tutors will be able to offer paid sessions and promote themselves for a small monthly fee.</li>
            <li><span className="font-semibold text-indigo-600">Mentor Leaderboard:</span> Recognize top mentors and celebrate their impact.</li>
            <li><span className="font-semibold text-indigo-600">More Than AP Subjects:</span> We're expanding to include a wider range of subjects and learning opportunities.</li>
          </ul>
          <div className="text-center mt-8 text-gray-500 text-sm">
            &copy; 2025 PeerCodex. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerModal;
