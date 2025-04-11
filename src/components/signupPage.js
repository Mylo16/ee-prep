import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSignup } from '../redux/userSlice';
import images from '../utils/images';
import LoadingBar from './homepage/loadingBar';

export default function SignupPage() {
  const [userData, setUserData] = useState({ user: {} });
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState('');
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((store) => store.user);

  useEffect(() => {
    validatePassword(password);
  }, [password, hasUpperCase, hasLowerCase, hasDigit, hasSpecialChar, isLengthValid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPasswordValid && password === confirm) {
      dispatch(userSignup(userData));
    } else if (password !== confirm) {
      alert('Passwords do not match');
    } else if (!isPasswordValid) {
      alert('Invalid password input; all requirements must pass');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validatePassword = (value) => {
    setHasUpperCase(/[A-Z]/.test(value));
    setHasLowerCase(/[a-z]/.test(value));
    setHasDigit(/\d/.test(value));
    setHasSpecialChar(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value));
    setIsLengthValid(value.length >= 8);

    const isValid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isLengthValid;

    setIsPasswordValid(isValid);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    }
    if (name === 'confirm') {
      setConfirm(value);
    }
    setUserData({
      user: {
        ...userData.user,
        [name]: value,
      },
    });
  };

  return (
    <div className="session-page">
      <div className="session-container">
        <div className="signup-body">
          <h1>EE-PREP</h1>
          <p className="inspire-text">Nourish your inner skills</p>
          { error === true && <p className="invalid-login">Username already exist ❗❗</p>}
          <div className={loading ? 'login-loading' : 'no-loading'}><LoadingBar /></div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="signup-form-break">
              <div className="input">
                <label>Username</label>
                <br />
                <input name="username" onChange={handleInputChange} type="text" required className="input" />
              </div>

              <div className="input">
                <label>Email</label>
                <br />
                <input name="email" onChange={handleInputChange} type="email" required className="input" />
              </div>
            </div>
            <div className="signup-form-break">
              <div className="input">
                <label>Full Name</label>
                <br />
                <input name="full_name" onChange={handleInputChange} type="text" required className="input" />
              </div>
              <div />
              <div className="input">
                <label>Password</label>
                <br />
                <input name="password" onChange={handleInputChange} value={password} type={showPassword ? 'text' : 'password'} required className="input" />
                <img className="show-password" src={showPassword ? images.view : images.noView} alt="show-password" onClick={togglePasswordVisibility} />
              </div>
            </div>

            <div className="input">
              <label>Confirm Password</label>
              <br />
              <input name="confirm" type="password" required onChange={handleInputChange} />
            </div>
            <ul>
              <li className="password-check">
                <p>Password must include an upper case</p>
                <img src={hasUpperCase ? images.correct : images.wrong} alt="password-check" />
              </li>
              <li className="password-check">
                <p>Password must include a lower case</p>
                <img src={hasLowerCase ? images.correct : images.wrong} alt="password-check" />
              </li>
              <li className="password-check">
                <p>Password must include a digit</p>
                <img src={hasDigit ? images.correct : images.wrong} alt="password-check" />
              </li>
              <li className="password-check">
                <p>Password must include a special character</p>
                <img src={hasSpecialChar ? images.correct : images.wrong} alt="password-check" />
              </li>
              <li className="password-check">
                <p>Password must be at least 8 characters long</p>
                <img src={isLengthValid ? images.correct : images.wrong} alt="password-check" />
              </li>
            </ul>
            <div className="signup-btn-container">
              <input type="submit" className="submit" value="Sign Up" />
            </div>
          </form>

          <div className="login-link">
            <p className="to-login">Already have an account?</p>
            <a href="/" className="login">Login</a>
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
