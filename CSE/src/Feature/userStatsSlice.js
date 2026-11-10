import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleApiAction } from "../Utils/ApiHandler";

// User Listings and Orders Count Fetcher Thunk
export const fetchUserStats = createAsyncThunk(
  "userStats/fetchUserStats",
  async (userId) => {
    if (!userId) return { activeListingsCount: "n", ordersCount: "n" };

    let activeListingsCount = "n";
    let ordersCount = "n";

    try {
      const listings = await handleApiAction({ action: "GET", target: "listings" });
      const userListings = listings.filter((item) => item.sellerId === userId);
      activeListingsCount = userListings.length;
    } catch (err) {
      activeListingsCount = "n";
    }

    try {
      const orders = await handleApiAction({ action: "GET", target: "orders" });
      const userOrders = orders.filter((item) => item.buyerId === userId);
      ordersCount = userOrders.length;
    } catch (err) {
      ordersCount = "n";
    }

    return { activeListingsCount, ordersCount };
  }
);

const userStatsSlice = createSlice({
  name: "userStats",
  initialState: {
    activeListingsCount: "n",
    ordersCount: "n",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.activeListingsCount = action.payload.activeListingsCount;
        state.ordersCount = action.payload.ordersCount;
      })
      .addCase(fetchUserStats.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userStatsSlice.reducer;