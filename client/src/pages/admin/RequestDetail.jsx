import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Clock2,
  CheckCircle2,
  XCircle,
  LoaderCircle,
} from "lucide-react";
import {
  fetchRequestByIdThunk,
  approveRequestThunk,
  rejectRequestThunk,
} from "@/store/thunks/request.thunk";
import toast from "react-hot-toast";

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rejectMessage, setRejectMessage] = useState("");
  const [showMessageModel, setShowMessageModel] = useState(false);

  const { requestDetail, loading, buttonLoading } = useSelector(
    (state) => state.requests
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchRequestByIdThunk(id));
    }
  }, [id, dispatch]);

  const handleApprove = async () => {
    const response = await dispatch(
      approveRequestThunk({
        requestId: requestDetail._id,
        type: requestDetail.type,
      })
    );
    if (response?.payload?.data?.success) {
      toast.success(response?.payload?.data?.message || "Request Approved!");
    } else {
      toast.error(response?.payload?.data?.message || "Something went wrong!");
    }
  };

  const handleReject = async () => {
    const response = await dispatch(
      rejectRequestThunk({
        requestId: requestDetail._id,
        type: requestDetail.type,
        message: rejectMessage || "Not specified",
      })
    );
    if (response?.payload?.data?.success) {
      toast.success(response?.payload?.data?.message || "Request Rejected!");
    } else {
      toast.error(response?.payload?.data?.message || "Something went wrong!");
    }
    setShowMessageModel(false);
  };

  const getRequestTitle = () => {
    switch (requestDetail?.type) {
      case "upload":
        return "Upload Request";
      case "download":
        return "Download Request";
      default:
        return "Account Request";
    }
  };

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/admin/requests");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b flex items-center gap-2 px-3 py-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </header>

        {/* Content Skeleton */}
        <main className="flex-1 overflow-y-auto px-2 md:px-4 py-4 pb-30 space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-white px-6 py-4 shadow-md space-y-4"
            >
              <Skeleton className="h-6 w-40" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </main>

        {/* Footer Skeleton */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="p-4 flex gap-3 max-w-2xl mx-auto">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </footer>
      </div>
    );
  }

  if (!requestDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No request details found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b flex items-center gap-2 px-3 py-3">
        <button
          onClick={goBack}
          className="flex items-center gap-1 p-2 text-sm font-medium transition cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">{getRequestTitle()}</h1>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-2 md:px-4 py-4 pb-30">
        <div className="space-y-3">
          {/* User Details */}
          {requestDetail.user && (
            <section>
              <div className="rounded-xl bg-white px-6 py-4 shadow-md">
                <h2 className="mb-3 text-lg font-semibold text-gray-800">
                  Requesting User
                </h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name</span>
                    <span className="font-medium">
                      {requestDetail.user.username}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">
                      {requestDetail.user.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">
                      {requestDetail.user.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Locality</span>
                    <span className="font-medium">
                      {requestDetail.user.locality}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium">
                      {requestDetail.status === "approved" && (
                        <div className="flex items-center gap-2 text-emerald-500">
                          <CheckCircle2 className="h-5 w-5" /> Approved
                        </div>
                      )}
                      {requestDetail.status === "rejected" && (
                        <div className="flex items-center gap-2 text-red-500">
                          <XCircle className="h-5 w-5" /> Rejected
                        </div>
                      )}
                      {requestDetail.status === "pending" && (
                        <div className="flex items-center gap-2 text-yellow-500">
                          <Clock2 className="h-5 w-5" /> Pending
                        </div>
                      )}
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-5">
                  Requested on{" "}
                  {new Date(requestDetail.createdAt).toLocaleString([], {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </section>
          )}

          {/* File Details */}
          {requestDetail.file && (
            <section>
              <div className="rounded-xl bg-white px-6 py-4 shadow-md">
                <h2 className="mb-3 text-lg font-semibold text-gray-800">
                  File Details
                </h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Name</span>
                    <span className="font-medium">
                      {requestDetail.file.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size</span>
                    <span className="font-medium">
                      {requestDetail.file.size}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => window.open(requestDetail.file.url, "_blank")}
                >
                  Open File
                </Button>
              </div>
            </section>
          )}

          {/* admin details */}
          {requestDetail.admin && (
            <section>
              <div className="rounded-xl bg-white px-6 py-4 shadow-md">
                <h2 className="mb-3 text-lg font-semibold text-gray-800">
                  {requestDetail.status === "approved"
                    ? "Approved by"
                    : "Rejected by"}
                </h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin</span>
                    <span className="font-medium">
                      {requestDetail.admin.username}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">
                      {requestDetail.admin.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">
                      {requestDetail.admin.phone}
                    </span>
                  </div>
                  {requestDetail.message && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason</span>
                      <span className="font-medium">
                        {requestDetail.message}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-5">
                  {requestDetail.status === "approved"
                    ? "Approved on "
                    : "Rejected on "}
                  {new Date(requestDetail.updatedAt).toLocaleString([], {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      {requestDetail.status === "pending" && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="p-4 flex gap-3 max-w-2xl mx-auto">
            <Button
              variant="destructive"
              onClick={() => setShowMessageModel(true)}
              className="flex-1 py-6 rounded-lg font-semibold shadow-md cursor-pointer"
            >
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={buttonLoading}
              className="flex-1 py-6 rounded-lg font-semibold shadow-md bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            >
              {buttonLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Approve"
              )}
            </Button>
          </div>
        </footer>
      )}

      {showMessageModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#000000a1] bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Reject Request
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this request. (Optional)
            </p>

            {/* Textarea for rejection reason */}
            <textarea
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              placeholder="Type your reason here..."
              rows={4}
              className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowMessageModel(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleReject();

                  setRejectMessage("");
                }}
                disabled={buttonLoading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buttonLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
