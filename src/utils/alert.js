import { useState } from 'react';
import { useDispatch } from 'react-redux';
import images from './images';
import { disableAlert } from '../redux/courseSlice';
import { disableQuestionAlert } from '../redux/questionSlice';

export default function Alert({ title, message }) {
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();
  const handleCloseClicked = () => {
    setClicked(true);
    dispatch(disableAlert());
    dispatch(disableQuestionAlert());
  };
  return (
    <>
      <div className={clicked ? 'no-alert' : 'alert-container'}>
        <div className="alert-title-wrap">
          <div className="alert-title-wrap">
            <img className="status-img" src={title === 'failed' ? images.failed : images.success} alt="status" />
            <p className="alert-title">{title}</p>
          </div>
          <img onClick={() => handleCloseClicked()} className="close-alert" src={images.closeAlert} alt="close alert" />
        </div>
        <p className="alert-message black-txt">{message}</p>
      </div>
    </>
  );
}
