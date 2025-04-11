import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../redux/courseSlice';
import { createQuiz } from '../../redux/quizSlice';
import Alert from '../../utils/alert';
import LoadingBar from '../homepage/loadingBar';

export default function AddQuiz() {
  const dispatch = useDispatch();
  const [quizData, setQuizData] = useState({
    quiz: {
      exam_date: '',
      exam_title: '',
      duration: '',
      course_id: '',
      total_marks: '',
    },
  });

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  const { courses } = useSelector((store) => store.courses);
  const { error, quiz_loading } = useSelector((store) => store.quizzes);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmptyField = Object.values(quizData.quiz).some((value) => value === '');

    if (hasEmptyField) {
      alert('Please fill in all required fields');
      return;
    }
    dispatch(createQuiz({ courseId: quizData.quiz.course_id, quizData }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prevData) => ({
      quiz: {
        ...prevData.quiz,
        [name]: value,
      },
    }));
  };

  return (
    <>
      {quiz_loading && <div className="add-quiz-loadingbar"><LoadingBar /></div>}
      {error !== null && error !== false && <Alert message="failed to create quiz😞" title="Failed" />}
      {error === false && <Alert message="Quiz created successfully 🎉" title="Success" />}
      <form className="add-quiz-form" onSubmit={handleSubmit}>
        <div className="form-break">
          <div className="add-quiz-input">
            <label>Exam Title</label>
            <br />
            <select name="exam_title" onChange={handleInputChange} type="text" required className="select">
              <option>Select...</option>
              <option value="Mid-Sem">Mid-Sem</option>
              <option value="End-Sem">End-Sem</option>
            </select>
          </div>

          <div className="add-quiz-input">
            <label>Exam Date</label>
            <br />
            <input name="exam_date" onChange={handleInputChange} type="date" required className="input" />
          </div>
        </div>
        <div className="form-break">
          <div className="add-quiz-input">
            <label>Course</label>
            <br />
            <select name="course_id" onChange={handleInputChange} type="text" required className="select">
              <option>Select...</option>
              {courses.map((course) => (
                <Fragment key={course.id}>
                  <option value={course.id}>{course.course_name}</option>
                </Fragment>
              ))}
            </select>
          </div>

          <div className="add-quiz-input">
            <label>Total Marks</label>
            <br />
            <input name="total_marks" onChange={handleInputChange} type="number" required className="input" />
          </div>
        </div>

        <div className="add-quiz-input">
          <label>Duration</label>
          <br />
          <select name="duration" onChange={handleInputChange} type="text" required className="select">
            <option>Select...</option>
            <option value={60}>60 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
        </div>

        <input type="submit" className="submit" value="Create Quiz" />
      </form>
    </>
  );
}
