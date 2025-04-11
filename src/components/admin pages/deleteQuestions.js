import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { deleteQuestion, getQuestions } from '../../redux/questionSlice';
import LoadingBar from '../homepage/loadingBar';

export default function DeleteQuestions() {
  const { questions, loading } = useSelector((store) => store.questions);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getQuestions({ quizId: location.state.quizId, courseId: location.state.courseId }));
  }, [dispatch]);

  const handleDeleteQuestion = (questionId) => {
    dispatch(deleteQuestion({ questionId, quizId: location.state.quizId, courseId: location.state.courseId }));
  };

  if (loading) {
    return (
      <LoadingBar />
    );
  }
  if (questions.length === 0) {
    return (
      <h3>No questions are available for this quiz</h3>
    );
  }
  return (
    questions.map((question) => (
      <div className="delete-qtn-container" key={question.id}>
        <p className="question-del">{question.question_text}</p>
        <button type="button" className="delete-btn" onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
      </div>
    ))
  );
}
