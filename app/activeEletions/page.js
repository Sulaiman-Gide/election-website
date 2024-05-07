'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { db } from "../components/Firebase";
import Navbar from "../components/Navbar-2";
import CountTimer from "../components/CountTimer";
import Footer from "../components/Footer";
import PresidencialCandidates from "../components/PresidencialCandidates";
import VicePresidencialCandidates from "../components/VicePresidencialCandidates";
import SecretaryGeneral from "../components/SecretaryGeneral";
import AssistantSecretaryGeneral from "../components/AssistantSecretaryGeneral";
import Treasurer from "../components/Treasurer";
import SportDirector from "../components/SportDriector";


function page() {
  const [electionsData, setElectionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const electionsSnapshot = await getDocs(collection(db, 'elections'));
        const electionsList = electionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setElectionsData(electionsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching elections:', error);
        setLoading(true);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className='relative flex flex-col justify-between'>
      <Navbar />
        <div className="blueOverlay"></div>
        <div className="homeTopImage select-none">
          <Image 
            src="/photo-election.jpg"
            alt="Image"
            layout="fill"
            priority={true}
          />
        </div>
        <div className="homeTopText px-5 sm:px-12 xl:px-20 select-none" >
          <div className='w-full py-3 xl:py-12 flex gap-2 justify-between items-center overflow-hidden'>
            <motion.div 
              initial={{
                y: 200,
                opacity: 0,
              }}
              transition={{
                  duration: .5,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}className='w-full h-full flex flex-col justify-center items-center '>
                <h1 className='text-4xl sm:text-6xl xl:text-8xl tracking-wide font-extrabold text-white/90 antialiased text-center mukta-extrabold mt-3'>COESA Decides</h1>
                <CountTimer />
                <p className='font-thin text-gray-100 text-base sm:text-xl text-center mukta-extrabold tracking-wide mb-3 sm:mb-7'>May 10 - 10am to 4pm</p>
            </motion.div>
          </div>
        </div>
      </div>
      <div className='bg-gray-100 pt-5 sm:pt-7'>
      <h1 className='text-2xl sm:text-3xl xl:text-5xl tracking-wide font-bold text-blue-950 antialiased text-center mukta-extrabold'>Candidates</h1>
      <div className='flex justify-center items-stretch gap-3 flex-wrap flex-col sm:flex-row w-full py-7'>
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
      </div>
        {electionsData.map(election => (
          <div key={election.id}>
            {election.post === "President" && <PresidencialCandidates />}
            {election.post === "Vice President" && <VicePresidencialCandidates />}
            {election.post === "Secretary General" && <SecretaryGeneral />}
            {election.post === "Assistant Secretary General" && <AssistantSecretaryGeneral />}
            {election.post === "Treasurer" && <Treasurer />}
            {election.post === "Sport Director" && <SportDirector />}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export default page
