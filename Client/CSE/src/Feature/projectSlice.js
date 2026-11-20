import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleApiAction } from "../Utils/ApiHandler";

// 1. Fetch User Projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (userId) => {
    const projects = await handleApiAction({ action: "GET", target: "projects" });
    return projects.filter((p) => p.userId === userId || p.ownerId === userId);
  }
);

// 2. Add New Project
export const addProjectThunk = createAsyncThunk(
  "projects/addProject",
  async (newProjectData) => {
    return await handleApiAction({
      action: "ADD",
      target: "projects",
      payload: newProjectData,
    });
  }
);

// 3. Edit Project
export const editProjectThunk = createAsyncThunk(
  "projects/editProject",
  async ({ id, name }) => {
    return await handleApiAction({
      action: "EDIT",
      target: "projects",
      payload: { id, name },
    });
  }
);

// 4. Delete Project
export const deleteProjectThunk = createAsyncThunk(
  "projects/deleteProject",
  async (projectId) => {
    await handleApiAction({
      action: "DELETE",
      target: "projects",
      payload: { id: projectId },
    });
    return projectId;
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Project
      .addCase(addProjectThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      // Edit Project
      .addCase(editProjectThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex((p) => p.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = { ...state.items[index], ...action.payload };
          }
        }
      })
      // Delete Project
      .addCase(deleteProjectThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default projectSlice.reducer;