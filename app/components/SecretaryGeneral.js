import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { getDocs, collection, query } from 'firebase/firestore';
import { auth, db, storage } from "./Firebase";

function SecretaryGeneral() {
    const [candidateList, setCandidateList] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const getItems = async () => {
            try {
                const q = query(collection(db, 'candidates'));
                const querySnapshot = await getDocs(q);

                console.log("Query Snapshot:", querySnapshot);

                let list = [];
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });

                setData(list);
                setLoading(false);
                setCandidateList(true);
            } catch (err) {
                toast.error(err.message);
                setLoading(true);
            }
        };

        getItems();
    }, []);

    return (
        <main>
            <ToastContainer hideProgressBar={true} autoClose={2000} />
            <div className='bg-gray-100 py-5 px-2 sm:px-5 xl:px-14'>
                <div className='bg-gray-50 w-full rounded-xl py-5 px-2 sm:px-5 mt-4 sm:mt-8 shadow-md border'>
                    <h1 className='text-xl sm:text-2xl xl:text-3xl tracking-wide font-extrabold text-black antialiased text-center w-full'>Secretary General</h1>
                    <div className='flex justify-center items-stretch gap-3 flex-wrap flex-col sm:flex-row w-full mt-5'>
                        {loading &&
                            Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className='bg-white shadow-md border border-slate-100 flex flex-col items-start justify-center gap-2 w-full sm:w-[30%] py-4 rounded-lg'
                                >
                                    <div className='w-24 h-24 sm:h-32 sm:w-32 mx-auto bg-gray-300 animate-pulse rounded-full'></div>
                                    <div className='w-full flex justify-center items-center flex-col p-2'>
                                        <h1 className='h-3 sm:h-5 w-3/5 my-3 rounded bg-gray-300 animate-pulse'></h1>
                                        <h1 className='h-3 sm:h-5 w-3/6  my-3 rounded bg-gray-300 animate-pulse'></h1>
                                        <div className='h-3 sm:h-5 w-4/5 mt-3 mb-2 rounded bg-gray-300 animate-pulse'></div>
                                    </div>
                                    <div className='flex gap-2 justify-between items-center w-full px-2'>
                                        <div className='h-8 w-3/5 rounded-lg bg-gray-300 animate-pulse'></div>
                                        <div className='h-8 w-3/5 rounded-lg bg-gray-300 animate-pulse'></div>
                                    </div>
                                </div>
                            ))}
                        {candidateList && (
                            data
                                .filter(candidate => candidate.candidatePost === "Secretary General")
                                .map((candidate, index) => {
                                    let phoneNumber = candidate.candidatePhone.startsWith('0')
                                        ? '+234' + candidate.candidatePhone.slice(1)
                                        : candidate.candidatePhone;
                                    return (
                                        <div key={index} className='bg-white shadow-md border border-slate-100 flex flex-col items-start justify-center gap-2 w-full sm:w-[30.2%] py-4 rounded-lg'>
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
                                            <div className='px-3 flex-grow flex flex-col justify-start w-full'>
                                                <div className='mt-3'>
                                                    <h1 className='font-semibold text-gray-800 text-lg sm:text-xl truncate block text-center'>{candidate.name}</h1>
                                                    <div className='flex justify-center items-center flex-col px-1 mt-1'>
                                                        <h1 className='text-lg sm:text-xl font-semibold mt-1 truncate block text-[#0E5D8A]'>{candidate.nickName}</h1>
                                                        <h1 className='text-base sm:text-lg font-semibold text-gray-700 mt-1 truncate block'>{candidate.candidateLevel}</h1>
                                                    </div>
                                                    <div className='w-full flex justify-between items-center gap-2 mt-3 xl:px-4'>
                                                        <button className='w-3/6 py-2 bg-[#0E5D8A] text-white font-semibold rounded-lg tracking-wide text-sm sm:text-base'>
                                                            View Profile
                                                        </button>
                                                        <a href={`https://wa.me/${phoneNumber}?text=Hi, I'm interested in voting for you. Could you please provide more information about your manifesto?`} target="_blank" className='text-center py-2 mx-auto w-3/6 bg-gray-100 font-semibold border hover:bg-gray-300/90 text-slate-700 hover:text-slate-800 rounded-lg tracking-wide text-sm sm:text-base'>
                                                            Message
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SecretaryGeneral;
