import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const QuestionTimer = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = timeLeft;

  return (
    <div className="timer">
      Time Left: {seconds < 10 ? '0' : ''}
      {seconds}
    </div>
  );
};

// ✅ PropTypes validation
QuestionTimer.propTypes = {
  duration: PropTypes.number.isRequired, // expects a number in milliseconds
};

export default QuestionTimer;
