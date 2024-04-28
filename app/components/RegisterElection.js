import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MdOutlineRemoveCircleOutline } from "react-icons/md";

function RegisterElection({ userData }) {
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidatesList, setCandidatesList] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const candidatesCollection = collection(db, 'candidates');
      try {
        const querySnapshot = await getDocs(candidatesCollection);
        const candidatesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Filter candidates based on the selected post
        const filteredCandidates = candidatesData.filter(
          (candidate) => candidate.candidatePost === selectedPost
        );
        setCandidatesList(filteredCandidates);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching candidates: ', error);
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [selectedPost]);

  const handleCandidateSelection = (candidate) => {
    if (!selectedCandidates.find((c) => c.id === candidate.id) && selectedCandidates.length < 3) {
      setSelectedCandidates([...selectedCandidates, candidate]);
      toast.success('Candidate selected!');
    }
  };

  const handleRemoveCandidate = (candidateToRemove) => {
    const updatedCandidates = selectedCandidates.filter(
      (candidate) => candidate.id !== candidateToRemove.id
    );
    setSelectedCandidates(updatedCandidates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPost || selectedCandidates.length === 0) {
      toast.error('Please select a post and at least one candidate.');
      return;
    }

    try {
      toast.success('Wait uploading election information...', {
        icon: '⏳',
      });
      const now = new Date();
      const startDateTime = now.toISOString();
      const endDateTime = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours after start

      const newElectionRef = await addDoc(collection(db, 'elections'), {
        post: selectedPost,
        candidates: selectedCandidates.map((candidate) => candidate.id),
        startTime: startDateTime,
        endTime: endDateTime,
      });
      toast.success('Election information added...');
    } catch (error) {
      toast.error('Error adding election: ', error);
    }
  };

  return (
    <form className='px-2 sm:px-7 pt-5 pb-28 h-auto sm:overflow-y-auto sm:h-[100vh] bg-white' onSubmit={handleSubmit}>
      {/* Styled note about election start and end times */}
      <div className="mb-7 text-xl text-[#0E5D8A] font-semibold">
        Note: Elections start 24 hours after registering and end 2 hours after starting.
      </div>
      {/* Form inputs for election details */}
      <div className="mt-4">
        <label htmlFor="selectedPost" className="block text-sm font-medium text-gray-700">Select Post:</label>
        <select
          id="selectedPost"
          name="selectedPost"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedPost}
          onChange={(e) => setSelectedPost(e.target.value)}
        >
          <option value="" className='text-black'>Select a Post</option>
          <option value="President" className='text-black'>President</option>
          <option value="Vice President" className='text-black'>Vice President</option>
          <option value="Secretary General" className='text-black'>Secretary General</option>
          <option value="Assistant Secretary General" className='text-black'>Assistant Secretary General</option>
          <option value="Treasurer" className='text-black'>Treasurer</option>
          <option value="Financial Secretary" className='text-black'>Financial Secretary</option>
          <option value="Sport Director" className='text-black'>Sport Director</option>
        </select>
      </div>

      <div className="mt-10">
        <label className="block text-sm font-medium leading-6 mb-2 text-gray-900" htmlFor="candidateSelection">
          Select Candidates
        </label>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Select</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidatesList.map((candidate, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{candidate.candidatePost}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button type="button" className='bg-green-600 text-white py-2 px-2.5 font-semibold rounded' onClick={() => handleCandidateSelection(candidate)}>
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Candidates Section */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-5">Selected Candidates</h2>
        <ul className="space-y-2">
          {selectedCandidates.map((candidate) => (
            <li key={candidate.id} className="flex items-center py-2 px-2.5 border-2 rounded-md w-fit">
              <span className="mr-2 font-semibold">{candidate.name}</span>
              <MdOutlineRemoveCircleOutline className="text-red-600 font-semibold cursor-pointer" onClick={() => handleRemoveCandidate(candidate)} />
            </li>
          ))}
        </ul>
      </div>

      {/* Loading Indicator */}
      {loading && <div>Loading...</div>}

      <div className="mt-7 pb-20">
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 font-semibold rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Election'}
        </button>
      </div>
    </form>
  );
}

export default RegisterElection;
