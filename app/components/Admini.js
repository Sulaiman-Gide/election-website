import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {motion} from 'framer-motion';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { RxDashboard } from 'react-icons/rx';
import { HiMenuAlt3 } from "react-icons/hi";
import { RiHome3Line } from "react-icons/ri";
import { MdOutlineLogout } from 'react-icons/md';
import { MdPoll } from 'react-icons/md';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BiPurchaseTag } from "react-icons/bi";
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { VscNewFolder } from "react-icons/vsc";
import { MdOutlineVerified } from "react-icons/md";

import Dashboard from "./Dashboard";
import Form from "./Form";
import RegisteredCandidate from './RegisteredCandidate';
import RegisterElection from './RegisterElection';

const Admin = ({ userData, email }) => {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [dashboard, setDashboard] = useState(true);
  const [registerCandidate, setRegisterCandidate] = useState(false);
  const [registeredCandidate, setRegisteredCandidate] = useState(false);
  const [registerElection, setRegisterElection] = useState(false);

  const showLogoutModal = () => {
    setLogoutModalOpen(true);
  };

  const hideLogoutModal = () => {
    setLogoutModalOpen(false);
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  function handleDashboard() {
    setDashboard(true);
    setRegisterCandidate(false);
    setRegisteredCandidate(false);
    setRegisterElection(false);
  }

  function handleRegisterCandidate() {
    setRegisterCandidate(true);
    setDashboard(false);
    setRegisteredCandidate(false);
    setRegisterElection(false);
  }

  function handleRegisteredCandidate() {
    setDashboard(false);
    setRegisterCandidate(false);
    setRegisteredCandidate(true);
    setRegisterElection(false);
  }

  function handleRegisteredElection() {
    setDashboard(false);
    setRegisterCandidate(false);
    setRegisteredCandidate(false);
    setRegisterElection(true);
  }


  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      className=""
    >
      <AiOutlineCloseCircle
        onClick={toggleDrawer(anchor, false)}
        className='text-2xl font-bold my-3 mr-3'
        style={{ float: 'right' }}
      />
      <div className='flex flex-col w-full h-[100svh] overflow-y-auto pb-2 px-3 border-r-[1px]'>
        <h1 className='font-extrabold text-gray-800 tracking-wider text-3xl text-center mb-3 sacramento-regular antialiased'>CEOSA Decides</h1>
        <div onClick={handleDashboard} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <RxDashboard size={20} className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Dashboard</h1>
        </div>
        <div onClick={handleRegisterCandidate} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <VscNewFolder size={20} className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Register Candidate</h1>
        </div>
        <div onClick={handleRegisteredCandidate} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <MdOutlineVerified size={20}  className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Candidate</h1>
        </div>
        <div onClick={handleRegisteredElection} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <MdOutlineCreateNewFolder size={20}  className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Elections</h1>
        </div>
        <span className='border-b-[1px] border-gray-200 w-full p-2 my-2'></span>
        <Link href="/" className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <RiHome3Line  size={20}  className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Home</h1>
        </Link>
        <Link href="/activeEletions" className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <MdPoll size={20}  className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Active Polls</h1>
        </Link>

        <div onClick={showLogoutModal} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border bg-red-600 hover:bg-red-800'>
          <MdOutlineLogout size={20}  className='text-gray-50'/>
          <h1 className='text-white text-lg ml-3 font-semibold'>Logout</h1>
        </div>
      </div>
    </Box>
  );
  
  return (
    <div className='w-full flex sm:overflow-y-hidden bg-gray-50 select-none'>
      <div className='hidden sm:flex flex-col w-[230px] sm:w-1/5 h-[98vh] ml-2 my-auto rounded-md bg-white overflow-y-scroll lg:overflow-y-hidden py-2 px-3 border-[1px]'>       
        <h1 className='font-extrabold text-gray-800 tracking-wider text-2xl md:text-3xl text-center mt-3 mb-2 sacramento-regular antialiased'>CEOSA Decides</h1>
        <span className='border border-gray-300 w-full my-4'></span>
        <div onClick={handleDashboard} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <RxDashboard size={20}  className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Dashboard</h1>
        </div>
        <div onClick={handleRegisterCandidate} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <VscNewFolder size={20}  className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Register Candidate</h1>
        </div>
        <div onClick={handleRegisteredCandidate} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <MdOutlineVerified size={20}  className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Candidates</h1>
        </div>
        <div onClick={handleRegisteredElection} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <MdOutlineCreateNewFolder size={20}  className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Elections</h1>
        </div>
        <span className='border-b-[1px] border-gray-200 w-full p-2 my-2'></span>
        <Link href="/" className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <RiHome3Line size={20} className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Home</h1>
        </Link>
        <Link href="/activeEletions" className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-4 border border-gray-200/90 hover:bg-gray-100'>
          <MdPoll size={20} className='text-gray-600'/>
          <h1 className='text-gray-600 text-lg ml-3 font-semibold'>Active Polls</h1>
        </Link>

        <span className='border border-gray-300 w-full my-4'></span>

        <div onClick={showLogoutModal} className='flex justify-start items-center w-full cursor-pointer p-3 rounded-md mt-3 border bg-red-600 hover:bg-red-800'>
          <MdOutlineLogout size={20}  className='text-gray-50'/>
          <h1 className='text-white text-lg ml-3 font-semibold'>Logout</h1>
        </div>
      </div>
      <main className='w-full sm:w-4/5'>
      <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: .5 }}
            className={`${dashboard ? "w-full h-screen" : "hidden"}`}
        >
          <div className='flex justify-between sm:justify-start items-center flex-row-reverse sm:flex-row px-2 sm:px-2 pt-2 sm:pt-3 pb-2'>
            <div className='w-full px-2 py-2 sm:py-2.5 bg-gray-100/80 flex justify-between items-center rounded-lg border'>
              <h1 className='font-extrabold text-gray-700 tracking-wider text-xl md:text-2xl text-center mt-3 mb-2'>Dashboard</h1>
              <div className='flex justify-between items-center'>
                <img src='/avatar.jpg' alt='' className='w-10 h-10 rounded-full border mr-2' />
                <div className='sm:hidden'>
                  {['bottom'].map((anchor) => (
                    <React.Fragment key={anchor}>
                      <HiMenuAlt3 onClick={toggleDrawer(anchor, true)} className="text-2xl hover:opacity-50"/>
                      <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                      >
                        {list(anchor)}
                      </SwipeableDrawer>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Dashboard  email={email} userData={userData} />

        </motion.div>
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: .5 }}
            className={`${registerCandidate ? "w-full h-screen" : "hidden"}`}
        >
          <div className='flex justify-between sm:justify-start items-center flex-row-reverse sm:flex-row px-2 sm:px-2 pt-2 sm:pt-3 pb-2'>
            <div className='w-full px-2 py-2 sm:py-2.5 bg-gray-100/80 flex justify-between items-center rounded-lg border'>
              <h1 className='font-extrabold text-gray-700 tracking-wider text-xl md:text-2xl text-center mt-3 mb-2'>Register Candidate</h1>
              <div className='flex justify-between items-center'>
                <img src='/avatar.jpg' alt='' className='w-10 h-10 rounded-full border mr-2' />
                <div className='sm:hidden'>
                  {['bottom'].map((anchor) => (
                    <React.Fragment key={anchor}>
                      <HiMenuAlt3 onClick={toggleDrawer(anchor, true)} className="text-2xl hover:opacity-50"/>
                      <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                      >
                        {list(anchor)}
                      </SwipeableDrawer>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Form  email={email} userData={userData} />

        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: .5 }}
          className={`${registeredCandidate ? "w-full h-screen" : "hidden"}`}
        >
          <div className='flex justify-between sm:justify-start items-center flex-row-reverse sm:flex-row px-2 sm:px-2 pt-2 sm:pt-3 pb-2'>
            <div className='w-full px-2 py-2 sm:py-2.5 bg-gray-100/80 flex justify-between items-center rounded-lg border'>
              <h1 className='font-extrabold text-gray-700 tracking-wider text-xl md:text-2xl text-center mt-3 mb-2'>Registered Candidates</h1>
              <div className='flex justify-between items-center'>
                <img src='/avatar.jpg' alt='' className='w-10 h-10 rounded-full border mr-2' />
                <div className='sm:hidden'>
                  {['bottom'].map((anchor) => (
                    <React.Fragment key={anchor}>
                      <HiMenuAlt3 onClick={toggleDrawer(anchor, true)} className="text-2xl hover:opacity-50"/>
                      <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                      >
                        {list(anchor)}
                      </SwipeableDrawer>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='p-1 sm:pt-4 sm:pb-4 sm:pl-2 mb-3'>
            <h2 className=' text-gray-500 text-base sm:text-xl font-semibold pb-3 px-1'>Registered candidates will appear here.</h2>
            <RegisteredCandidate userData={userData} className='w-full h-full ' />
          </div>
        </motion.div>  

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: .5 }}
          className={`${registerElection ? "w-full h-screen" : "hidden"}`}
        >
          <div className='flex justify-between sm:justify-start items-center flex-row-reverse sm:flex-row px-2 sm:px-2 pt-2 sm:pt-3 pb-2'>
            <div className='w-full px-2 py-2 sm:py-2.5 bg-gray-100/80 flex justify-between items-center rounded-lg border'>
              <h1 className='font-extrabold text-gray-700 tracking-wider text-xl md:text-2xl text-center mt-3 mb-2'>Election Management</h1>
              <div className='flex justify-between items-center'>
                <img src='/avatar.jpg' alt='' className='w-10 h-10 rounded-full border mr-2' />
                <div className='sm:hidden'>
                  {['bottom'].map((anchor) => (
                    <React.Fragment key={anchor}>
                      <HiMenuAlt3 onClick={toggleDrawer(anchor, true)} className="text-2xl hover:opacity-50"/>
                      <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                      >
                        {list(anchor)}
                      </SwipeableDrawer>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='p-1 sm:pb-4 sm:pl-2 mb-3'>
            <RegisterElection userData={userData} className='w-full h-full ' />
          </div>
        </motion.div> 


        {/* Logout Modal */}
         {isLogoutModalOpen && (
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
                          Logout Confirmation
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to logout?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={() => {
                        hideLogoutModal();
                        handleLogout();
                      }}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Logout
                    </button>
                    <button
                      type="button"
                      onClick={hideLogoutModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
};

export default Admin;
