"use client"
import { GoogleFonts } from 'next-google-fonts';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link';
import Navbar from "./components/Navbar";
import PresidencialCandidates from "./components/PresidencialCandidates";
import VicePresidencialCandidates from "./components/VicePresidencialCandidates";
import SecretaryGeneral from "./components/SecretaryGeneral";
import AssistantSecretaryGeneral from "./components/AssistantSecretaryGeneral";
import Treasurer from "./components/Treasurer";
import Footer from "./components/Footer";
import { motion } from 'framer-motion';
import { getDocs, collection, query } from 'firebase/firestore';
import { auth, db, storage } from "./components/Firebase";

export default function Home({ initialTimer }) {
  const [candidateList, setCandidateList] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(initialTimer);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const startCountdown = () => {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = Math.max(0, prevTimer - 1);
          localStorage.setItem('flashSaleTimer', String(newTimer));
          return newTimer;
        });
      }, 1000);

      setCountdownInterval(interval);
    };

    const resetTimerAndShuffle = async () => {
      resetTimer();
      await shuffleProducts();
    };

    if (typeof window !== 'undefined') {
      startCountdown();
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [countdownInterval, timer]);

  useEffect(() => {
    if (timer === 0) {
      resetTimerAndShuffle();
    }
  }, [timer]);

  const calculateTimeRemaining = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return Math.max(0, Math.floor((endOfDay - now) / 1000));
  };

  const formatTime = () => {
    const timeRemaining = calculateTimeRemaining();
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(
      seconds
    ).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimer(calculateTimeRemaining());
  };

  useEffect(() => {
    setLoading(true);
    const getItems = async () => {
        try {
            const q = query(collection(db, 'elections'));
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
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Kaushan+Script&family=Sacramento&display=swap" />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Mukta:wght@200;300;400;500;600;700;800&display=swap" />
      <div className='relative flex flex-col justify-between'>
      <Navbar />
        <div className="blueOverlay"></div>
        <div className="homeTopImage select-none">
          <Image 
            src="/COESA.png"
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
                <p className=' text-gray-100 text-lg sm:text-3xl font-bold text-center mukta-extrabold tracking-wide my-2 sm:my-7'>
                  {isClient ? <span>{formatTime()}</span> : <span></span>}
                </p>
                <p className='font-thin text-gray-100 text-base sm:text-xl text-center mukta-extrabold tracking-wide mb-3 sm:mb-7'>March 21 - 10am to 4pm</p>
                <div className='flex justify-start items-center gap-3'>
                  <Link href="/activeEletions" className='bg-white/90  hover:bg-[#0E5D8A] text-gray-800 hover:text-gray-50 font-bold text-base sm:text-lg xl:text-xl tracking-wider py-1.5 sm:py-2 px-9 xl:px-12 rounded-3xl'>
                    Vote Now
                  </Link>
                </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className='bg-gray-100 pt-5 sm:pt-8'>
        <h1 className='text-2xl sm:text-3xl xl:text-5xl tracking-wide font-bold text-blue-950 antialiased text-center mukta-extrabold mb-5 sm:mb-8'>Candidates</h1>
        <PresidencialCandidates />
        <VicePresidencialCandidates />
        <SecretaryGeneral />
        <AssistantSecretaryGeneral />
        <Treasurer />
      </div>
      <Footer />
    </main>
  )
}

