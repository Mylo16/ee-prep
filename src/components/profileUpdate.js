import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../redux/userSlice';
import images from '../utils/images';

export default function ProfileUpdate() {
  const { student, loading } = useSelector((store) => store.student);
  const [userData, setUserData] = useState({
    user: {
      username: student.username || '',
      email: student.email || '',
      password: '',
      full_name: student.full_name || '',
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    validatePassword(password);
  }, [password, hasUpperCase, hasLowerCase, hasDigit, hasSpecialChar, isLengthValid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPasswordValid) {
      dispatch(updateUser(userData));
    } else {
      alert('All password requirements must be met ❗❗');
    }

    if (!loading) {
      navigate('/home');
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
    }
    setUserData((prevUserData) => ({
      user: {
        ...prevUserData.user,
        [name]: value,
      },
    }));
  };

  return (
    <>
      <form className="user-update-form" onSubmit={handleSubmit}>
        <div className="input">
          <label>Username</label>
          <br />
          <input value={userData.user.username} name="username" onChange={handleInputChange} type="text" required className="input" />
        </div>

        <div className="input">
          <label>Email</label>
          <br />
          <input name="email" value={userData.user.email} onChange={handleInputChange} type="email" required className="input" />
        </div>

        <div className="input">
          <label>Password</label>
          <br />
          <input name="password" onChange={handleInputChange} type="password" required className="input" />
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
          <label>Full Name</label>
          <br />
          <input name="full_name" value={userData.user.full_name} onChange={handleInputChange} type="text" required className="input" />
        </div>

        <input type="submit" className="submit" value="Update" />
      </form>
    </>
  );
}
