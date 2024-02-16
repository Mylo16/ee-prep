import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ProgressBar from './progressBar';
import LinearProgress from './linearProgress';
import images from '../../utils/images';
import LoadingBar from './loadingBar';
import Footer from '../footer';
import { getUserById } from '../../redux/studentSlice';
import { getProjects } from '../../redux/projectSlice';
import { getAnnouncements } from '../../redux/announcementSlice';

export default function HomePage() {
  const { user } = useSelector((store) => store.user);
  const { student, loading } = useSelector((store) => store.student);
  const { projects, getProject } = useSelector((store) => store.projects);
  const [percentMark, setPercentMark] = useState(0);
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  const { announcements } = useSelector((store) => store.announcements);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserById());
    dispatch(getProjects());
    dispatch(getAnnouncements());
  }, [dispatch]);

  useEffect(() => {
    if (loading === false && student.progresses) {
      const totalMarks = student.progresses.length * 100;
      let totalScored = 0;
      student.progresses.forEach((progress) => {
        totalScored += parseInt(progress.total_marks_obtained, 10);
      });
      if (totalMarks !== 0) {
        const newPercentMark = (totalScored * 100) / totalMarks;
        setPercentMark(newPercentMark);
      }
    }
  }, [student]);

  if (student.length === 0) {
    return (
      <LoadingBar />
    );
  }

  return (
    <>
      <div className="main-page">
        <div className="col-2">
          <img className="shape-ellipse" src={images.ellipse} alt="shape-1" />
          <img className="shape-rectangle" src={images.rectangle} alt="shape-2" />
          <img className="shape-ship" src={images.ship} alt="shape-3" />
          <img className="shape-ellipse1" src={images.ellipse1} alt="shape-4" />
          <img className="shape-ellipse2" src={images.ellipse2} alt="shape-5" />
          <h1>
            Hello { user.full_name},
            <br />
            Welcome 👋
          </h1>
          {user.user_type !== 'admin' &&
          <>
          <p className="progress-text black-txt">Let&apos;s improve your progress!</p>
          <div className="progress-bar">
            <ProgressBar percentage={percentMark} />
          </div>
          <div className={isDarkMode ? "progresses blue-bg" : "progresses white-bg"}>
            { student.progresses.map((progress) => (
              <div key={progress.id} className='linear-progresses'>
                <div className="sub-progress">
                  <p className="progress-name">
                    {progress.course_code}
                    (
                    {progress.exam_title}
                    )
                  </p>
                  <p className="grade">{progress.grade}</p>
                </div>
                <div className="phone-progress"><LinearProgress percentage={progress.total_marks_obtained} /></div>
                <div className="desktop-progress"><ProgressBar smaller percentage={parseInt(progress.total_marks_obtained, 10)} /></div>
              </div>
            ))}
          </div>
          </>
          }
          
          <div className="announcement-container">
            <h2 className="general-announcement">General Announcement📢</h2>
            {announcements.length > 0 ?
            announcements.map((announcement) => (
              <div>
                <p className="announcement-title">❗ {announcement.title} 🔔</p>
                <p>{announcement.content}</p>
              </div> 
            ))
            :
            <p>There is no Announcement for the moment. Any new announcement will appear here👌</p>
            }
            
          </div>
          <div className="projects">
            <h2 className={isDarkMode ? 'eleesa-projects white-txt' : 'eleesa-projects black-txt'}>ELEESA PROJECTS📽</h2>
            <div className="projects-container">
              {projects.length > 0 ?
              projects.map((project) => (
                <div key={project.title} className={isDarkMode ? "project-container blue-bg" : "project-container grey-bg"}>
                  <img className="project-img" src={project.img_url} alt="project-pic" />
                  <div className="view-project">
                    <a href={project.description} className="see-project">See Project</a>
                    <div className="project-detail">
                      <p className="project-title">{project.title}</p>
                      <div>
                        {Array.from({ length: project.project_rating },
                          (_, index) => index + 1).map((star) => (
                            <img key={star} src={images.star} alt="rating" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
              :
              <p>There are no Projects added yet ❗❗</p>
            }
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
