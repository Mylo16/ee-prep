import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import dashboard from '../../assets/dashboard.png';
import course from '../../assets/course.png';
import quiz from '../../assets/quiz.png';
import closeBtn from '../../assets/close.png';
import { userSignout } from '../../redux/userSlice';
import signout from '../../assets/sign-out.png';
import images from '../../utils/images';
import { clearStudent, getUserById } from '../../redux/studentSlice';

export default function SideBar({
  menuClicked, phone, onChildClick, showMenu,
}) {
  const { user } = useSelector((store) => store.user);
  const name = phone ? 'sidebar' : 'desktop-sidebar';
  const isAdmin = user.user_type === 'admin';
  const dispatch = useDispatch();
  document.addEventListener('scroll', () => {
    onChildClick();
  });
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  const handleSignout = () => {
    dispatch(userSignout());
    dispatch(clearStudent());
  };

  return (
    <>
      <div className={menuClicked ? `${name}` : 'no-sidebar'}>
        <div className="menu-head">
          <div className="profile"><img className="eleesa-logo" src={isDarkMode ? images.logo2 : images.logo1} alt="logo" /></div>
          <div
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                showMenu();
              }
            }}
            role="button"
            tabIndex={0}
            onClick={() => showMenu()}
          >
            <img src={closeBtn} alt="close-btn" className="close-btn" />
          </div>
        </div>
        <ul className="side-links">
          <li className="side-link">
            <img src={dashboard} alt="dashboard" className="logo" />
            <a className="link" href="https://ee-prep.vercel.app/">Dashboard</a>
          </li>
          <li className="side-link">
            <img src={course} alt="courses" className="logo" />
            <Link className="link" to="/home/courses">Courses</Link>
          </li>
          <li className="side-link">
            <img src={quiz} alt="quizzes" className="logo" />
            <Link className="link" to="/home/quizzes">Quizzes</Link>
          </li>
          <div
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                handleSignout();
              }
            }}
            role="button"
            tabIndex={0}
            className="side-link"
            onClick={handleSignout}
          >
            <img src={signout} alt="logout" className="logo" />
            <Link className="link" to="/">Sign Out</Link>
          </div>
          {isAdmin
          && (
          <>
            <li className="side-link">
              <img src={images.addQuiz} alt="add-quiz" className="logo" />
              <Link className="link" to="/home/add_quiz">Add Quiz</Link>
            </li>
            <li className="side-link">
              <img src={images.addQuiz} className="logo" alt="add-course" />
              <Link className="link" to="/home/add_course">Add Course</Link>
            </li>
            <li className="side-link">
              <img src={images.addQuiz} className="logo" alt="add-question" />
              <Link className="link" to="/home/add_question">Add Question</Link>
            </li>
            <li className="side-link">
              <img src={images.addQuiz} className="logo" alt="add-material" />
              <Link className="link" to="/home/add_material">Add Material</Link>
            </li>
            <li className="side-link">
              <img src={images.addQuiz} className="logo" alt="add-material" />
              <Link className="link" to="/home/announcements">Notices</Link>
            </li>
            <li className="side-link">
              <img src={images.addQuiz} className="logo" alt="add-material" />
              <Link className="link" to="/home/projects">Projects</Link>
            </li>
          </>
          )}
        </ul>
      </div>

    </>
  );
}

SideBar.propTypes = {
  phone: PropTypes.bool.isRequired,
  menuClicked: PropTypes.bool.isRequired,
  onChildClick: PropTypes.func.isRequired,
  showMenu: PropTypes.func.isRequired,
};
