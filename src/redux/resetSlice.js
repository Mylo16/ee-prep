import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const base_url = 'https://mysite-d1qu.onrender.com';

export const createReset = createAsyncThunk('/password_reset', async (userEmail, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${base_url}/password_reset`, userEmail, {
      headers: {
        Accept: 'application/json',
      },
      params: {
        email: userEmail,
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

export const updatePassword = createAsyncThunk('user/update_password', async ({ token, password }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${base_url}/password_reset`, { token, password }, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        token,
        password,
      },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const resetSlice = createSlice({
  name: 'reset',
  initialState: {
    token: '',
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(createReset.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.token = action.payload;
    })
      .addCase(createReset.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createReset.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(updatePassword.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default resetSlice.reducer;
