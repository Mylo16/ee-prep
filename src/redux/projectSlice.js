import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserJwtFromLocalStorage } from '../utils/localStorageForUser';
import { api_base_url } from '../utils/api_url';

export const createProject = createAsyncThunk('project/new', async (projectData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${api_base_url}/projects`, projectData, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessages = error.response.data.errors.map((err, index) => ({
      id: index,
      message: err,
    }));
    return rejectWithValue(errorMessages);
  }
});

export const getProjects = createAsyncThunk('projects', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/projects`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const getProjectById = createAsyncThunk('projects/id', async ({ projectId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/projects/${projectId}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (projectId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${api_base_url}/projects/${projectId}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return {
      id: projectId,
      message: response.data.message,
    };
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    loading: false,
    error: null,
    deleted: false,
    getProject: null,
  },
  reducers: {
    disableProjectAlert: (state) => {
      state.deleted = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProject.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.deleted = false;
    })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.projects.push(action.payload);
        state.deleted = false;
      })
      .addCase(createProject.rejected, (state) => {
        state.loading = false;
        state.error = 'Error creating Project';
        state.deleted = false;
      })
      .addCase(getProjects.pending, (state) => {
        state.getProject = 'started';
        state.deleted = false;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.getProject = 'loaded';
        state.deleted = false;
        state.error = null;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.getProject = 'failed';
        state.deleted = false;
        state.error = action.payload;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.deleted = false;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.deleted = true;
        state.projects = state.projects.filter((material) => material.id !== action.payload.id);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.deleted = false;
        state.error = action.payload;
      });
  },
});

export const { disableProjectAlert } = projectSlice.actions;
export default projectSlice.reducer;
