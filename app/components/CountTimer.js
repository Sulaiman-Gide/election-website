import React, { useEffect, useState } from 'react';

function CountTimer() {
  const calculateTimeRemaining = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return Math.max(0, endOfDay - now);
  };

  const [timer, setTimer] = useState(calculateTimeRemaining());
  const [countdownInterval, setCountdownInterval] = useState(null);

  useEffect(() => {
    const startCountdown = () => {
      const interval = setInterval(() => {
        setTimer((prevTimer) => Math.max(0, prevTimer - 1000)); // Subtract 1000 milliseconds (1 second)
      }, 1000);

      setCountdownInterval(interval);
    };

    startCountdown();

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, []);

  const formatTime = (timeRemaining) => {
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

    return (
      <div>
        <span>{String(hours).padStart(2, '0')}</span> hrs :{' '}
        <span>{String(minutes).padStart(2, '0')}</span> mins :{' '}
        <span>{String(seconds).padStart(2, '0')}</span> secs
      </div>
    );
  };

  return (
    <div className=' text-gray-100 text-lg sm:text-3xl font-bold text-center mukta-extrabold tracking-wide my-2 sm:my-7'>
      <span>{formatTime(timer)}</span>
    </div>
  )
}

export default CountTimer
