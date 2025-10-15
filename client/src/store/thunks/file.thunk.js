import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/lib/axios.js";

export const fetchUploadUrlThunk = createAsyncThunk(
  "file/fetchUploadUrl",
  async ({ fileName, fileType }, { rejectWithValue }) => {
    try {
      const res = await API.post("/file/get-upload-url", {
        fileName,
        fileType,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  }
);

export const saveFileMetadataThunk = createAsyncThunk(
  "file/saveFileMetadata",
  async (
    { originalName, fileKey, fileType, fileSize, tags },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post("file/save-metadata", {
        originalName,
        fileKey,
        fileType,
        fileSize,
        tags,
      });
      return res.data.file;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  }
);

export const fetchDownloadUrlThunk = createAsyncThunk(
  "file/fetchDownloadUrl",
  async (fileKey) => {
    try {
      const res = await API.get("/file/get-download-url", {
        params: { fileKey },
      });
      return res.data.url;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  }
);

export const searchFilesThunk = createAsyncThunk(
  "file/searchFiles",
  async ({ query, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/file/search", {
        params: { query, page, limit },
      });
      return { ...data, query };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Search failed" }
      );
    }
  }
);

export const getAllFilesThunk = createAsyncThunk(
  "file/getAllFiles",
  async ({ page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/file", {
        params: { page, limit },
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch files"
      );
    }
  }
);

export const getFileByIdThunk = createAsyncThunk(
  "file/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await API.get(`/file/detail/${id}`, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch file"
      );
    }
  }
);

export const requestFileDownloadThunk = createAsyncThunk(
  "file/requestDownload",
  async (id, { rejectWithValue }) => {
    try {
      const data = await API.get(`/file/download/${id}`, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch file"
      );
    }
  }
);


