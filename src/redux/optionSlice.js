import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserJwtFromLocalStorage } from '../utils/localStorageForUser';
import { api_base_url } from '../utils/api_url';

export const createOption = createAsyncThunk('options/new', async ({
  courseId, quizId, questionId, optionData,
}, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${api_base_url}/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/options`, optionData, {
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

export const getOptions = createAsyncThunk('options', async ({ courseId, quizId, questionId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/options`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const getOptionById = createAsyncThunk('options/id', async ({
  courseId, quizId, questionId, optionId,
}, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/options/${optionId}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const deleteOption = createAsyncThunk('options/delete', async ({
  courseId, quizId, questionId, optionId,
}, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${api_base_url}/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/options/${optionId}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return {
      id: optionId,
      message: response.data.message,
    };
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

const optionSlice = createSlice({
  name: 'options',
  initialState: {
    options: [],
    optionLoading: false,
    error: null,
    optionCreated: false,
  },
  reducers: {
    changeOptionCreated: (state) => {
      state.optionCreated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOption.pending, (state) => {
      state.optionLoading = true;
      state.error = null;
    })
      .addCase(createOption.fulfilled, (state, action) => {
        state.optionLoading = false;
        state.error = false;
        state.optionCreated = true;
        state.options.push(action.payload);
      })
      .addCase(createOption.rejected, (state, action) => {
        state.optionLoading = false;
        state.error = action.payload;
        state.createOption = false;
      })
      .addCase(getOptions.pending, (state) => {
        state.optionLoading = true;
        state.error = null;
      })
      .addCase(getOptions.fulfilled, (state, action) => {
        state.optionLoading = false;
        state.error = null;
        state.options = action.payload;
      })
      .addCase(getOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOption.pending, (state) => {
        state.optionLoading = true;
        state.error = null;
      })
      .addCase(deleteOption.fulfilled, (state, action) => {
        state.optionLoading = false;
        state.error = null;
        state.options = state.options.filter((option) => option.id !== action.payload.id);
      })
      .addCase(deleteOption.rejected, (state, action) => {
        state.optionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { changeOptionCreated } = optionSlice.actions;
export default optionSlice.reducer;
