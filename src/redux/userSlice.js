import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  removeUserFromLocalStorage,
  getUserFromLocalStorage,
  getUserJwtFromLocalStorage,
  saveUserToLocalStorage,
} from '../utils/localStorageForUser';

const base_url = "https://mysite-1gyi.onrender.com";

export const userSignup = createAsyncThunk('user/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${base_url}/users`, userData, {
      headers: {
        Accept: 'application/json',
      },
    });
    return {
      user: response.data.user,
      jwt: response.data.jwt,
    };
  } catch (error) {
    const errorMessages = error.response.data.errors.map((err, index) => ({
      id: index,
      message: err,
    }));
    return rejectWithValue(errorMessages);
  }
});

export const updateUser = createAsyncThunk('user/update', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${base_url}/api/v1/users/${getUserFromLocalStorage().id}`, userData, {
      headers: {
        Accept: 'application/json',
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return {
      user: response.data.user,
      jwt: response.data.jwt,
    };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const userSignin = createAsyncThunk('user/signin', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${base_url}/login`, { username, password }, {
      headers: {
        Accept: 'application/json',
      },
    });
    return {
      user: response.data.user,
      jwt: response.data.jwt,
    };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: undefined,
    jwt: null,
    loading: true,
    error: null,
  },
  reducers: {
    userSignout: (state) => {
      state.user = null;
      state.jwt = null;
      removeUserFromLocalStorage();
    },
    loadUserFromLocalStorage: (state) => {
      const user = getUserFromLocalStorage();
      const jwt = getUserJwtFromLocalStorage();
      if (user && jwt) {
        state.user = user;
        state.jwt = jwt;
      }
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSignin.fulfilled, (state, action) => {
      if (action.payload.user !== undefined || action.payload.jwt !== undefined) {
        saveUserToLocalStorage(action.payload.user, action.payload.jwt);
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.jwt = action.payload.jwt;
      }
      state.loading = false;
    })
      .addCase(userSignin.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(userSignin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        saveUserToLocalStorage(action.payload.user, action.payload.jwt);
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.jwt = action.payload.jwt;
      })
      .addCase(userSignup.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(userSignup.rejected, (state) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        saveUserToLocalStorage(action.payload.user, action.payload.jwt);
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.jwt = action.payload.jwt;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { loadUserFromLocalStorage, userSignout } = userSlice.actions;

export default userSlice.reducer;
