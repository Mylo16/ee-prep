import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserFromLocalStorage, getUserJwtFromLocalStorage } from '../utils/localStorageForUser';
import { api_base_url } from '../utils/api_url';

export const getUserById = createAsyncThunk('user/id', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/users/${getUserFromLocalStorage().id}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    loading: null,
    error: null,
    student: [],
  },
  reducers: {
    clearStudent: (state) => {
      state.loading = null;
      state.student = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.student = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStudent } = studentSlice.actions;
export default studentSlice.reducer;
