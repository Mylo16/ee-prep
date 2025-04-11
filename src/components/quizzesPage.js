import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEnrollments } from '../redux/enrollmentSlice';
import images from '../utils/images';
import { deleteQuiz, getQuizzes } from '../redux/quizSlice';
import LoadingBar from './homepage/loadingBar';

export default function QuizPage() {
  const dispatch = useDispatch();
  const { enrollments, loading } = useSelector((store) => store.enrollments);
  const [quizExist, setQuizExist] = useState(false);
  const { quizzes, quiz_loading } = useSelector((store) => store.quizzes);
  const [courseId, setCourseId] = useState(null);
  const [courseCode, setCourseCode] = useState(null);
  const { user } = useSelector((store) => store.user);
  const { courses } = useSelector((store) => store.courses);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getEnrollments());
  }, [dispatch]);

  const handleTakeQuiz = (courseId, courseCode) => {
    dispatch(getQuizzes(courseId));
    setQuizExist(true);
    setCourseId(courseId);
    setCourseCode(courseCode);
  };

  const handleCloseClicked = () => {
    setQuizExist(false);
  };

  const handleQuizDelete = (courseId, quizId) => {
    dispatch(deleteQuiz({ courseId, quizId }));
    window.location.reload();
  };

  const navigateToQuestions = (courseId, quizId) => {
    navigate('/home/delete_questions', {
      state: {
        courseId, quizId,
      },
    });
  };

  if (user.user_type === 'admin') {
    return (
      courses.map((course) => (
        course.quizzes.length > 0 && course.quizzes.map((quiz) => (
          <div key={quiz.id} onClick={() => navigateToQuestions(course.id, quiz.id)} className="delete-quiz">
            <p className="dq-course-name">{course.course_name}</p>
            <p>{quiz.exam_title}</p>
            <button type="button" className="delete-btn" onClick={() => handleQuizDelete(course.id, quiz.id)}>Delete</button>
          </div>
        ))
      ))
    );
  }

  return (
    <>
      {quizExist && (
        <div className="dialog">
          <div className="quiz-wrap">
            <img onClick={() => handleCloseClicked()} className="close-alert" src={images.closeAlert} alt="close-dialog" />
            {!quiz_loading ? quizzes.map((quiz) => (
              <Link
                to="/home/questions"
                state={{
                  courseId, courseCode, examTitle: quiz.exam_title, quizId: quiz.id,
                }}
              >
                <div className="quiz-detail" key={quiz.id}>
                  <p>{quiz.exam_title}</p>
                  <div className="duration">
                    <img className="clock" src={images.clock} alt="clock" />
                    <p>
                      :
                      {quiz.duration}
                      mins
                    </p>
                  </div>
                  <img src={images.next} alt="enter-quiz" />
                </div>
              </Link>
            )) : <div className="quiz-loading"><LoadingBar /></div>}
          </div>
        </div>
      )}
      <div className="quiz-text">
        <div className="quiz-title">Quizzes</div>
        <p>Take quizzes to get you prepared for your final examination</p>
        <p>❗ You can only take quizzes on enrolled courses</p>
      </div>
      <div>
        <p className="enrolled-title">Enrolled Courses</p>
        <div className="enrolled-container">
          {!loading
            ? enrollments.map((enrollment) => (
              <div key={enrollment.course.course_code} className="course">
                <div className="course-wrap">
                  <p className="course-code">{enrollment.course.course_code}</p>
                  <p className="course-name">{enrollment.course.course_name}</p>
                  <div className="take-quiz" onClick={() => handleTakeQuiz(enrollment.course.id, enrollment.course.course_code)}>
                    <p>Take Quiz</p>
                    <img src={images.next} alt="quiz" />
                  </div>
                </div>
              </div>
            )) : <div className="quiz-loading"><LoadingBar /></div>}
        </div>
      </div>
    </>
  );
}
