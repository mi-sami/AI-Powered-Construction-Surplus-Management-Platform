import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleApiAction } from "../Utils/ApiHandler";

// 1. Fetch User Advertisements / Listings
export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async () => {
    return await handleApiAction({ action: "GET", target: "listings" });
  }
);

// 2. Add New Advertisement
export const addListingThunk = createAsyncThunk(
  "listings/addListing",
  async (newListingData) => {
    return await handleApiAction({
      action: "ADD",
      target: "listings",
      payload: newListingData,
    });
  }
);

// Update Advertisement / Listing
export const updateListingThunk = createAsyncThunk(
  "listings/updateListing",
  async (updatedData) => {
    return await handleApiAction({
      action: "EDIT",
      target: "listings",
      payload: updatedData,
    });
  }
);

// Delete Advertisement / Listing
export const deleteListingThunk = createAsyncThunk(
  "listings/deleteListing",
  async (id) => {
    await handleApiAction({
      action: "DELETE",
      target: "listings",
      payload: { id },
    });
    return id;
  }
);

const listingSlice = createSlice({
  name: "listings",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(updateListingThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteListingThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default listingSlice.reducer;