import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LoadingBar from '../homepage/loadingBar';
import { deleteMaterial, getMaterials } from '../../redux/materialSlice';

export default function MaterialsPage() {
  const { materials, loading } = useSelector((store) => store.materials);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getMaterials(location.state.courseId));
  }, [dispatch]);

  const handleDeleteMaterial = (materialId) => {
    dispatch(deleteMaterial({ materialId, courseId: location.state.courseId }));
  };

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
    materials.map((material) => (
      <div className="delete-qtn-container" key={material.id}>
        <p className="question-del">{material.title}</p>
        <button type="button" className="delete-btn" onClick={() => handleDeleteMaterial(material.id)}>Delete</button>
      </div>
    ))
  );
}
