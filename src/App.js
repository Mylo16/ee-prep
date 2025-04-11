import {
  Link, Outlet, Route, Routes,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import LoginPage from './components/loginPage';
import SignupPage from './components/signupPage';
import { loadUserFromLocalStorage, userSignout } from './redux/userSlice';
import ProtectedRoute from './components/protectedRoute';
import SideBar from './components/homepage/sideBar';
import CoursesPage from './components/coursesPage';
import images from './utils/images';
import QuizPage from './components/quizzesPage';
import QuestionsPage from './components/questionsPage';
import ResultsPage from './components/resultsPage';
import DarkModeToggle from './utils/darkModeToggle';
import ProfileUpdate from './components/profileUpdate';
import HomePage from './components/homepage/homePage';
import AddQuiz from './components/admin pages/addQuiz';
import { disableAlert, getCourses } from './redux/courseSlice';
import AddCourse from './components/admin pages/addCourse';
import AddQuestion from './components/admin pages/addQuestion';
import { disableQuestionAlert } from './redux/questionSlice';
import DeleteQuestions from './components/admin pages/deleteQuestions';
import MaterialsPage from './components/admin pages/materialsPage';
import AddMaterial from './components/admin pages/addMaterial';
import { disableMaterialAlert } from './redux/materialSlice';
import CourseMaterials from './components/courseMaterials';
import PasswordReset from './components/passwordReset';
import ChangePassword from './components/changePassword';
import Announcement from './components/admin pages/announcements';
import Projects from './components/admin pages/projects';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const [isDarkMode, setIsDarkMode] = useState('');

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  function Navbar() {
    const [menuClicked, setMenuClicked] = useState(false);
    const [profileClicked, setProfileClicked] = useState(false);

    useEffect(() => {
      dispatch(getCourses());
    }, [dispatch]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (!['trigram', 'sidebar', 'side-links', 'logo', 'menu-head', 'profile', 'side-link'].includes(e.target.className)) {
          setMenuClicked(false);
        }
        if (!['profile-details', 'profile-container', 'profile', 'arrow-down'].includes(e.target.className)) {
          setProfileClicked(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);

    const toggleMenu = () => {
      dispatch(disableAlert());
      dispatch(disableQuestionAlert());
      dispatch(disableMaterialAlert());
      setMenuClicked((prev) => !prev);
    };

    const handleToggleMode = (value) => {
      setIsDarkMode(value);
    };

    const handleProfileClick = () => {
      setProfileClicked((prev) => !prev);
    };

    const handleSignout = () => {
      dispatch(userSignout());
    };

    return (
      <main className={isDarkMode ? 'dark-mode' : 'light-mode'}>
        <div className="nav-container">
          <div
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMenu()}
            role="button"
            tabIndex={0}
            onClick={toggleMenu}
          >
            <img src={images.trigram} alt="menu" className="trigram" />
          </div>

          <div className="phone-sidebar">
            <SideBar
              phone
              showMenu={toggleMenu}
              onChildClick={() => setMenuClicked(false)}
              menuClicked={menuClicked}
            />
          </div>

          <div className="nav-links">
            <DarkModeToggle onChildClick={handleToggleMode} />
            <div
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleProfileClick()}
              role="button"
              tabIndex={0}
              onClick={handleProfileClick}
              className="profile-container"
            >
              <img className="profile" src={images.profile2} alt="profile" />
              <img className="arrow-down" src={images.expand} alt="arrow-down" />
            </div>

            <ul className={profileClicked ? 'profile-details' : 'none'}>
              <button type="button" className="profile-link">
                <Link to="/home/profile_update">Edit Profile</Link>
              </button>
              <button type="button" className="profile-link">
                <Link to="/home/settings">Settings</Link>
              </button>
              <li>
                <button type="button" className="sign-out-btn" onClick={handleSignout}>
                  Sign-out
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="desktop-container">
          <div className="desktop-sidebar-container">
            <SideBar
              onChildClick={() => {}}
              menuClicked={false}
              phone={false}
              showMenu={() => {}}
            />
          </div>
          <div className="outlet">
            <Outlet />
          </div>
        </div>
      </main>
    );
  }

  return (
    <Routes>
      <Route element={<ProtectedRoute userAllowed={!user} redirectTo="/home" />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/password_reset" element={<PasswordReset />} />
        <Route path="/change_password/:token" element={<ChangePassword />} />
      </Route>

      <Route element={<ProtectedRoute userAllowed={!!user} redirectTo="/" />}>
        <Route path="/home" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="quizzes" element={<QuizPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="quiz/results" element={<ResultsPage />} />
          <Route path="profile_update" element={<ProfileUpdate />} />
          <Route path="add_quiz" element={<AddQuiz />} />
          <Route path="add_course" element={<AddCourse />} />
          <Route path="add_question" element={<AddQuestion />} />
          <Route path="delete_questions" element={<DeleteQuestions />} />
          <Route path="delete_materials" element={<MaterialsPage />} />
          <Route path="add_material" element={<AddMaterial />} />
          <Route path="course_materials" element={<CourseMaterials />} />
          <Route path="announcements" element={<Announcement />} />
          <Route path="projects" element={<Projects />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
