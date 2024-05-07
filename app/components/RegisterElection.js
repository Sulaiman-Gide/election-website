import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MdOutlineRemoveCircleOutline } from "react-icons/md";

function RegisterElection({ userData }) {
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedPost, setSelectedPost] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidatesList, setCandidatesList] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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
        console.log(error)
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
    setLoadingBtn(true);
    e.preventDefault();

    if (!selectedPost || selectedCandidates.length === 0 || !startTime || !endTime) {
      toast.error('Please select a post, at least one candidate, start time, and end time.');
      return;
    }

    try {
      const newElectionRef = await addDoc(collection(db, 'elections'), {
        post: selectedPost,
        candidates: selectedCandidates.map((candidate) => candidate.id),
        startTime,
        endTime,
      });
      setLoadingBtn(false);
      toast.success('Election information added successfully.');
    } catch (error) {
      setLoadingBtn(false);
      toast.error('Error adding election: ', error);
    }
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  return (
    <form className='px-2 sm:px-7 pt-5 pb-28 h-auto sm:overflow-y-auto sm:h-[100vh] bg-white' onSubmit={handleSubmit}>
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

      <div className='flex justify-between items-center gap-2 sm:mt-2'>
        <div className='w-full sm:w-3/6 mt-4 sm:mt-7'>
          <label htmlFor="startTime" className="block mb-2 text-sm font-medium text-gray-900">Select start time:</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className='w-full sm:w-3/6 mt-4 sm:mt-7'>
          <label htmlFor="endTime" className="block mb-2 text-sm font-medium text-gray-900">Select end time:</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={endTime}
            onChange={handleEndTimeChange}
            required
          />
        </div>
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
          disabled={loadingBtn}
        >
          {loadingBtn ? 'Saving...' : 'Save Election'}
        </button>
      </div>
    </form>
  );
}

export default RegisterElection;
