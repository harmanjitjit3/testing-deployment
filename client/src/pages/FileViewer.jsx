import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDownloadUrlThunk,
  getFileByIdThunk,
} from "@/store/thunks/file.thunk.js";
import { fetchUserRequestsThunk } from "@/store/thunks/request.thunk";
import { requestDownload, handleDownload } from "@/services/file.services.js";
import {
  Loader2,
  X,
  Download,
  Clock2,
  CheckCircle2,
  XCircle,
  RotateCw,
} from "lucide-react";

const getFileExtension = (filename) => {
  return filename.split(".").pop().toLowerCase();
};

const FileContent = ({ file, viewUrl }) => {
  const extension = getFileExtension(file.originalName);
  const [iframeLoading, setIframeLoading] = useState(true);

  if (!viewUrl) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Loading file preview...</p>
      </div>
    );
  }

  if (["png", "jpg", "jpeg", "gif", "webp"].includes(extension)) {
    return (
      <div className="flex justify-center items-center h-full">
        <img
          src={viewUrl}
          alt={file.originalName}
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    );
  }

  if (["txt"].includes(extension)) {
    return (
      <iframe
        src={viewUrl}
        title={file.originalName}
        className="w-full h-full bg-gray-50 p-4 font-mono text-sm overflow-auto"
        frameBorder="0"
      >
        <p>Your browser does not support iframes, please download the file.</p>
      </iframe>
    );
  }

  if (extension === "pdf") {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
      viewUrl
    )}&embedded=true`;

    return (
      <div className="relative w-full h-full flex justify-center items-center">
        {iframeLoading && (
          <div className="absolute inset-0 z-10 bg-white/70 flex flex-col justify-center items-center">
            <Loader2 size={36} className="animate-spin text-blue-500" />
            <span className="mt-2 text-gray-600">Loading preview...</span>
          </div>
        )}

        <iframe
          src={viewerUrl}
          title={file.originalName}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen={true}
          onLoad={() => setIframeLoading(false)}
          style={{ visibility: iframeLoading ? "hidden" : "visible" }}
        >
          <p>PDF preview not supported, please download.</p>
        </iframe>
      </div>
    );
  }

  const [textContent, setTextContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    if (viewUrl && extension === "csv" && !textContent) {
      setContentLoading(true);
      fetch(viewUrl)
        .then((res) => res.text())
        .then((rawText) => {
          setTextContent(rawText);
        })
        .catch((error) => {
          console.error("Failed to fetch text content:", error);
        })
        .finally(() => {
          setContentLoading(false);
        });
    }
    return () => {
      setTextContent(null);
    };
  }, [viewUrl, extension]);

  if (extension === "csv") {
    if (contentLoading || !textContent) {
      return (
        <div className="p-8 text-center text-gray-500">Loading CSV data...</div>
      );
    }

    const parseCSV = (text) => {
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      return lines.map((line) => line.split(","));
    };
    const data = parseCSV(textContent);

    return (
      <div className="p-4 overflow-auto max-h-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {data[0] && (
              <tr>
                {data[0].map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (["doc", "docx", "ppt", "pptx"].includes(extension)) {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
      viewUrl
    )}&embedded=true`;

    return (
      <div className="relative w-full h-full flex justify-center items-center">
        {iframeLoading && (
          <div className="absolute inset-0 z-10 bg-white/70 flex flex-col justify-center items-center">
            <Loader2 size={36} className="animate-spin text-blue-500" />
            <span className="mt-2 text-gray-600">Preparing preview...</span>
          </div>
        )}

        <iframe
          src={viewerUrl}
          title={file.originalName}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen={true}
          style={{ visibility: iframeLoading ? "hidden" : "visible" }}
          onLoad={() => setIframeLoading(false)}
        >
          <p>Content preview is not available. Please download the file.</p>
        </iframe>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <p className="text-xl font-semibold">Preview Not Available</p>
      <p className="text-gray-500">
        This file type ({extension.toUpperCase()}) cannot be displayed in the
        viewer.
      </p>
    </div>
  );
};

const FileViewer = ({ status, mode }) => {
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { openedFile: file } = useSelector((state) => state.files);
  const { userRequests } = useSelector((state) => state.requests);

  const onClose = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/app/home");
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchUserRequestsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!file && id) {
      const fetchFile = async () => {
        const res = await dispatch(getFileByIdThunk(id));
        if (!res.payload?.data?.success) {
          toast.error(
            res.payload?.data?.message ||
              res.payload?.message ||
              "Failed to fetch file details."
          );
          onClose();
        }
      };
      fetchFile();
      return;
    }

    const fetchDownloadUrl = async () => {
      setLoading(true);
      try {
        const data = await dispatch(fetchDownloadUrlThunk(file.fileKey));
        if (data.payload) {
          setDownloadUrl(data.payload);
        } else {
          toast.error("Failed to retrieve file download link.");
          onClose();
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Failed to fetch file:", error);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchDownloadUrl();
  }, [file, dispatch, navigate, onClose]);

  if (!file) {
    return (
      <div className="flex-1 flex justify-center items-center h-screen w-screen">
        <Loader2 size={36} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
      <div
        className="bg-white w-screen h-screen flex flex-col truncate"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center gap-3">
          <div>
            {file.meta?.status === "pending" && (
              <Clock2 size={24} className="text-yellow-500" />
            )}
            {file.meta?.status === "approved" && (
              <CheckCircle2 size={24} className="text-emerald-500" />
            )}
            {file.meta?.status === "rejected" && (
              <XCircle size={24} className="text-red-500" />
            )}
          </div>
          <h2 className="text-lg font-bold truncate">{file.originalName}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 size={36} className="animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <FileContent file={file} viewUrl={downloadUrl} />
          </div>
        )}

        {file.status === "approved" && (
          <div className="p-4 flex justify-end">
            {/* {userRequests.some(
              (req) =>
                req.file._id === file._id &&
                req.type === "download" &&
                req.status === "pending"
            ) ? (
              <Button
                disabled
                className="w-full py-6 rounded-lg font-semibold transition-transform shadow-lg cursor-pointer text-white disabled:opacity-50"
              >
                <Clock2 />
                Request Pending...
              </Button>
            ) : userRequests.some(
                (req) =>
                  req.file._id === file._id &&
                  req.type === "download" &&
                  req.status === "approved"
              ) ? (
              <>
                <Button
                  onClick={handleDownload.bind(this, downloadUrl, file)}
                  disabled={!downloadUrl || loading}
                  className="w-full py-6 rounded-lg font-semibold transition-transform shadow-lg cursor-pointer text-white disabled:opacity-50"
                >
                  <Download />
                  Download File
                </Button>
              </>
            ) : (
              <Button
                onClick={requestDownload.bind(this, dispatch, file._id)}
                disabled={!downloadUrl || loading}
                className="w-full py-6 rounded-lg font-semibold transition-transform shadow-lg cursor-pointer text-white disabled:opacity-50"
              >
                Request Download
              </Button>
            )} */}

            {file.meta?.status === "approved" ? (
              <Button
                className="w-full py-6 rounded-lg font-semibold transition-transform shadow-lg cursor-pointer text-white disabled:opacity-50"
                onClick={handleDownload.bind(this, downloadUrl, file)}
                disabled={!downloadUrl || loading}
              >
                <Download />
                Download File
              </Button>
            ) : file.meta?.status === "pending" ? (
              <Button
                disabled
                className="w-full py-6 rounded-lg font-semibold transition-transform shadow-lg cursor-pointer text-white disabled:opacity-50"
              >
                <Clock2 />
                Request Pending...
              </Button>
            ) : file.meta?.status === "rejected" ? (
              <Button
                onClick={requestDownload.bind(this, dispatch, file._id)}
                disabled={!downloadUrl || loading}
                className="w-full py-6 rounded-lg font-semibold transition-transform shadow-lg cursor-pointer text-white disabled:opacity-50"
              >
                <RotateCw />
                Request Download
              </Button>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
