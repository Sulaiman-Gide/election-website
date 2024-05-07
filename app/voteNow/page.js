'use client'
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
import {motion} from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdClose } from "react-icons/io";
import { auth, db, storage } from "../components/Firebase";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import { setDoc, doc, collection, getDoc, getDocs, query, where, onSnapshot  } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";


function page() {
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [account, setAccount] = useState(true);
    const [userData, setUserData] = useState(null);

    const [name, setName] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    console.log(electionsData)


    const handleLogin = async (e) => {
        e.preventDefault();
        toast.success('Loading...', {
          icon: '⏳',
        });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = (userCredential.user);
          setLogin(false);
          setRegister(false);
          setAccount(true);
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
      
          if (errorCode === "auth/invalid-credential") {
            toast.error("User not found. Please check your email or password.");
          } else if (errorCode === "auth/network-request-failed") {
            toast.error("Network error. Please check your internet connection.");
          } else {
            toast.error(errorCode);
          }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        toast.success('Loading...', {
        icon: '⏳',
        });
    
        if (password !== confirmPassword) {
        toast.error('Passwords do not match', {});
        return;
        }
    
        try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        const userDetails = {
            name,
            email,
            regNumber,
            number,
            password,
        };
    
        await setDoc(doc(db, 'students', email), userDetails);
        setLogin(false);
        setRegister(false)
        setAccount(true);
    
        } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
    
        switch (errorCode) {
            case 'auth/email-already-in-use':
            toast.error('Email address is already in use. Please use a different email.');
            break;
            case 'auth/invalid-email':
            toast.error('Invalid email address. Please check the email format.');
            break;
            case 'auth/weak-password':
            toast.error('Weak password. Please use a stronger password.');
            break;
            default:
            toast.error(errorMessage);
            break;
        }
        }
    };

    const handleRegisterLinkClick = () => {
        setLogin(false);
        setRegister(true);
    };

    const handleLoginLinkClick = () => {
        setLogin(true);
        setRegister(false);
    };

    const handleCloseModal = () => {
        handleClose(); 
    };

    return (
        <div >
            <Navbar />
            <ToastContainer hideProgressBar={true} autoClose={4000}/>
            <div className='flex items-end justify-center pt-20 px-2 pb-10 text-center sm:block sm:py-20'>
                <div className={`${login ? "border inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-auto sm:my-8 align-middle sm:max-w-4xl w-full sm:mx-40 select-none" : "hidden"}`}>
                    <div className="flex h-full flex-1 flex-col justify-center px-2 sm:px-4 p-5 sm:p-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-lg p-2">
                            <div className='flex justify-between items-center pt-2'>
                                <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-wide text-gray-700">
                                    User Sign In
                                </h2>
                            </div>
                            <p className='text-gray-600 font-semibold text-sm sm:text-sm mt-2'>
                                Please input your login credentials before proceeding to the voting process.
                            </p>
                        </div>

                        <div className="sm:mt-5 sm:mx-auto sm:w-full sm:max-w-lg p-2 sm:p-4 sm:border border-gray-300">
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
                                    <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                                    >
                                    Sign in
                                    </button>
                                </div>
                            </form>
                            <p className="mt-3 sm:mt-5 text-center text-sm text-gray-500 mb-2">
                                Don't have an account?{' '}
                                <button onClick={handleRegisterLinkClick} className="font-semibold leading-6 text-teal-600 hover:text-teal-500">
                                    Register now to get started
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`${register ? "select-none" : "hidden"}`}>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: .5 }}
                        className='border inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-auto align-middle sm:max-w-4xl w-full sm:mx-40 select-none'
                    >
                    <div className="flex h-full flex-1 flex-col justify-center px-2 sm:px-3 pt-10 md:pt-10 pb-10 lg:px-5">
                        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                            <div className='flex justify-between items-center pt-2'>
                                <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-wide text-gray-700">
                                    Create Your Account
                                </h2>
                            </div>
                            <p className='text-gray-600 font-semibold text-sm sm:text-sm mt-2'>
                                Welcome! Please provide the following details to create your account.
                            </p>
                        </div>

                        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg p-2 sm:p-3 border border-gray-300">
                            <form className="space-y-6" onSubmit={handleRegister}>
                            <div className='w-full mt-2'>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Full Name
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder='Ahmad Sulaiman'
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full rounded-md py-1.5 px-2 text-gray-900 border-2 shadow-sm bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            
                            <div className='w-full  mt-3'>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Mobile Number
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="number"
                                    name="number"
                                    placeholder='07083920465'
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    className="block w-full rounded-md py-1.5 px-2 text-gray-900 border-2 shadow-sm bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className='w-full  mt-3'>
                                <label htmlFor="regNumber" className="block text-sm font-medium leading-6 text-gray-900">
                                    Matric Number
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="regNumber"
                                    name="regNumber"
                                    placeholder=''
                                    type="text"
                                    autoComplete="regNumber"
                                    required
                                    value={regNumber}
                                    onChange={(e) => setRegNumber(e.target.value)}
                                    className="block w-full rounded-md py-1.5 px-2 text-gray-900 border-2 shadow-sm bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            
                            <div className='w-full mt-3'>
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
                            <div className='flex justify-center items-center flex-col sm:flex-row sm:gap'>
                                <div className='w-full md:w-3/6 mb-6 sm:mb-0'>
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
                                    autoComplete="new-password"

                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md py-1.5 px-2 text-gray-900 border-2 shadow-sm bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div className='w-full md:w-3/6'>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-md py-1.5 px-2 text-gray-900 border-2 shadow-sm bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>
                            </div>
                            <div>
                                <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                                >
                                Register
                                </button>
                            </div>
                            </form>

                            <p className="mt-5 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <button onClick={handleLoginLinkClick} className="font-semibold leading-6 text-teal-600 hover:text-teal-500">
                                Sign in here
                            </button>
                            </p>
                        </div>
                        </div>
                    </motion.div>
                </div>

                <div className={`${account ? "h-screen border inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-auto sm:my-8 align-middle sm:max-w-4xl w-full sm:mx-40 select-none" : "hidden"}`}>
                    <div className="flex h-full flex-1 flex-col justify-start px-2 sm:px-4 p-5 sm:p-10 lg:px-8">
                        <div className="">
                            <h2 className="text-lg font-semibold mb-5 sm:mb-10">Candidate Voting</h2>
                            <table className="w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border">Candidate Post</th>
                                        <th className="py-2 px-4 border">Name</th>
                                        <th className="py-2 px-4 border">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {electionsData.map(candidate => (
                                        <tr key={candidate.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border">Caandidate Post</td>
                                            <td className="py-2 px-4 border">Candidate Name</td>
                                            <td className="py-2 px-4 border">
                                                <button
                                                    className="bg-teal-600 text-white py-1 px-3 rounded-md hover:bg-teal-500"
                                                    onClick={() => handleVote(candidate)}
                                                >
                                                    Vote
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default page
