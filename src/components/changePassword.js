import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { updatePassword } from '../redux/resetSlice';
import images from '../utils/images';
import LoadingBar from './homepage/loadingBar';

export default function ChangePassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((store) => store.reset);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    if (error === false) {
      navigate('/');
    }
  }, [error]);

  useEffect(() => {
    validatePassword(password);
  }, [password, hasUpperCase, hasLowerCase, hasDigit, hasSpecialChar, isLengthValid]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      alert('Invalid password input; make sure the requirements are all passed');
      return;
    }

    if (password === confirm) {
      dispatch(updatePassword({ token, password }));
    } else {
      alert('Passwords do not match');
    }
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
      // console.log(isPasswordValid);
    } else {
      setConfirm(value);
    }
  };

  return (
    <div className="change-password">
      <h1 className="ee-prep">EE-PREP</h1>
      <p className="inspire-text">Nourish your inner skills</p>
      <p className="inspire-text">Enter your new password to recover your account 😊</p>
      <div className={loading ? 'login-loading' : 'no-loading'}><LoadingBar /></div>
      <form className="login-form" onSubmit={handleFormSubmit}>
        <div className="input">
          <label>New Password</label>
          <br />
          <input className="" name="password" type="password" required onChange={handleInputChange} />
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
        <div className="input">
          <label>Confirm New Password</label>
          <br />
          <input name="confirm" type="password" required onChange={handleInputChange} />
        </div>
        <input type="submit" className="submit" value="Change Password" />
      </form>
    </div>
  );
}
