import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationsThunk } from "@/store/thunks/notification.thunk";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ArrowLeft,
  FileDown,
  Upload,
  UserPlus,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Notifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications, loadingInitial, loadingMore, page, hasMore } =
    useSelector((state) => state.notifications);

  const observer = useRef();

  // fetch first page
  useEffect(() => {
    dispatch(fetchNotificationsThunk({ page: 1 }));
  }, [dispatch]);

  // infinite scroll observer
  const lastNotiRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchNotificationsThunk({ page: page + 1 }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, page, dispatch]
  );

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/app/home");
    }
  };

  const openRequestDetail = (id, roleFor) => {
    roleFor === "admin" && navigate(`/admin/request-detail/${id}`);
  };

  return (
    <div>
      {/* Header */}
      <header className="z-10 fixed top-0 left-0 w-full">
        <div className="flex items-center gap-3 sm:px-4 p-2 bg-primary border-b shadow w-full max-w-3xl mx-auto">
          <div
            onClick={goBack}
            className="flex items-center gap-1 p-3 text-sm font-medium text-white cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
        </div>
      </header>

      {/* Notifications List */}
      <main className="py-14">
        {loadingInitial && page === 1 ? (
          // Skeleton loader while first loading
          <div className="space-y-3 p-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            ))}
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-3 p-4 w-full">
            {notifications.map((noti, idx) => {
              // last element → attach observer
              if (idx === notifications.length - 1) {
                return (
                  <div
                    ref={lastNotiRef}
                    key={noti._id}
                    onClick={() =>
                      openRequestDetail(noti.request?._id, noti.roleFor)
                    }
                    className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border hover:shadow-md transition cursor-pointer"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <RequestIcon type={noti.type} status={noti.status} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {noti.type === "account" && "New user request."}
                        {noti.type === "upload" && "Uploaded Request."}
                        {noti.type === "download" && "Download request."}
                      </h3>
                      <p className="text-sm text-gray-600">{noti.message}</p>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(noti.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <StatusBadge status={noti.request?.status} />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={noti._id}
                    onClick={() =>
                      openRequestDetail(noti.request?._id, noti.roleFor)
                    }
                    className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border hover:shadow-md transition cursor-pointer"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <RequestIcon type={noti.type} status={noti.status} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {noti.type === "account" && "New user request."}
                        {noti.type === "upload" && "Uploaded Request."}
                        {noti.type === "download" && "Download request."}
                      </h3>
                      <p className="text-sm text-gray-600">{noti.message}</p>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(noti.createdAt).toLocaleString([], {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <StatusBadge status={noti.request?.status} />
                    </div>
                  </div>
                );
              }
            })}

            {/* Loader for next pages */}
            {loadingMore && page > 1 && (
              <p className="text-center py-4 text-gray-500">Loading more...</p>
            )}

            {!hasMore && (
              <p className="text-center py-4 text-gray-400 text-sm">
                No more notifications
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[60vh] text-gray-500 text-center px-4">
            No notifications found.
          </div>
        )}
      </main>
    </div>
  );
}

const RequestIcon = ({ type, status }) => {
  if (status === "rejected")
    return <XCircle className="h-6 w-6 text-red-500" />;
  switch (type) {
    case "account":
      return <UserPlus className="h-6 w-6 text-blue-500" />;
    case "upload":
      return <Upload className="h-6 w-6 text-purple-500" />;
    case "download":
      return <FileDown className="h-6 w-6 text-green-500" />;
    case "system":
      return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
    default:
      return <XCircle className="h-6 w-6 text-gray-400" />;
  }
};

function StatusBadge({ status }) {
  if (!status) return null;

  const statusConfig = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    approved: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <Badge
      className={`capitalize px-3 py-1 rounded-full border text-xs font-medium ${statusConfig[status]}`}
    >
      {status}
    </Badge>
  );
}
