import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserJwtFromLocalStorage } from '../utils/localStorageForUser';
import { api_base_url } from '../utils/api_url';

export const createAnnouncement = createAsyncThunk('announcement/new', async (announcementData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${api_base_url}/announcements`, announcementData, {
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

export const getAnnouncements = createAsyncThunk('announcements', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/announcements`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const getAnnouncementById = createAsyncThunk('announcements/id', async ({ announcementId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/announcements/${announcementId}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const deleteAnnouncement = createAsyncThunk('announcements/delete', async (announcementId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${api_base_url}/announcements/${announcementId}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return {
      id: announcementId,
      message: response.data.message,
    };
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

const announcementSlice = createSlice({
  name: 'announcements',
  initialState: {
    announcements: [],
    loading: false,
    error: null,
    deleted: false,
    getAnnouncement: null,
  },
  reducers: {
    disableAnnouncementAlert: (state) => {
      state.deleted = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createAnnouncement.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.deleted = false;
    })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.announcements.push(action.payload);
        state.deleted = false;
      })
      .addCase(createAnnouncement.rejected, (state) => {
        state.loading = false;
        state.error = 'Error creating Announcement';
        state.deleted = false;
      })
      .addCase(getAnnouncements.pending, (state) => {
        state.getAnnouncement = 'started';
        state.deleted = false;
        state.error = null;
      })
      .addCase(getAnnouncements.fulfilled, (state, action) => {
        state.getAnnouncement = 'loaded';
        state.deleted = false;
        state.error = null;
        state.announcements = action.payload;
      })
      .addCase(getAnnouncements.rejected, (state, action) => {
        state.getAnnouncement = 'failed';
        state.deleted = false;
        state.error = action.payload;
      })
      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
        state.deleted = false;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.deleted = true;
        state.announcements = state.announcements.filter((material) => material.id !== action.payload.id);
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.deleted = false;
        state.error = action.payload;
      });
  },
});

export const { disableAnnouncementAlert } = announcementSlice.actions;
export default announcementSlice.reducer;
