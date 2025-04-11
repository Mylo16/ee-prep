import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../redux/courseSlice';
import Alert from '../../utils/alert';
import LoadingBar from '../homepage/loadingBar';
import { createMaterial } from '../../redux/materialSlice';

export default function AddMaterial() {
  const dispatch = useDispatch();
  const [materialData, setMaterialData] = useState({
    material: {
      title: '',
      description: '',
      file_url: '',
      course_id: '',
    },
  });

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  const { courses } = useSelector((store) => store.courses);
  const { error, loading } = useSelector((store) => store.materials);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(materialData);
    const hasEmptyField = Object.values(materialData.material).some((value) => value === '');

    if (hasEmptyField) {
      alert('Please fill in all required fields');
      return;
    }
    dispatch(createMaterial({ courseId: materialData.material.course_id, materialData }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMaterialData((prevData) => ({
      material: {
        ...prevData.material,
        [name]: value,
      },
    }));
  };

  return (
    <>
      {loading && <div className="add-quiz-loadingbar"><LoadingBar /></div>}
      {error !== null && error !== false && <Alert message="failed to create material😞" title="Failed" />}
      {error === false && <Alert message="Material created successfully 🎉" title="Success" />}
      <form className="add-material-form" onSubmit={handleSubmit}>
        <div className="form-break">
          <div className="add-quiz-input">
            <label>Title</label>
            <br />
            <select name="title" onChange={handleInputChange} type="text" required className="select">
              <option>Select...</option>
              {courses.map((course) => (
                <Fragment key={course.id}>
                  <option value={course.course_name}>{course.course_name}</option>
                </Fragment>
              ))}
            </select>
          </div>

          <div className="add-quiz-input">
            <label>Material Description</label>
            <br />
            <textarea name="description" onChange={handleInputChange} required className="large-input" />
          </div>
        </div>
        <div className="form-break">
          <div className="add-quiz-input">
            <label>Course</label>
            <br />
            <select name="course_id" onChange={handleInputChange} type="text" required className="select">
              <option>Select...</option>
              {courses.map((course) => (
                <Fragment key={course.id}>
                  <option value={course.id}>{course.course_name}</option>
                </Fragment>
              ))}
            </select>
          </div>

          <div className="add-quiz-input">
            <label>File Url</label>
            <br />
            <input name="file_url" onChange={handleInputChange} type="text" required className="input" />
          </div>
        </div>

        <input type="submit" className="submit" value="Create Material" />
      </form>
    </>
  );
}
