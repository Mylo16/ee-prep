import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../redux/courseSlice';
import Alert from '../../utils/alert';
import LoadingBar from '../homepage/loadingBar';

export default function AddCourse() {
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState({
    course: {
      course_code: '',
      course_name: '',
      semester: '',
      year: '',
    },
  });

  const { loading, error } = useSelector((store) => store.courses);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmptyField = Object.values(courseData.course).some((value) => value === '');

    if (hasEmptyField) {
      alert('Please fill in all required fields');
      return;
    }
    dispatch(createCourse(courseData));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      course: {
        ...prevData.course,
        [name]: value,
      },
    }));
  };

  return (
    <>
      {loading && <div className="add-quiz-loadingbar"><LoadingBar /></div>}
      {error !== null && error !== false && <Alert message="failed to create course😞" title="Failed" />}
      {error === false && <Alert message="Course created successfully 🎉" title="Success" />}
      <form className="add-course-form" onSubmit={handleSubmit}>
        <div className="form-break">
          <div className="add-quiz-input">
            <label htmlFor="course_name">Course Name</label>
            <br />
            <input
              id="course_name"
              name="course_name"
              onChange={handleInputChange}
              type="text"
              required
              className="input"
            />
          </div>
          <div className="add-quiz-input">
            <label htmlFor="course_code">Course Code</label>
            <br />
            <input
              id="course_code"
              name="course_code"
              onChange={handleInputChange}
              type="text"
              required
              className="input"
            />
          </div>
        </div>
        <div className="form-break">
          <div className="add-quiz-input">
            <label htmlFor="year">Level</label>
            <br />
            <select
              id="year"
              name="year"
              onChange={handleInputChange}
              required
              className="select"
            >
              <option value="">Select...</option>
              <option value={1}>Level 100 </option>
              <option value={2}>Level 200</option>
              <option value={3}>Level 300</option>
              <option value={4}>Level 400</option>
            </select>
          </div>

          <div className="add-quiz-input">
            <label htmlFor="semester">Semester</label>
            <br />
            <select
              id="semester"
              name="semester"
              onChange={handleInputChange}
              required
              className="select"
            >
              <option value="">Select...</option>
              <option value={1}>Sem 1</option>
              <option value={2}>Sem 2</option>
            </select>
          </div>
        </div>

        <input type="submit" className="submit" value="Create Course" />
      </form>
    </>
  );
}
