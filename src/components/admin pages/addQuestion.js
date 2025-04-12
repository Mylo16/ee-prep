import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCourses,
} from '../../redux/courseSlice';
import {
  createQuestion, defaultError,
} from '../../redux/questionSlice';
import {
  createOption, changeOptionCreated,
} from '../../redux/optionSlice';
import Alert from '../../utils/alert';
import LoadingBar from '../homepage/loadingBar';

export default function AddQuestion() {
  const dispatch = useDispatch();
  const { courses } = useSelector((store) => store.courses);
  const {
    error, loading, successful, recentQuestion,
  } = useSelector((store) => store.questions);
  const { optionCreated, optionLoading } = useSelector((store) => store.options);

  const [courseId, setCourseId] = useState('');
  const [questionData, setQuestionData] = useState({
    question_type: '', question_text: '', time: '', correct_answer: '', quiz_id: '',
  });

  const [options, setOptions] = useState([
    { option_text: '', question_id: '' },
    { option_text: '', question_id: '' },
    { option_text: '', question_id: '' },
    { option_text: '', question_id: '' },
    { option_text: '', question_id: '' },
  ]);

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quiz_id') {
      const [quizId, selectedCourseId] = value.split('|');
      setCourseId(selectedCourseId);
      setQuestionData((prev) => ({ ...prev, [name]: quizId }));
    } else {
      setQuestionData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmptyField = Object.values(questionData).some((val) => val === '');
    if (hasEmptyField) return alert('Please fill in all required fields');
    dispatch(createQuestion({ courseId, quizId: questionData.quiz_id, questionData: { question: questionData } }));
  };

  const handleOptionInputChange = (index, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((opt, i) =>
        i === index ? { ...opt, option_text: value, question_id: recentQuestion.id } : opt
      )
    );
  };

  const handleOptionSubmit = (e) => {
    e.preventDefault();
    options.forEach((optionData) => {
      dispatch(createOption({ courseId, quizId: questionData.quiz_id, questionId: recentQuestion.id, optionData: { option: optionData } }));
    });
  };

  if (optionCreated) {
    dispatch(defaultError());
    dispatch(changeOptionCreated());
  }
  console.log(error);
  console.log(optionCreated)
  if (error === false && !optionCreated) {
    return (
      <>
        {optionLoading && <div className="add-quiz-loadingbar"><LoadingBar /></div>}
        <h2>Options</h2>
        <form className="add-question-form" onSubmit={handleOptionSubmit}>
          {options.map((opt, idx) => (
            <div className="add-quiz-input" key={idx}>
              <label>{`Option ${idx + 1}`}</label><br />
              <input
                type="text"
                className="input"
                required
                value={opt.option_text}
                onChange={(e) => handleOptionInputChange(idx, e.target.value)}
              />
            </div>
          ))}
          <input type="submit" className="submit" value="Create Options" />
        </form>
      </>
    );
  }

  return (
    <>
      {loading && <div className="add-quiz-loadingbar"><LoadingBar /></div>}
      {successful === false && <Alert message="failed to create quiz😞" title="Failed" />}
      {successful === true && <Alert message="Question created successfully 🎉" title="Success" />}
      <form className="add-question-form" onSubmit={handleSubmit}>
        <div className="form-break">
          <div className="add-quiz-input">
            <label>Question Type</label><br />
            <select name="question_type" onChange={handleInputChange} required className="select">
              <option>Select...</option>
              <option value="image">Image</option>
              <option value="text">Text</option>
            </select>
          </div>
          <div className="add-quiz-input">
            <label>Question</label><br />
            <textarea name="question_text" onChange={handleInputChange} required className="large-input" />
          </div>
        </div>
        <div className="form-break">
          <div className="add-quiz-input">
            <label>Time</label><br />
            <select name="time" onChange={handleInputChange} required className="select">
              <option>Select...</option>
              <option value={90000}>90 seconds</option>
              <option value={30000}>30 seconds</option>
            </select>
          </div>
          <div className="add-quiz-input">
            <label>Correct Answer</label><br />
            <input name="correct_answer" onChange={handleInputChange} required className="input" />
          </div>
        </div>
        <div className="add-quiz-input">
          <label>Quiz</label><br />
          <select name="quiz_id" onChange={handleInputChange} required className="select">
            <option>Select...</option>
            {courses.map((course) =>
              course.quizzes.map((quiz) => (
                <option key={quiz.id} value={`${quiz.id}|${course.id}`}>
                  {`$${course.course_name} (${quiz.exam_title})`}
                </option>
              ))
            )}
          </select>
        </div>
        <input type="submit" className="submit" value="Create Question" />
      </form>
    </>
  );
}
