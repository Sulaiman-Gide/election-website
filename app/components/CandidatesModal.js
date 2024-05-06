import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Link from 'next/link';
import Image from 'next/image';

function CandidateModal({ candidate, open, handleClose }) {

    const handleCloseModal = () => {
        handleClose(); 
    };

    return (
        <Dialog 
            open={open}
            animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}>
            
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* Modal Panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                  &#8203;
                </span>
                <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-auto sm:my-8 align-middle sm:max-w-4xl w-full sm:mx-40">
                <div className=''>
                  <div className="bg-white px-2 pb-4 sm:pb-4">
                    <div className="w-full">
                      <div>
                        <div className='bg-gray-50 w-full px-2 py-4 sm:py-5'>
                            <h3 className="text-lg sm:text-xl font-bold">
                                Candidate's Profile
                            </h3>
                        </div>
                        <div className='flex flex-col items-start justify-center gap-2 w-full py-5 select-none'>
                            <div className='relative w-32 h-32 sm:h-40 sm:w-40 mx-auto rounded-full overflow-hidden'>
                                <Image
                                    fill={true}
                                    src={candidate.image1}
                                    alt={candidate.name}
                                    priority={true}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className='w-full card-img object-cover rounded-sm'
                                />
                            </div>
                            <div className='px-1 flex-grow flex flex-col justify-start w-full'>
                                <div className='mt-3'>
                                    <h1 className=' text-gray-800 font-bold text-xl sm:text-2xl text-center'>{candidate.name}</h1>
                                    <div className='flex justify-center items-start flex-col mt-3 sm:mt-5'>
                                        <h1 className='text-base sm:text-lg font-semibold text-gray-700 mt-1'>Candidate's Level: <span className='font-normal'>{candidate.candidateLevel}</span></h1>
                                        <h1 className='text-base sm:text-lg font-semibold text-gray-700 mt-1'>Candidate's Department: <span className='font-normal'>{candidate.candidateDepartment}</span></h1>
                                        <h1 className='text-base sm:text-lg font-semibold text-gray-700 mt-1'>Candidate's Faculty: <span className='font-normal'>{candidate.candidateFaculty}</span></h1>
                                        <p className='text-base sm:text-lg text-gray-700 mt-2 px-1 tracking-wide'>Hi, my name is {candidate.name} and I am contesting for the office of {candidate.candidatePost}. Here is a small review about me and my manifesto: <span className='font-normal'>{candidate.about}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
        </Dialog>
    );
}

export default CandidateModal;
