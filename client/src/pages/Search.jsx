import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { resetSearch, setOpenedFile } from "@/store/slices/file.slice.js";
import { fetchUserRequestsThunk } from "@/store/thunks/request.thunk";
import { requestDownload, handleDownload } from "@/services/file.services.js";
import {
  searchFilesThunk,
  getAllFilesThunk,
  fetchDownloadUrlThunk,
} from "@/store/thunks/file.thunk.js";
import {
  Clock2,
  Loader2,
  Download,
  XCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const FileSkeleton = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 w-1/3 bg-gray-200 rounded mb-1"></div>
    <div className="h-3 w-1/2 bg-gray-200 rounded mb-1"></div>
    <div className="h-3 w-1/4 bg-gray-200 rounded mb-3"></div>
    <div className="h-8 w-full bg-gray-300 rounded"></div>
  </div>
);

function SearchPage() {
  const [query, setQuery] = useState("");
  const [loadingFileId, setLoadingFileId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    files,
    filesLoading,
    filesPage,
    filesHasMore,
    searchFiles,
    searchLoading,
    searchPage,
    searchHasMore,
    loadingMore,
    // buttonLoading,
  } = useSelector((state) => state.files);
  const { userRequests } = useSelector((state) => state.requests);

  const isSearchMode = query.trim().length > 0;

  useEffect(() => {
    if (files.length === 0) {
      dispatch(getAllFilesThunk({ page: 1 }));
    }

    dispatch(fetchUserRequestsThunk());
  }, [dispatch]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (isSearchMode) {
        dispatch(searchFilesThunk({ query, page: 1 }));
      } else {
        dispatch(resetSearch());
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, isSearchMode, dispatch]);

  const listSentinelRef = useRef(null);
  const searchSentinelRef = useRef(null);

  useEffect(() => {
    if (!listSentinelRef.current) return;
    const el = listSentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !isSearchMode &&
          !filesLoading &&
          filesHasMore
        ) {
          dispatch(getAllFilesThunk({ page: filesPage + 1 }));
        }
      },
      { rootMargin: "200px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [dispatch, isSearchMode, filesLoading, filesHasMore, filesPage]);

  // observer for search results
  useEffect(() => {
    if (!searchSentinelRef.current) return;
    const el = searchSentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          isSearchMode &&
          !searchLoading &&
          searchHasMore
        ) {
          dispatch(searchFilesThunk({ query, page: searchPage + 1 }));
        }
      },
      { rootMargin: "200px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [dispatch, isSearchMode, query, searchLoading, searchHasMore, searchPage]);

  const list = isSearchMode ? searchFiles : files;

  const isInitialLoading = isSearchMode
    ? searchLoading && searchPage === 1
    : filesLoading && filesPage === 1;

  const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleFileOpen = (f) => {
    dispatch(setOpenedFile(f));
    navigate("/app/file-detail/" + f._id);
  };

  const fetchDownloadUrl = async (file) => {
    try {
      const data = await dispatch(fetchDownloadUrlThunk(file.fileKey));
      if (data.payload) {
        return data.payload;
      } else {
        toast.error("Failed to retrieve file download link.");
        return null;
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Failed to fetch file:", error);
      return null;
    }
  };

  const downloadFile = async (file) => {
    setLoadingFileId(file._id);
    try {
      const url = await fetchDownloadUrl(file);
      if (url) {
        handleDownload(url, file);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      return null;
    } finally {
      setLoadingFileId(null);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto py-4 sm:px-6 pb-20">
      <section className="mb-4 sticky top-0 bg-white pb-2">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Search Files
        </h2>
        <div className="flex flex-row gap-2">
          <div className="flex items-center rounded-xl overflow-hidden border border-gray-300 text-gray-700 w-full">
            <input
              type="text"
              placeholder="Search by name, type or tag"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-3 w-full focus:border-primary focus:outline-none"
            />
            {query && (
              <XCircle
                className="h-6 w-6 text-gray-400 m-3 cursor-pointer"
                onClick={() => setQuery("")}
              />
            )}
          </div>
        </div>
      </section>

      <div className="mb-4 px-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {isSearchMode ? "Search Results" : "Recent Files"}
        </h2>

        <RefreshCw
          size={24}
          onClick={() => {
            dispatch(getAllFilesThunk({ page: 1 }));
            dispatch(fetchUserRequestsThunk());
          }}
          className={`cursor-pointer ${
            (filesLoading || searchLoading) && "animate-spin"
          }`}
        />
      </div>

      {isInitialLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <FileSkeleton key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No files available.</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((f) => (
              <div
                key={f._id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition truncate"
              >
                <div className="mb-2">
                  <p className="font-semibold text-gray-900 truncate">
                    {f.originalName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Size: <b>{formatFileSize(f.fileSize)}</b>
                  </p>
                  <p className="text-sm text-gray-500">
                    Uploaded by <b>{f.uploadedBy?.username || "user"}</b>
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  <b>Tags:</b> {f.tags?.join(", ") || "—"}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleFileOpen.bind(this, f)}
                    className="flex-1 py-4 rounded-lg font-semibold shadow-md text-white cursor-pointer"
                  >
                    <ExternalLink />
                    Open File
                  </Button>

                  {userRequests.some(
                    (req) =>
                      req.file._id === f._id &&
                      req.type === "download" &&
                      req.status === "pending"
                  ) ? (
                    <Button
                      disabled
                      className="flex-1 py-4 rounded-lg font-semibold shadow-md text-white cursor-pointer"
                    >
                      <Clock2 />
                      Request Pending...
                    </Button>
                  ) : userRequests.some(
                      (req) =>
                        req.file._id === f._id &&
                        req.type === "download" &&
                        req.status === "approved"
                    ) ? (
                    <>
                      <Button
                        onClick={downloadFile.bind(this, f)}
                        disabled={loadingFileId === f._id}
                        className="flex-1 py-4 rounded-lg font-semibold shadow-md text-white cursor-pointer"
                      >
                        {loadingFileId === f._id ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          <>
                            <Download />
                            Download File
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        setLoadingFileId(f._id);
                        requestDownload(dispatch, f._id).finally(() => {
                          setLoadingFileId(null);
                        });
                      }}
                      disabled={loadingFileId === f._id}
                      className="flex-1 py-4 rounded-lg font-semibold shadow-md text-white cursor-pointer"
                    >
                      {loadingFileId === f._id ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <>
                          <Download />
                          Request Download
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center">
            {loadingMore && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Loading more…</span>
              </div>
            )}
            <div
              ref={isSearchMode ? searchSentinelRef : listSentinelRef}
              className="h-6 w-full"
            />
          </div>
        </>
      )}
    </main>
  );
}
export default SearchPage;
