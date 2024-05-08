import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from './Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BarChart from "./BarChart"
import { FaPoll } from 'react-icons/fa';

function Dashboard({ userData }) {
  const [loading, setLoading] = useState(true);
  const [electionData, setElectionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionsSnapshot = await getDocs(collection(db, 'elections'));
        const electionsList = electionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setElectionData(electionsList);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching elections:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric' 
    });
  };


  return (
    <div className="container mx-auto p-4 h-auto sm:overflow-y-auto sm:h-[100vh] pb-40">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {electionData.map(election => (
                <div key={election.id} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">{election.post}</h2>
                  <div className="flex justify-start items-end mb-3">
                    <FaPoll className="text-blue-500 mr-3 " size={27} />
                    <h2 className="text-l font-bold">Poll counting</h2>
                  </div>
                  <p className="text-gray-600 mb-3">Start Time: {formatDateTime(election.startTime)}</p>
                  <p className="text-gray-500">Voting Deadline: {formatDateTime(election.endTime)}</p>
                    <button 
                      className="bg-blue-500 text-white py-2 px-4 rounded mt-4 cursor-not-allowed"
                      onClick={() => {/* Handle navigation to specific election page */}}
                      disabled={true} 
                    >
                      Print Result
                    </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <BarChart />
      <ToastContainer hideProgressBar={true} autoClose={4000}/>
    </div>
  );
}

export default Dashboard;
