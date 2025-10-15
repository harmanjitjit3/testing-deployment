import { useState, useRef } from "react";
import { UploadCloud, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUploadUrlThunk,
  saveFileMetadataThunk,
} from "@/store/thunks/file.thunk.js";

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [msg, setMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const uploadCancelToken = useRef(null);
  const dispatch = useDispatch();

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heif",
    "image/heic",
  ];

  function validateFile(selectedFile) {
    if (!allowedTypes.includes(selectedFile.type)) {
      setMsg("Invalid file type. Only documents & images allowed.");
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setMsg("File too large. Max size is 10MB.");
      return false;
    }
    return true;
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setMsg("Please select a file first.");
      return;
    }

    try {
      setMsg("Requesting upload URL...");
      setUploading(true);

      const res = await dispatch(
        fetchUploadUrlThunk({ fileName: file.name, fileType: file.type })
      );

      const { uploadUrl, fileKey } = res.payload;

      setMsg("Uploading file...");
      uploadCancelToken.current = axios.CancelToken.source();
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const prog = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(prog);
        },
        cancelToken: uploadCancelToken.current.token,
      });

      await dispatch(
        saveFileMetadataThunk({
          originalName: file.name,
          fileKey,
          fileType: file.type,
          fileSize: file.size,
          tags,
        })
      );

      setMsg("Upload successful");
      setFile(null);
      setTags("");
      setProgress(0);
      toast.success("Upload successful. Wait for admin approval.");

      if (onUploaded) {
        onUploaded({ fileKey, tags });
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        setMsg("Upload canceled");
        toast.error("Upload canceled");
      } else {
        console.error(err);
        setMsg("Upload failed");
        toast.error("Upload failed");
      }
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (validateFile(selectedFile)) setFile(selectedFile);
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  }

  function cancelUpload() {
    if (uploadCancelToken.current) {
      uploadCancelToken.current.cancel("Upload canceled by user");
    }
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-md">
      <div className="text-center mb-5">
        <UploadCloud className="mx-auto h-12 w-12 text-indigo-600" />
        <h1 className="mt-3 text-xl sm:text-2xl font-bold text-gray-800">
          Upload Your File
        </h1>
        <p className="mt-1 text-gray-500">
          Choose a document or image and upload securely
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-5">
        {/* File Upload Zone */}
        <div
          className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 bg-gray-50"
          }`}
          onClick={() => document.getElementById("fileInput").click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
        >
          {file ? (
            <div className="flex items-center gap-3">
              <p className="text-gray-700 font-medium truncate max-w-[220px]">
                {file.name}
              </p>
              <button
                type="button"
                className="text-gray-400 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                disabled={uploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-9 w-9 text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium">
                Drag & drop or click to select a file
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOCX, PPT, TXT, JPG, PNG up to 10MB
              </p>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Tags */}
        <input
          type="text"
          placeholder="Enter tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 sm:py-3 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          disabled={uploading}
        />

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading}
            className={`w-full rounded-xl px-4 py-2.5 sm:py-3 font-semibold text-white shadow-md transition ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:opacity-90 cursor-pointer"
            }`}
          >
            {uploading
              ? `Uploading... ${Math.round(progress)}%`
              : "Upload File"}
          </button>

          {uploading && (
            <button
              type="button"
              onClick={cancelUpload}
              className="rounded-xl bg-red-500 px-4 py-2.5 sm:py-3 font-semibold text-white shadow-md transition hover:opacity-90"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Message */}
        {msg && (
          <p className="text-center text-sm font-medium text-gray-600">{msg}</p>
        )}
      </form>
    </div>
  );
}
