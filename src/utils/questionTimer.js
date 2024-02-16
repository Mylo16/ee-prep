import React, { useState, useEffect } from 'react';

const QuestionTimer = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration/1000);

  // Update time left every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Clean up timer on component unmount
    return () => clearInterval(timer);
  }, []);

  // Trigger onTimeout callback when time runs out
  // useEffect(() => {
  //   if (timeLeft === 0) {
  //     onTimeout();
  //   }
  // }, [timeLeft, onTimeout]);

  // Format time left into minutes and seconds
  // const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft;

  return (
    <div className='timer'>
      Time Left: {seconds < 10 ? '0' : ''}{seconds}
    </div>
  );
};

export default QuestionTimer;