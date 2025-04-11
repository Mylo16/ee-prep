import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LoadingBar from './homepage/loadingBar';
import { getMaterials } from '../redux/materialSlice';

export default function CourseMaterials() {
  const { materials, loading } = useSelector((store) => store.materials);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getMaterials(location.state.courseId));
  }, [dispatch]);

  if (loading) {
    return (
      <LoadingBar />
    );
  }
  if (materials.length === 0) {
    return (
      <h3>No materials are available for this course</h3>
    );
  }

  return (
    <>
      <h2 className="course-material-header">Course Materials</h2>
      {materials.map((material) => (
        <div className="delete-qtn-container" key={material.id}>
          <p className="question-del">{material.title}</p>
          <a href={material.file_url} className="view-btn">View</a>
        </div>
      ))}
    </>
  );
}
