import { useDispatch, useSelector } from "react-redux";
import { createProject, deleteProject, getProjects } from "../../redux/projectSlice";
import { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "../../utils/localStorageForUser";

export default function Projects() {
  const userId = getUserFromLocalStorage().id;
  const { projects, getProject } = useSelector((store) => store.projects);
  const [projectData, setProjectData] = useState({
    project: {
      title: '',
      description: '',
      user_id: userId,
      image_url: '',
      project_rating: '',
    }
  });
  const dispatch = useDispatch();
  const isDarkMode = localStorage.getItem('darkMode') === 'true';


  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(createProject(projectData));
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setProjectData((prevData) => (
      {
        project: {
          ...prevData.project,
          [name]: value,
        }
      }
    ));
  }

  const handleDeleteProject = (projectId) => {
    dispatch(deleteProject(projectId));
  }

  return(
    <>
      <div>
        <h2>Create Projects</h2>
        <form className="add-project-form" onSubmit={handleFormSubmit}>
          <div className="form-break">
          <div className="add-quiz-input">
            <label>Title</label>
            <br />
            <input required type="text" name="title" onChange={handleInputChange} className="input" />
          </div>
          <div className="add-quiz-input">
            <label>Description URL</label>
            <br />
            <input required type="text" name="description" onChange={handleInputChange} className="input" />
          </div>
          </div>
          <div className="form-break">
          <div className="add-quiz-input">
          <label>Project Rating</label>
          <br />
          <select name="project_rating" onChange={handleInputChange} type="number" required className="select">
            <option>Select...</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          </div>
          <div className="add-quiz-input">
            <label>Image URL</label>
            <br />
            <input required type="text" name="img_url" onChange={handleInputChange} className="input" />
          </div>
          </div>
          
          <input type="submit" className="submit" value="Create Project"/>
        </form>
      </div>
      {
        getProject === 'loaded' && projects.length > 0 ?
          <div className="show-projects">
            <h2>Already Existing Projects</h2>
            {
              projects.map((project) => (
                <div className={isDarkMode ? "project-manage blue-bg" : "project-manage grey-bg"} key={project.id}>
                  <p>{project.title}</p>
                  <p>{project.project_rating}</p>
                  <button onClick={() => handleDeleteProject(project.id)} type="button">Delete</button>
                </div>
              ))
            }
          </div>
        :
        <h2>No project added yet</h2>
      }
      
    </>
  );
}