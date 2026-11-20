import { configureStore } from "@reduxjs/toolkit";
import listingSlice from "../Feature/listingSlice";
import userStateSlice from "../Feature/userStatsSlice";
import projectSlice from "../Feature/projectSlice";

const Store = configureStore({
  reducer: {
    listings: listingSlice,
    userStats: userStateSlice,
    projects: projectSlice,
  },
});

export default Store;