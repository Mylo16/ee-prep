import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { getQuestions } from '../redux/questionSlice';
import LoadingBar from './homepage/loadingBar';
import { resultsDetails } from '../redux/resultsSlice';
import { getProgressById } from '../redux/progressSlice';
import QuestionTimer from '../utils/questionTimer';

export default function QuestionsPage() {
  const { questions, loading } = useSelector((store) => store.questions);
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [quesCount, setQuesCount] = useState(0);
  const ques = [...questions];
  const [resultsQuestion, setResultsQuestion] = useState([]);
  const resultsOptions = [];
  const [correct, setCorrect] = useState([]);
  const [score, setScore] = useState(0);
  const ans = [];
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnim, setShowAnim] = useState(false);
  const [readyToNavigate, setReadyToNavigate] = useState(false);
  const navigate = useNavigate();
  const [toDispatch, setToDispatch] = useState(false);
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  window.addEventListener('load', () => {
    window.location.assign('/home/quizzes');
  });

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateOptionsAndShuffle = (question) => {
    const options = [...question.options];
    shuffleArray(options);
    const opt = [];
    opt.push(options[0].option_text);
    opt.push(options[1].option_text);
    opt.push(options[2].option_text);
    opt.push(question.correct_answer);
    shuffleArray(opt);

    return opt;
  };

  useEffect(() => {
    dispatch(getProgressById({ courseId: state.courseId, quizId: state.quizId }));
  }, []);

  useEffect(() => {
    dispatch(getQuestions({ courseId: state.courseId, quizId: state.quizId }));
  }, [dispatch, state.courseId, state.quizId]);

  useEffect(() => {
    if (ques.length > 0) {
      const newOptions = generateOptionsAndShuffle(ques[0]);
      setOptions(newOptions);
    }
  }, [questions]);

  useEffect(() => {
    if (options.length !== 0) {
      setShowAnim(true);
    }
  }, [options]);

  useEffect(() => {
    if (quesCount === ques.length - 1) {
      handleShowResults();
    }
  }, [toDispatch]);

  function handlSelectedOption(_option, bool) {
    if (!bool) { setShowAnim(false); }
  }

  const [checked, setChecked] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
  });
  function HandleChecked(id) {
    if (id === '1') {
      setChecked({
        ...checked, check1: true, check2: false, check3: false, check4: false,
      });
    }
    if (id === '2') {
      setChecked({
        ...checked, check1: false, check2: true, check3: false, check4: false,
      });
    }
    if (id === '3') {
      setChecked({
        ...checked, check1: false, check2: false, check3: true, check4: false,
      });
    }
    if (id === '4') {
      setChecked({
        ...checked, check1: false, check2: false, check3: false, check4: true,
      });
    }
  }

  function HandleChange(e) {
    setSelectedOption(e.target.value);
    HandleChecked(e.target.id);
  }

  function handleShowResults() {
    dispatch(resultsDetails({
      resultsQuestion,
      resultsOptions,
      ans,
      score,
      correct,
    }));
  }

  function handleTimeout() {
    const newResultsQuestion = [...resultsQuestion];
    const newCorrect = [...correct];

    if (selectedOption === ques[quesCount].correct_answer) {
      newResultsQuestion.push({
        question: ques[quesCount].question_text,
        answer: ques[quesCount].correct_answer,
        correct: true,
        questionType: ques[quesCount].question_type,
      });
      newCorrect.push(true);
      setResultsQuestion(newResultsQuestion);
      setCorrect(newCorrect);
      setScore(score + 1);
      setToDispatch(!toDispatch);
    }
    if (selectedOption !== ques[quesCount].correct_answer) {
      newResultsQuestion.push({
        question: ques[quesCount].question_text,
        answer: ques[quesCount].correct_answer,
        correct: false,
        questionType: ques[quesCount].question_type,
      });
      newCorrect.push(false);
      setResultsQuestion(newResultsQuestion);
      setCorrect(newCorrect);
      setToDispatch(!toDispatch);
    }

    if (quesCount !== ques.length - 1) {
      setShowAnim(true);
      setQuesCount(quesCount + 1);
      setOptions(generateOptionsAndShuffle(ques[quesCount + 1]));
    } else {
      setShowAnim(false);
      setReadyToNavigate(true);
    }

    setChecked({
      ...checked, check1: false, check2: false, check3: false, check4: false,
    });
  }

  function handleNavigation() {
    navigate('/home/quiz/results', {
      state: {
        courseId: state.courseId, courseCode: state.courseCode, examTitle: state.examTitle, quizId: state.quizId,
      },
    });
  }

  if (options.length === 0) {
    return (
      <>
        <div className="quiz-loading"><LoadingBar /></div>
      </>
    );
  }

  return (
    <>
      <CSSTransition onExit={() => handleTimeout()} onEntered={() => setShowAnim(false)} in={showAnim} timeout={ques[quesCount].time} classNames={ques[quesCount].time === 90000 ? 'example1' : 'example'} unmountOnExit>
        <div className="time-bar-wrapper"><div className={isDarkMode ? 'time-bar red-bg' : 'time-bar blue-bg'} /></div>
      </CSSTransition>
      {showAnim === true &&
        <QuestionTimer duration={ques[quesCount].time} />
      }
      <div className={isDarkMode ? 'question-container black-bg' : 'question-container primary-bg'}>
        {ques[quesCount].question_type === "text" ?
        <p>
          {ques[quesCount].question_text}
          {' '}
        </p> :
        <img className="ques-img" src={ques[quesCount].question_text} alt="question diagram" />
        }
        <div className='options'>
          <div className={ques[quesCount].question_type === "text" ? 'radio-container1' : 'radio-container'}>
            <input checked={checked.check1} onChange={HandleChange} type="radio" id="1" value={options[0]} />
            <label htmlFor="1">{ques[quesCount].question_type === "text" ? options[0] : <img className='option-img' src={options[0]} alt='option'/>}</label>
          </div>
          <div className={ques[quesCount].question_type === "text" ? 'radio-container1' : 'radio-container'}>
            <input checked={checked.check2} onChange={HandleChange} type="radio" id="2" value={options[1]} />
            <label htmlFor="2">{ques[quesCount].question_type === "text" ? options[1] : <img className='option-img' src={options[1]} alt='option'/>}</label>
          </div>
          <div className={ques[quesCount].question_type === "text" ? 'radio-container1' : 'radio-container'}>
            <input checked={checked.check3} onChange={HandleChange} type="radio" id="3" value={options[2]} />
            <label htmlFor="3">{ques[quesCount].question_type === "text" ? options[2] : <img className='option-img' src={options[2]} alt='option'/>}</label>
          </div>
          <div className={ques[quesCount].question_type === "text" ? 'radio-container1' : 'radio-container'}>
            <input checked={checked.check4} onChange={HandleChange} type="radio" id="4" value={options[3]} />
            <label htmlFor="4">{ques[quesCount].question_type === "text" ? options[3] : <img className='option-img' src={options[3]} alt='option'/>}</label>
          </div>
        </div>
        {!readyToNavigate
          ? <button onClick={() => handlSelectedOption(selectedOption, false)} className="next-button" type="button">Next</button>
          : <button onClick={() => handleNavigation()} className="next-button" type="button">Show Results</button>}

      </div>
    </>
  );
}
