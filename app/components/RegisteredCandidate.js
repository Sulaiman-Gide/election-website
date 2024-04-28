import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { db } from './Firebase';
import {
  onSnapshot,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function RegisteredCandidate({ userData }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
      const q = query(collection(db, 'candidates'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        console.log(list)
        setLoading(false);
      });

      return () => unsubscribe();
  }, [userData]);

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'candidates', postId));
      toast.success('Candidate deleted successfully!');
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error('Error deleting candidate');
      console.error(error);
    }
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  return (
    <section>
      <div className='px-2 sm:px-4 pt-5 pb-28 overflow-y-auto h-[100vh]'>
          <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-stretch gap-3 flex-wrap flex-col sm:flex-row w-full pb-20"
          >
          {loading ? (
              Array.from({ length: 9 }).map((_, index) => (
              <div
                  key={index}
                  className='bg-white shadow-md my-2 border border-slate-50 flex flex-row items-center justify-center gap-2 w-full p-2'
              >
                <div className='w-3/6 h-56 bg-gray-300 animate-pulse rounded'></div>
                <div className='w-full sm:w-4/6 p-2 sm:p-3'>
                  <h1 className='h-3 sm:h-4 w-3/6 my-3 rounded bg-gray-300 animate-pulse'></h1>
                  <h1 className='h-3 sm:h-4 w-3/6 my-3 rounded bg-gray-300 animate-pulse'></h1>
                  <div className='h-3 sm:h-4 w-2/6 my-3 rounded bg-gray-300 animate-pulse'></div>
                  <div className='h-3 sm:h-4 w-3/6 my-3 rounded bg-gray-300 animate-pulse'></div>
                  <div className='flex justify-between items-center h-10 w-full gap-3 mt-5 sm:mt-8'>
                    <div className='h-full rounded-xl w-3/6 my-3 bg-gray-300 animate-pulse'></div>
                    <div className='h-full rounded-xl w-3/6 my-3 bg-gray-300 animate-pulse'></div>
                  </div>
                </div>
              </div>
              ))
          ) : (
              data.map((Candidate, index) => (
              <div key={index} className='bg-white shadow-md my-2 border border-slate-50 flex flex-col sm:flex-row items-center justify-center gap-2 w-full p-2'>
                <div className='relative w-full sm:w-3/6 h-72 sm:h-full rounded overflow-hidden'>
                  <Image
                    fill={true}
                    src={Candidate.image1}
                    alt={Candidate.name}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className='w-full card-img object-cover rounded'
                  />
                </div>
                <div className='px-1 sm:px-3 flex-grow flex flex-col justify-start w-full sm:w-4/6 '>
                  <h1 className='font-semibold text-gray-800 text-base sm:text-lg truncate block mt-2 mb-1.5'>Name: {Candidate.name}</h1>
                  <h1 className='font-semibold text-gray-800 text-base sm:text-lg truncate block '>Email: {Candidate.candidateEmail}</h1>
                  <div className='flex justify-between items-center mt-1.5'>
                    <div>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1 font-semibold truncate block'>Registration Number</h1>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1  truncate block'>{Candidate.candidateRegistrationNumber}</h1>
                    </div>
                    <div>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1 font-semibold truncate block'>Phone Number</h1>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1  truncate block'>{Candidate.candidatePhone}</h1>
                    </div>
                  </div>
                  <div className='flex justify-between items-center mt-1.5'>
                    <div>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1 font-semibold truncate block'>Faculty</h1>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1  truncate block'>{Candidate.candidateFaculty}</h1>
                    </div>
                    <div>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1 font-semibold truncate block'>Department</h1>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1  truncate block'>{Candidate.candidateDepartment}</h1>
                    </div>
                  </div>
                  <div className='flex justify-between items-center mt-1.5'>
                    <div>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1 font-semibold truncate block'>Office Contesting</h1>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1  truncate block'>{Candidate.candidatePost}</h1>
                    </div>
                    <div>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1 font-semibold truncate block'>Candidate CGPA</h1>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1  truncate block text-center'>{Candidate.candidateCGPPA}</h1>
                    </div>
                  </div>
                  <div className='flex justify-between items-center mt-1.5'>
                    <div>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1 font-semibold truncate block'>Candidate Level</h1>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1  truncate block'>{Candidate.candidateLevel}</h1>
                    </div>
                    <div>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1 font-semibold truncate block'>Expected Graduation Year</h1>
                      <h1 className='text-sm sm:text-base text-gray-700 mt-1  truncate block text-center'>{Candidate.candidateGraduationYear}</h1>
                    </div>
                  </div>
                  <div className='w-full mb-2 mt-2 hidden'>
                    <h1 className='text-sm sm:text-base text-gray-700 mt-1 font-semibold truncate block'>About Candidate</h1>
                    <p className='text-xs sm:text-sm text-gray-700 mt-2'>{Candidate.about}</p>
                  </div>
                  <button
                    onClick={openDeleteModal}
                    className='mt-3 py-2.5 mx-auto w-full rounded bg-red-600/80 hover:bg-red-800 text-slate-50 font-semibold tracking-wide shadow-sm'
                  >
                    Delete Candidate
                  </button>
                </div>
                {/* Delete confirmation modal */}
                {isDeleteModalOpen && (
                  <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                      {/* Background overlay */}
                      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-55"></div>
                      </div>

                      {/* Modal Panel */}
                      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                      </span>
                      <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-auto sm:my-8 align-middle sm:max-w-lg w-full sm:mx-0">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                              {/* Heroicon name: outline/exclamation */}
                              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.937 4h13.978c-.489 0-.881-.448-1.002-.975L12 3.929 7.94 16.025c-.12.527-.514.975-1.002.975z"></path>
                              </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Delete Confirmation
                              </h3>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Are you sure you want to delete the candidate?
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button
                            onClick={() => {
                              handleDeletePost(Candidate.id);
                              closeDeleteModal();
                            }}
                            className="mx-2 px-4 py-2 text-base tracking-wider bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Yes, Delete
                          </button>
                          <button
                            type="button"
                            onClick={closeDeleteModal}
                            className="mt-3 w-full tracking-wider inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          </motion.div>
      </div>
    </section>
  )
}

export default RegisteredCandidate
