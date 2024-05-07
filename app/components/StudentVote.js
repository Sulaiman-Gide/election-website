import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VotingPage({ userData }) {
  const [loading, setLoading] = useState(true);
  const [electionData, setElectionData] = useState([]);

  console.log(userData)

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

  useEffect(() => {
    const fetchCandidateDetails = async () => {
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
    };

    if (!loading && Array.isArray(electionData)) {
      fetchCandidateDetails();
    }
  }, [electionData, loading]);

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
                                <button className="bg-blue-500 text-white py-2 px-4 rounded">Vote</button>
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
