
import listingSlice from "../Feature/listingSlice";
import userStateSlice from "../Feature/userStatsSlice";
import projectSlice from "../Feature/projectSlice";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Feature/authSlice";

const Store = configureStore({
  reducer: {
    listings: listingSlice,
    userStats: userStateSlice,
    projects: projectSlice,
    auth: authReducer,
  },
});

export default Store;