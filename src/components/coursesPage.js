import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import images from '../utils/images';
import { createEnrollment, deleteEnrollment, getEnrollments } from '../redux/enrollmentSlice';
import { getUserFromLocalStorage } from '../utils/localStorageForUser';
import Alert from '../utils/alert';
import LoadingBar from './homepage/loadingBar';
import Footer from './footer';
import { deleteCourse } from '../redux/courseSlice';
import '../css/courses.css';

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { courses, loading, isDeleted } = useSelector((store) => store.courses);
  const { enrollments, error } = useSelector((store) => store.enrollments);
  const years = [1, 2, 3, 4];
  const sems = [1, 2];
  const containerRef = useRef(null);
  const user = getUserFromLocalStorage();
  const navigate = useNavigate();

  const handleNext = (percentage) => {
    const container = containerRef.current;
    if (container) {
      const scrollValue = (container.clientWidth * percentage) / 100;
      container.scrollBy({
        left: scrollValue,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    dispatch(getEnrollments());
  }, [dispatch]);

  const unenrollClicked = (id) => {
    dispatch(deleteEnrollment(id));
  };

  const handleEnrollment = (userId, courseId) => {
    const newDate = new Date();
    const currentDate = newDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const enrollmentData = {
      enrollment: {
        enrollment_date: currentDate,
        user_id: userId,
        course_id: courseId,
      },
    };
    dispatch(createEnrollment(enrollmentData));
  };

  const handleCourseDelete = (courseId) => {
    dispatch(deleteCourse(courseId));
  };

  const handleShowMaterials = (courseId) => {
    navigate('/home/delete_materials', { state: { courseId } });
  };

  const handleShowCourseMaterials = (courseId) => {
    navigate('/home/course_materials', { state: { courseId } });
  };

  return (
    <>
      <div className="courses-page">
        {error !== null && error !== false && <Alert message={error} title="Failed" />}
        {error === false && <Alert message="Enrollment created successfully 🎉" title="Success" />}
        {user.user_type !== 'admin'
          ? <div className="course-activity">Course Activity</div>
          : (
            <>
              <h1 className="course-activity">Course Management</h1>
              {isDeleted && <Alert message="Deleted Successfully 😊" title="success" />}
            </>
          )}
        {user.user_type !== 'admin'
          ? <p>Get access to course materials or enroll in any of the courses</p>
          : <p>Delete either a course or a course material</p>}
        <div className="course-scroll">
          <p>Courses</p>
          <div className="next-courses">
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Space') {
                  handleNext(-100);
                }
              }}
              role="button"
              tabIndex={0}
              onClick={() => handleNext(-100)}
            >
              <img src={images.prev} alt="prev_courses" />
            </div>
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Space') {
                  handleNext(100);
                }
              }}
              role="button"
              tabIndex={0}
              onClick={() => handleNext(100)}
            >
              <img src={images.next} alt="next_courses" />
            </div>
          </div>
        </div>
        <div ref={containerRef} className="courses-container">
          {
        years.map((year) => (
          <div key={year} className="year-courses">
            <p className="year">
              Year
              {year}
            </p>
            {
              sems.map((sem) => (
                <div className="sem-container" key={sem}>
                  <p className="sem">
                    Semester
                    {sem}
                  </p>
                  {!loading
                    ? courses.map((course) => (
                      course.year === year && course.semester === sem
                        ? (
                          <div key={course.id} className="courses">
                            <p className="course-code">{course.course_code}</p>
                            <p className="course-name">{course.course_name}</p>
                            {user.user_type !== 'admin'
                              ? (
                                <div>
                                  <button className="materials-btn" type="button" onClick={() => handleShowCourseMaterials(course.id)}>Materials</button>
                                  <div
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === 'Space') {
                                        handleNext(100);
                                      }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleEnrollment(user.id, course.id)}
                                    className="enroll"
                                  >
                                    <p>Enroll</p>
                                    <img src={images.next} alt="enroll" />
                                  </div>
                                </div>
                              )
                              : (
                                <div>
                                  <button type="button" className="materials-btn" onClick={() => handleShowMaterials(course.id)}>Materials</button>
                                  <button type="button" className="delete-btn" onClick={() => handleCourseDelete(course.id)}>Delete</button>
                                </div>
                              )}
                          </div>
                        ) : ''
                    )) : <div className="course-loading"><LoadingBar /></div>}
                </div>
              ))
            }
          </div>

        ))
      }

        </div>
        {user.user_type !== 'admin'
        && (
        <div>
          <p className="enrolled-title">Enrolled Courses</p>
          <div className="enrolled-container">
            {
          enrollments.map((enrollment) => (
            <div key={enrollment.course.course_code} className="course">
              <div className="courses">
                <p className="course-code">{enrollment.course.course_code}</p>
                <p className="course-name">{enrollment.course.course_name}</p>
                <div
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Space') {
                      handleNext(100);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="unenroll"
                  onClick={() => unenrollClicked(enrollment.id)}
                >
                  <p>Unenroll</p>
                  <img src={images.prev} alt="unenroll" />
                </div>
              </div>
            </div>
          ))
        }
          </div>
        </div>
        )}
      </div>
      <Footer />
    </>
  );
}
