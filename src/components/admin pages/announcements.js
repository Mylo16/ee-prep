import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createAnnouncement, deleteAnnouncement, getAnnouncements } from '../../redux/announcementSlice';
import { getUserFromLocalStorage } from '../../utils/localStorageForUser';

export default function Announcement() {
  const userId = getUserFromLocalStorage().id;
  const { announcements, getAnnouncement } = useSelector((store) => store.announcements);
  const [announcementData, setAnnouncementData] = useState({
    announcement: {
      title: '',
      content: '',
      user_id: userId,
    },
  });
  const dispatch = useDispatch();
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  useEffect(() => {
    dispatch(getAnnouncements());
  }, [dispatch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (announcements.length > 0) {
      alert('Delete previous announcement before creating new one');
    } else {
      dispatch(createAnnouncement(announcementData));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementData((prevData) => (
      {
        announcement: {
          ...prevData.announcement,
          [name]: value,
        },
      }
    ));
  };

  const handleDeleteAnnouncement = (announcementId) => {
    dispatch(deleteAnnouncement(announcementId));
  };

  return (
    <>
      <div>
        <h2>Create Announcement</h2>
        <form className="announcement-form" onSubmit={handleFormSubmit}>
          <div className="add-quiz-input">
            <label>Title</label>
            <br />
            <input required type="text" name="title" onChange={handleInputChange} className="input" />
          </div>
          <div className="add-quiz-input">
            <label>Content</label>
            <br />
            <input required type="text" name="content" onChange={handleInputChange} className="input" />
          </div>
          <input type="submit" className="submit" value="Create Announcement" />
        </form>
      </div>
      {
        getAnnouncement === 'loaded' && announcements.length > 0
          ? (
            <div className="show-announcements">
              <h2>Already Existing Announcement</h2>
              <div className={isDarkMode ? 'announcement-manage blue-bg' : 'announcement-manage grey-bg'}>
                <div>
                  <h3>{announcements[0].title}</h3>
                  <p>{announcements[0].content}</p>
                </div>
                <button onClick={() => handleDeleteAnnouncement(announcements[0].id)} type="button">Delete</button>
              </div>
            </div>
          )
          : <p>No announcement added yet</p>
      }

    </>
  );
}
