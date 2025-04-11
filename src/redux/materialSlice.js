import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserJwtFromLocalStorage } from '../utils/localStorageForUser';
import { api_base_url } from '../utils/api_url';

export const createMaterial = createAsyncThunk('materials/new', async ({ courseId, materialData }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${api_base_url}/courses/${courseId}/materials`, materialData, {
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

export const getMaterials = createAsyncThunk('materials', async (courseId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/courses/${courseId}/materials`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const getMaterialById = createAsyncThunk('materials/id', async ({ courseId, materialId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api_base_url}/courses/${courseId}/materials/${materialId}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

export const deleteMaterial = createAsyncThunk('materials/delete', async ({ courseId, materialId }, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${api_base_url}/courses/${courseId}/materials/${materialId}`, {
      headers: {
        Authorization: `bearer ${getUserJwtFromLocalStorage()}`,
      },
    });
    return {
      id: materialId,
      message: response.data.message,
    };
  } catch (error) {
    return rejectWithValue(error.response.statusText);
  }
});

const materialSlice = createSlice({
  name: 'materials',
  initialState: {
    materials: [],
    loading: false,
    error: null,
  },
  reducers: {
    disableMaterialAlert: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createMaterial.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.materials.push(action.payload);
      })
      .addCase(createMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.materials = action.payload;
      })
      .addCase(getMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.materials = state.materials.filter((material) => material.id !== action.payload.id);
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { disableMaterialAlert } = materialSlice.actions;
export default materialSlice.reducer;
