import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUploadUrlThunk,
  saveFileMetadataThunk,
  fetchDownloadUrlThunk,
  searchFilesThunk,
  getAllFilesThunk,
  getFileByIdThunk,
  requestFileDownloadThunk,
} from "../thunks/file.thunk.js";

const initialState = {
  files: [],
  filesPage: 1,
  filesHasMore: true,
  filesLoading: false,

  searchFiles: [],
  searchPage: 1,
  searchHasMore: true,
  searchLoading: false,
  currentQuery: "",
  
  openedFile: null,
  loadingMore: false,
  buttonLoading: false,

  loadingDownload: false,
  error: null,
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    resetSearch(state) {
      state.searchFiles = [];
      state.searchPage = 1;
      state.searchHasMore = true;
      state.currentQuery = "";
      state.searchLoading = false;
    },

    setOpenedFile(state, action) {
      state.openedFile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUploadUrlThunk.pending, (state) => {
        state.filesLoading = true;
      })
      .addCase(fetchUploadUrlThunk.fulfilled, (state) => {
        state.filesLoading = false;
      })
      .addCase(fetchUploadUrlThunk.rejected, (state, action) => {
        state.filesLoading = false;
        state.error = action.error.message;
      })

      // .addCase(saveFileMetadataThunk.fulfilled, (state, action) => {
      //   state.files.unshift(action.payload);
      // })

      .addCase(searchFilesThunk.pending, (state, action) => {
        const page = action.meta.arg?.page || 1;
        if (page === 1) {
          state.searchFiles = [];
          state.searchPage = 1;
          state.searchHasMore = true;
          state.searchLoading = true;
        } else {
          state.loadingMore = true;
        }
      })
      .addCase(searchFilesThunk.fulfilled, (state, action) => {
        const { files, pagination, query } = action.payload;
        state.currentQuery = query;
        state.searchLoading = false;
        state.loadingMore = false;

        if (pagination.page > 1) {
          state.searchFiles = [...state.searchFiles, ...files];
        } else {
          state.searchFiles = files;
        }
        state.searchPage = pagination.page;
        state.searchHasMore = pagination.hasMore;
      })
      .addCase(searchFilesThunk.rejected, (state, action) => {
        state.searchLoading = false;
        state.loadingMore = false;
        state.error = action.payload?.message || action.error.message;
      })

      .addCase(fetchDownloadUrlThunk.fulfilled, () => {})

      .addCase(getAllFilesThunk.pending, (state, action) => {
        const page = action.meta.arg?.page || 1;
        if (page === 1) {
          state.files = [];
          state.filesHasMore = true;
          state.filesLoading = true;
          state.filesPage = 1;
        } else {
          state.loadingMore = true;
        }
      })
      .addCase(getAllFilesThunk.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        state.filesLoading = false;
        state.loadingMore = false;

        if (pagination.page > 1) {
          state.files = [...state.files, ...data];
        } else {
          state.files = data;
        }
        state.filesPage = pagination.page;
        state.filesHasMore = pagination.hasMore;
      })
      .addCase(getAllFilesThunk.rejected, (state, action) => {
        state.filesLoading = false;
        state.loadingMore = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(getFileByIdThunk.pending, (state) => {
        state.filesLoading = true;
        state.error = null;
      })
      .addCase(getFileByIdThunk.fulfilled, (state, action) => {
        state.filesLoading = false;
        state.openedFile = action.payload?.data?.data;
      })
      .addCase(getFileByIdThunk.rejected, (state, action) => {
        state.filesLoading = false;
        state.error = action.payload;
      })

      .addCase(requestFileDownloadThunk.pending, (state) => {
        state.buttonLoading = true;
        state.error = null;
      })
      .addCase(requestFileDownloadThunk.fulfilled, (state, action) => {
        state.buttonLoading = false;

      })
      .addCase(requestFileDownloadThunk.rejected, (state, action) => {
        state.buttonLoading = false;
        state.error = action.payload;
      })
  },
});

export const { resetSearch, setOpenedFile } = filesSlice.actions;
export default filesSlice.reducer;
