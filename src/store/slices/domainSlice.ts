import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DomainVerification } from '../../types';

const initialState: DomainVerification = {
  domain: '',
  isVerified: false,
  isLoading: false,
  error: null,
};

export const verifyDomain = createAsyncThunk(
  'domain/verify',
  async (domain: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/domain/verify`, {
      domain,
    });
    return response.data;
  }
);

const domainSlice = createSlice({
  name: 'domain',
  initialState,
  reducers: {
    resetDomainState: (state) => {
      state.domain = '';
      state.isVerified = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyDomain.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyDomain.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isVerified = true;
        state.domain = action.payload.domain;
      })
      .addCase(verifyDomain.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Domain verification failed';
      });
  },
});

export const { resetDomainState } = domainSlice.actions;
export default domainSlice.reducer;