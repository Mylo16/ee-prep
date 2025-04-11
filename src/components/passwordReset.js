import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createReset } from '../redux/resetSlice';

export default function PasswordReset() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const { error } = useSelector((store) => store.reset);

  useEffect(() => {
    if (error === false) {
      alert('Password Instruction has been sent to your email. Click on the link to continue');
    }
  }, [error]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(createReset(email));
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setEmail(input);
  };
  return (
    <div>
      <h1 className="ee-prep">EE-PREP</h1>
      <p className="inspire-text">Nourish your inner skills</p>
      <p className="inspire-text">Enter email used for creating your account😊</p>
      <form onSubmit={handleFormSubmit}>
        <label>Enter Email</label>
        <br />
        <input className="email-input" name="email" onChange={handleInputChange} type="email" required />
        <input className="email-submit" type="submit" value="Send" />
      </form>
    </div>

  );
}
