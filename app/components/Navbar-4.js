import React from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link'
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import List from '@mui/material/List';

import { VscAccount } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import { CgMenuRight } from "react-icons/cg";

function Navbar() {
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
      <div className='flex justify-between items-center p-3.5 mb-5 flex-row-reverse'>
        <AiOutlineCloseCircle
          onClick={toggleDrawer(anchor, false)}
          className='text-2xl font-bold'
          style={{ float: 'right' }}
        />
        <img src='/VOTE_LOGO.png' className='h-12' />
      </div>
      <List className='px-2 flex flex-col justify-between overflow-y-auto pb-20'>
        <div className='flex flex-col'>
          <Link href="/" className="border-t-2 py-4 pl-3 text-base text-[#0E5D8A] font-bold tracking-[2px]">Ongoing Election</Link>

          <Link href="/activeEletions" className="border-t-2 py-4 pl-3 text-base text-[#0E5D8A] font-bold tracking-[2px]">Upcomming Election</Link>

          <Link href="/admin" className="border-y-2 py-4 pl-3 text-base text-[#0E5D8A] font-bold tracking-[2px]">Electoral Committee</Link>

        </div>
      </List>
    </Box>
  );
  return (
    <nav className='bg-white py-4 px-4 sm:px-5 lg:px-10 absolute w-full flex justify-between items-end z-50'>
      <Link href="/">
        <img src='/VOTE_LOGO.png' className='h-10 sm:h-12' />
      </Link>
      <div className='hidden lg:flex items-center'>
        <Link href="/" className="text-lg text-[#0E5D8A] hover:text-[#0E5D8A]/60 font-bold tracking-wider mx-2">Ongoing Election</Link>

        <Link href="/activeEletions" className="text-lg text-[#0E5D8A] hover:text-[#0E5D8A]/60 font-bold tracking-wider mx-2">Upcomming Election</Link>

        <Link href="/admin" className="text-lg text-[#0E5D8A] hover:text-[#0E5D8A]/60 font-bold tracking-wider mx-2 ">Electoral Committee</Link>

        <Link href='/voteNow' ><img src='/avatar.jpg' alt='' className='w-11 h-11 rounded-full border border-blue-950 ml-3' /></Link>
      </div>
      <div className='lg:hidden'>
        {['top'].map((anchor) => (
          <React.Fragment key={anchor}>
            <CgMenuRight onClick={toggleDrawer(anchor, true)} className="text-3xl text-black hover:opacity-50"/>
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
    </nav>
  )
}

export default Navbar