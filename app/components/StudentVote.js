import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc as firestoreDoc, getDoc, updateDoc, addDoc } from 'firebase/firestore'; // Added 'getDoc'
import { db } from './Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VotingPage({ userData }) {
  const [loading, setLoading] = useState(true);
  const [electionData, setElectionData] = useState([]);
  const [votedCandidates, setVotedCandidates] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const electionsSnapshot = await getDocs(collection(db, 'elections'));
        const electionsList = electionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched elections:', electionsList);
        setElectionData(electionsList);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching elections:', error);
        console.error('Error fetching elections:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (!loading && Array.isArray(electionData) && electionData.length > 0) {
        const updatedElectionData = [];
        for (const election of electionData) {
          if (election && election.candidates && Array.isArray(election.candidates)) {
            const updatedCandidates = [];
            for (const candidateId of election.candidates) {
              const candidateDetails = await getCandidateDetails(candidateId);
              if (candidateDetails) {
                updatedCandidates.push({ ...candidateDetails, id: candidateId });
              }
            }
            updatedElectionData.push({ ...election, candidates: updatedCandidates });
          } else {
            console.error('Invalid election or candidates data:', election);
          }
        }
        setElectionData(updatedElectionData);
      }
    };

    fetchCandidateDetails();
  }, [loading, electionData]);

  const getCandidateDetails = async candidateId => {
    if (!candidateId) {
      console.error('Invalid candidateId:', candidateId);
      return null;
    }
  
    const candidateDocRef = firestoreDoc(db, 'candidates', candidateId);
    try {
      const candidateDocSnapshot = await getDoc(candidateDocRef);
      if (candidateDocSnapshot.exists()) {
        return candidateDocSnapshot.data();
      } else {
        console.error('Candidate document not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      return null;
    }
  };  

  const handleVote = async (electionId, candidateId) => {
    try {
      if (votedCandidates.includes(`${electionId}-${candidateId}`)) {
        toast.error('You have already voted for this candidate.');
        return;
      }
  
      // Add the vote to the electionResults collection
      const result = await addDoc(collection(db, 'electionResults'), {
        userId: userData.email,
        candidateId: candidateId,
        electionId: electionId,
      });
      toast.success('Vote added successfully');
  
      setVotedCandidates([...votedCandidates, `${electionId}-${candidateId}`]);
  
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Error voting. Please try again later.');
    }
  };
  

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {electionData.length > 0 && <h1 className="text-3xl font-bold mb-5 sm:mb-10 sm:mt-10 text-start">Vote for Candidates</h1>}
      {loading ? (
         <div className='w-full h-full flex justify-center items-center'>
          <p className="text-2xl font-bold mb-5 sm:mb-10 sm:mt-10 text-start text-gray-600">Loading...</p>
        </div>
      ) : (
        <div>
          {electionData.length === 0 ? (
            <div className='w-full h-full flex justify-center items-center'>
              <p className="text-2xl font-bold mb-5 sm:mb-10 sm:mt-10 text-start text-gray-600">No elections data available.</p>
            </div>
          ) : (
            <div className='sm:px-5 border py-3'>
              {electionData.map(election => (
                <div key={election.id} className="mb-6">
                  <h2 className="text-2xl font-bold">{election.post}</h2>
                  <table className="min-w-full divide-y divide-gray-200 mt-4">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {election.candidates && Array.isArray(election.candidates) ? (
                        election.candidates.map(candidate => (
                          <tr key={candidate.id}>
                            <td className="px-6 py-3 text-start">{candidate.name}</td>
                            <td className="px-6 py-3 text-start">{candidate.candidateDepartment}</td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <button 
                                onClick={() => handleVote(election.id, candidate.id)} 
                                className={`bg-blue-500 text-white py-2 px-4 rounded ${votedCandidates.includes(`${election.id}-${candidate.id}`) ? 'bg-opacity-50 cursor-not-allowed' : ''}`}
                                disabled={votedCandidates.includes(`${election.id}-${candidate.id}`)}
                              >
                                {votedCandidates.includes(`${election.id}-${candidate.id}`) ? 'Voted' : 'Vote'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">Invalid candidates data for this election.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <ToastContainer hideProgressBar={true} autoClose={4000}/>
    </div>
  );
}

export default VotingPage;