import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VotingPage() {
  const [loading, setLoading] = useState(true);
  const [electionData, setElectionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const electionsSnapshot = await getDocs(collection(db, 'elections'));
        const electionsList = electionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
      if (!loading && electionData.length > 0) {
        const updatedElectionData = [];
        for (const election of electionData) {
          const updatedCandidates = [];
          for (const candidateId of election.candidates) {
            const candidateDetails = await getCandidateDetails(candidateId);
            if (candidateDetails) {
              updatedCandidates.push({ ...candidateDetails, id: candidateId });
            }
          }
          updatedElectionData.push({ ...election, candidates: updatedCandidates });
        }
        setElectionData(updatedElectionData);
      }
    };

    fetchCandidateDetails();
  }, [electionData, loading]); // Only run this effect when electionData or loading changes

  const getCandidateDetails = async (candidateId) => {
    try {
      const candidateDocRef = doc(db, 'candidates', candidateId);
      const candidateDocSnapshot = await getDoc(candidateDocRef);
      if (candidateDocSnapshot.exists()) {
        return candidateDocSnapshot.data();
      } else {
        console.error('Candidate document not found for id:', candidateId);
        return null;
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      return null;
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-5 mt-5 sm:mt-10">Vote for Candidates</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {electionData.length === 0 ? (
            <p>No elections data available.</p>
          ) : (
            <div>
              {electionData.map(election => (
                <div key={election.id} className="mb-6">
                  <h2 className="text-2xl font-bold">{election.post}</h2>
                  <table className="min-w-full divide-y divide-gray-200 mt-4">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {election.candidates.map(candidate => (
                        <tr key={candidate.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{candidate.party}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="bg-blue-500 text-white py-2 px-4 rounded">Vote</button>
                          </td>
                        </tr>
                      ))}
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
