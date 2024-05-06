'use client'
import React, { useState, useEffect } from 'react';

import { auth, db, storage } from "../components/Firebase";
import Navbar from "../components/Navbar-3";
import Admin from "../components/Admini";
import Footer from '../components/Footer';
import { onAuthStateChanged } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { setDoc, doc, collection, getDoc, getDocs, query, where, onSnapshot  } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import CircularProgress from '@mui/material/CircularProgress';

import {motion} from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function page() {
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [profile, setProfile] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogout = () => {
    setUserData(null);
  }; 

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
        element.nextSibling.focus();
    }
  };

  function onCaptchVerify() {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // You can handle reCAPTCHA callback here if needed
          },
          "expired-callback": () => {
            // Handle reCAPTCHA expiration here if needed
          },
        },
        auth
      );
    }
  }
  
  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user.email === "admin@gmail.com" || user.email === "ibrahimsulaiman871@gmail.com") {
        setLogin(false);
        setProfile(true);
      } else {
        toast.error("Invalid administrator login details.");
      }
    } catch (error) {
      setLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      if (errorCode === "auth/invalid-credential") {
        toast.error("User not found. Please check your email or password.");
      } else if (errorCode === "auth/network-request-failed") {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const phoneNumber = "+2348101892049";

  function handleVerification() {
    onSignup();
  }

  function onSignup() {
    onCaptchVerify();
    toast.success("Sending OTP...", {
      icon: "⏳"
    });
    setLoading(true);

    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success("OTP sent successfully", {
          icon: "🚀"
        });
        setShowOTP(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error)
        toast.error("Error sending OTP");
      });
  }

  // Verify OTP Configuration
  function onOTPVerify() {
    toast.success("Verifying OTP...", {
      icon: "⏳"
    });
    window.confirmationResult.confirm(otp.join(""))
    .then((result) => {
      setProfile(true)
    }).catch((error) => {
      console.log(error);
      toast.error("Error verifying OTP");
    });
  }

  useEffect(() => {
    let userEmail = email;
  
    if (!userEmail) {
      
      return;
    }
  
    const userDocRef = doc(db, 'users', userEmail);
  
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data());
        localStorage.setItem('userData', JSON.stringify(docSnapshot.data()));
      } else {
        
      }
    }, (error) => {
      
    });
  
    return () => unsubscribe();
  
  }, [email]);  

  return (
    <div>
      <ToastContainer hideProgressBar={true} autoClose={4000}/>
      <div  className={`${login ? "select-none" : "hidden"}`}>
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: .5 }}
          className='bg-gray-100/80'
        >
        <div className="relative flex h-full flex-1 flex-col justify-center px-2 sm:px-4 pt-24 sm:pt-40 pb-20 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <h2 className="mb-3 text-3xl font-bold tracking-wide text-gray-900">
                  Administrator Log In
                </h2>
                <p className='text-gray-600 font-semibold text-sm sm:text-sm mt-1'>
                  Welcome back! Please enter the email address and password linked to your profile for a secure sign-in experience.
                </p>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-lg p-2 sm:p-4 border border-gray-300">
              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Email Address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder='example@gmail.com'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md py-1.5 px-2 text-gray-900 border-2 shadow-sm bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                    </label>
                    </div>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-md py-1.5 px-2 text-gray-900 border-2 shadow-sm bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                </div>

                <div>
                  {!loading && <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                  >
                    Sign in
                  </button>}
                  {loading && <button type="button" className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600" disabled>
                   <CircularProgress  className='text-white w-4 h-4' />
                  </button>}
                </div>
              </form>
            </div>
        </div>
        </motion.div>
        <Footer />
      </div>

      <section>
        {showOTP &&
          <div className='w-full min-h-screen '>
            <Navbar />
            <div className='py-52 flex justify-center items-center flex-col'>
              <label
                htmlFor="otp"
                className="font-bold text-2xl md:text-4xl text-center my-3 font-serif"
              >
                Enter Your OTP
              </label>
              <div className='mb-1'>
                {otp.map((data, index) => {
                  return (
                      <input
                        className="w-8 h-7 sm:w-10 sm:h-8 mx-1 sm:mx-3 border-2 text-center rounded"
                        type="text"
                        name="otp"
                        maxLength="1"
                        key={index}
                        value={data}
                        onChange={e => handleChange(e.target, index)}
                        onFocus={e => e.target.select()}
                      />
                    );
                })}
              </div>
              <button
                onClick={onOTPVerify}
                className="bg-blue-600 rounded-lg mt-2 py-2 px-3 text-white font-bold hover:bg-blue-700"
              >
                Verify OTP
              </button>
            </div>
            <Footer />
          </div>
        }
      </section>
      <div className={`${profile ? "" : "hidden"}`}>
        <Admin email={email} onLogout={handleLogout} />
      </div>
    </div>
  )
}

export default page
