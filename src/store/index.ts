import { configureStore } from '@reduxjs/toolkit';
import domainReducer from './slices/domainSlice';
import siteReducer from './slices/siteSlice';
import authReducer from '../features/auth/store/authSlice'; 


export const store = configureStore({
  reducer: {
    auth: authReducer,
    domain: domainReducer,
    site: siteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;