import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSignin } from '../redux/userSlice';
import { getUserFromLocalStorage } from '../utils/localStorageForUser';
import LoadingBar from './homepage/loadingBar';
import images from '../utils/images';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [userData, setUserData] = useState({});
  const [noUser, setNoUser] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userSignin(userData)).then(() => {
      if (!getUserFromLocalStorage()) {
        setNoUser(() => {
          const newState = true;
          return newState;
        });
      }
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <div className="session-page">
      <div className="session-container">
        <div className="login-body">
          <div className={loading ? 'login-loading' : 'no-loading'}><LoadingBar /></div>
          <h1>EE-PREP</h1>
          <p className="inspire-text">Nourish your inner skills</p>
          { noUser && <p className="invalid-login">Invalid Email or Password</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input">
              <label htmlFor="username">Username</label>
              <br />
              <input name="username" id="username" onChange={handleInputChange} required className="username-input" />
            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <br />
              <input type="password" id="password" name="password" onChange={handleInputChange} required className="password-input" />
            </div>
            <input type="submit" className="submit" value="Login" />
          </form>
          <div className="signup-link">
            <p className="to-signup">Don&apos;t have an account?</p>
            <Link to="/signup" className="sign-up">Sign-up</Link>
          </div>
        </div>
        <div className="right-col">
          <div className="right-col-content">
            <div className="background-cover">
              <img src={images.logo2} className="login-logo" alt="logo" />
            </div>
            <img className="background" src={images.background} alt="background" />
          </div>

        </div>
      </div>
    </div>
  );
}
