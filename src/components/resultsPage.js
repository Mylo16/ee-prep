import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProgressBar from './homepage/progressBar';
import images from '../utils/images';
import { createProgress, updateProgress } from '../redux/progressSlice';
import { getUserFromLocalStorage } from '../utils/localStorageForUser';
import LoadingBar from './homepage/loadingBar';


export default function ResultsPage() {
  window.addEventListener('load', () => {
    window.location.assign('https://ee-prep.vercel.app/');
  });
  const { progresses, error } = useSelector((store) => store.progresses);
  const { resultsData } = useSelector((store) => store.results);
  const percentMark = 100 * resultsData.score / resultsData.resultsQuestion.length;
  const dispatch = useDispatch();
  const location = useLocation();
  const { courseId } = location.state;
  const { courseCode } = location.state;
  const { examTitle } = location.state;
  const { quizId } = location.state;
  const user = getUserFromLocalStorage();
  const initialRender = useRef(true);

  useEffect(() => {

    let grade = '';
    const score = (resultsData.score / resultsData.resultsQuestion.length) * 100;
    if (score < 40) {
      grade = 'F';
    } else if (score < 50) {
      grade = 'E';
    } else if (score < 60) {
      grade = 'D';
    } else if (score < 65) {
      grade = 'C';
    } else if (score < 70) {
      grade = 'B';
    } else {
      grade = 'A';
    }

    if (progresses.length > 0) {
      dispatch(updateProgress({
        courseId,
        quizId,
        progressId: progresses[0].id,
        progressData: {
          progress: {
            total_marks_obtained: score,
            total_marks_available: 100,
            grade,
            course_code: courseCode,
            exam_title: examTitle,
            course_id: courseId,
            user_id: user.id,
            quiz_id: quizId,
          },
        },
      }));
    } else if (progresses.length === 0) {
      dispatch(createProgress({
        courseId,
        quizId,
        progressData: {
          progress: {
            total_marks_obtained: score,
            total_marks_available: 100,
            grade,
            course_code: courseCode,
            exam_title: examTitle,
            course_id: courseId,
            user_id: user.id,
            quiz_id: quizId,
          },
        },
      }));
    }
  }, [progresses]);

  if(error === true) {
    return(
      <p>Error</p>
    );
  }
  if(error === null) {
    return(
      <LoadingBar />
    );
  }
  if(error === false) {
  return (
    <>
      <img className="shape-ellipse" src={images.ellipse} alt="shape-1" />
      <img className="shape-rectangle" src={images.rectangle} alt="shape-2" />
      <img className="shape-ship" src={images.ship} alt="shape-3" />
      <img className="shape-ellipse1" src={images.ellipse1} alt="shape-4" />
      <img className="shape-ellipse2" src={images.ellipse2} alt="shape-5" />
      <div className="results-container">
        <h1 className="results-head">Results:</h1>
        <h2>
          {resultsData.score}
          /
          {resultsData.resultsQuestion.length}
        </h2>
        <ProgressBar percentage={percentMark} />
        <h2>Revision</h2>
        <div className="revision-container">
          {
            resultsData.resultsQuestion.map((question) => (
              <div className="revision-question" key={question.question}>
                <div className="mark"><img src={question.correct ? images.correct : images.wrong} alt="mark" /></div>
                {question.questionType === 'image' ?
                  <div>
                    <img className='ques-img' src={question.question} alt='question-img'/>
                    <div>
                      <p>Correct Answer:</p>
                      <img className='option-img' src={question.answer} alt='anwer-img'/>
                    </div>
                  </div>
                  :
                  <div>
                    <p>{question.question}</p>
                    <p className="correct-answer">
                      Correct Answer:
                      {question.answer}
                    </p>
                  </div>
                }
              </div>
            ))
          }
        </div>
      </div>
    </>
  );}
}
