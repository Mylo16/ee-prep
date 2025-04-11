import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserFromLocalStorage, getUserJwtFromLocalStorage } from '../utils/localStorageForUser';
import { api_base_url } from '../utils/api_url';

const user = getUserFromLocalStorage();

export const createProgress = createAsyncThunk('progress/new', async ({ courseId, quizId, progressData }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${api_base_url}/courses/${courseId}/quizzes/${quizId}/progresses`, progressData, {
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

export const getProgresses = createAsyncThunk('progresses', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/users/${user.id}}/progresses`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const getProgressById = createAsyncThunk('progresses/id', async ({ courseId, quizId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/courses/${courseId}/quizzes/${quizId}/progresses/1`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const updateProgress = createAsyncThunk('progresses/update', async ({
  courseId, quizId, progressId, progressData,
}, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${api_base_url}/courses/${courseId}/quizzes/${quizId}/progresses/${progressId}`, progressData, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const deleteProgress = createAsyncThunk('progresses/delete', async (progressId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${api_base_url}/users/${user.id}/progresses/${progressId}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return {
      id: progressId,
      message: response.data.message,
    };
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

const progressSlice = createSlice({
  name: 'progresses',
  initialState: {
    progresses: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(createProgress.pending, (state) => {
      state.loading = true;
      state.error = null;
      console.log('pending');
    })
      .addCase(createProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.progresses = action.payload;
        console.log('created');
      })
      .addCase(createProgress.rejected, (state) => {
        state.loading = false;
        state.error = true;
        console.log('error');
      })
      .addCase(getProgresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgresses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.progresses = action.payload;
      })
      .addCase(getProgresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProgressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgressById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload === null) {
          state.progresses = [];
        } else {
          state.progresses = [action.payload];
        }
      })
      .addCase(getProgressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.progresses = state.progresses.filter((progress) => progress.id !== action.payload.id);
      })
      .addCase(deleteProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('pending');
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.progresses = action.payload;
        console.log('created');
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        console.log(error);
      });
  },
});

export default progressSlice.reducer;
