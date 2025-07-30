// src/store/slices/siteSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
interface Category {
  active: boolean;
  description: string;
  id: number;
  name: string;
  unique_name: string;
}
interface SiteState {
  siteInfo: {
    category: string;
    websiteName: string;
    description: string;
    email: string;
    host?:string;
    domain?: string;
    siteId?: string;
    site_map?: any;
  } | null;
  categories: Category[] | null;
  isLoading: boolean;
  isEnhancing: boolean;
  isLoadingCategories: boolean;
  enhancedDescription: string | null;
  enhanceError: string | null;
  error: string | null;
  categoriesError: string | null;

}

const initialState: SiteState = {
  siteInfo: null,
  categories: null,
  isLoading: false,
  isEnhancing: false,
  isLoadingCategories: false,
  enhancedDescription: null,
  enhanceError: null,
  error: null,
  categoriesError: null,
};

export const submitSiteInfo = createAsyncThunk(
  'site/submitInfo',
  async (siteData: { 
    category: string; 
    websiteName: string; 
    description: string; 
    email: string;
    domain: string;
    dead_line:number;
    host: string;
    
  }, { rejectWithValue }) => {
    try {
      const response = await axios .post(`${import.meta.env.VITE_API_URL}/site`, siteData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to submit site information');
      }
      return rejectWithValue('Failed to submit site information');
    }
  }
);

export const updateSiteInfo = createAsyncThunk(
  'site/updateInfo',
  async (siteData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/site/${siteData.id}`, siteData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update site information');
      }
      return rejectWithValue('Failed to update site information');
    }
  }
);


export const launchSite = createAsyncThunk(
  'site/launch',
  async (payload: { 
    siteTitle: string; 
    email: string; 
    site_id: number; 
    host: string; 
    domain: string 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/launch`, payload, {
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) 
          ? error.response?.data?.message || 'Failed to launch site'
          : 'An unexpected error occurred'
      );
    }
  }
);

export const enhanceSiteDescription = createAsyncThunk(
  'site/enhanceDescription',
  async (payload: { desc: string; websiteName: string; category: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://harvices.websitebuilder.magicpagez.com/enhance', payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) 
          ? error.response?.data?.message || 'Failed to enhance description'
          : 'An unexpected error occurred'
      );
    }
  }
);

export const updateDomain = createAsyncThunk(
    'site/updateDomain',
    async ({ domain }: { domain: string }, { rejectWithValue, getState }) => {
      try {
        // Access state to get the required information
        const state = getState() as { site: any };
        const siteInfo = state.site.siteInfo.site;
        if (!siteInfo) {
          return rejectWithValue('Site information is missing');
        }
        
        // Construct the payload using existing site information
        const payload = {
          domain: domain,
          email: siteInfo.email,
          siteTitle: siteInfo.websiteName,
          site_id: Number(siteInfo.id) || 0,
          host: domain
        };
        
        // Call the proper API endpoint
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/webapp`, payload);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(error.response?.data?.message || 'Failed to update domain');
        }
        return rejectWithValue('Failed to update domain');
      }
    }
  );

  export const fetchCategories = createAsyncThunk(
  'site/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/section_category/all`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
      }
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    resetSiteState: (state) => {
      state.siteInfo = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSiteInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitSiteInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.siteInfo = action.payload;
      })
      .addCase(submitSiteInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSiteInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSiteInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.siteInfo = action.payload;
      })
      .addCase(updateSiteInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDomain.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDomain.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.siteInfo) {
          state.siteInfo = { ...state.siteInfo, ...action.payload };
      }
      })
      .addCase(updateDomain.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(enhanceSiteDescription.pending, (state) => {
        state.isEnhancing = true;
        state.enhanceError = null;
      })
      .addCase(enhanceSiteDescription.fulfilled, (state, action) => {
        state.isEnhancing = false;
        state.enhancedDescription = action.payload;
      })
      .addCase(enhanceSiteDescription.rejected, (state, action) => {
        state.isEnhancing = false;
        state.enhanceError = action.payload as string;
      })
         .addCase(fetchCategories.pending, (state) => {
        state.isLoadingCategories = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoadingCategories = false;
        state.categoriesError = action.payload as string;
      });
  },
});

export const { resetSiteState } = siteSlice.actions;
export default siteSlice.reducer;