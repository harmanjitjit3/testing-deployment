import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { requestFileDownloadThunk } from "@/store/thunks/file.thunk.js";
import { updateUserRequests } from "@/store/slices/request.slice.js";

export const requestDownload = async (dispatch, id) => {
  try {
    const res = await dispatch(requestFileDownloadThunk(id));
    dispatch(updateUserRequests(res.payload?.data?.request));

    if (res.payload?.data?.success) {
      toast.success(
        res.payload?.message ||
          res.payload?.data?.message ||
          "Download request submitted successfully."
      );
    } else {
      toast.error(
        res.payload?.message ||
          res.payload?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  } catch (error) {
    console.error("Download dispatch failed:", error);
    toast.error(
      "A critical error occurred. Please check your connection or try again."
    );
  }
};
export const handleDownload = (downloadUrl, file) => {
  if (!downloadUrl) {
    toast.error("File URL not yet available. Please wait.");
    return;
  }
  if (!file) {
    toast.error("Something went wrong!");
    return;
  }
  const filename = file?.originalName || "downloaded_file";
  fetch(downloadUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      const mimeType =
        blob.type ||
        (filename.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "application/octet-stream");
      const finalBlob = new Blob([blob], { type: mimeType });
      const url = window.URL.createObjectURL(finalBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      link.style.cssText = "visibility:hidden; opacity:0; pointer-events:none;";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Downloading:  ${filename}`);
    })
    .catch((error) => {
      console.error("Download failed:", error);
      toast.error("Download failed due to a network or fetch error.");
    });
};
