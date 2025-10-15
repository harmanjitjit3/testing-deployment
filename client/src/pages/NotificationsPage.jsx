import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationsThunk } from "@/store/thunks/notification.thunk";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { setOpenedFile } from "@/store/slices/file.slice.js";

import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock2,
  UserRoundPlus,
  UserRoundCheck,
  UserRoundX,
  CloudCheck,
  CloudUpload,
  CloudOff,
} from "lucide-react";

export default function Notifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications, loadingInitial, loadingMore, page, hasMore } =
    useSelector((state) => state.notifications);

  const { userProfile } = useSelector((state) => state.auth);

  const observer = useRef();

  useEffect(() => {
    dispatch(fetchNotificationsThunk({ page: 1 }));
  }, [dispatch]);

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

  const openRequestDetail = (id, roleFor, file) => {
    if (roleFor === "admin") navigate(`/admin/request-detail/${id}`);
    else if (file) {
      dispatch(setOpenedFile(file));
      navigate("/app/file-detail/" + file._id);
    }
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
              if (
                noti.request.user === userProfile?._id &&
                noti.roleFor === "admin"
              )
                return null;
              const refProp =
                idx === notifications.length - 1 ? { ref: lastNotiRef } : {};
              return (
                <div
                  {...refProp}
                  key={noti._id}
                  onClick={() =>
                    openRequestDetail(
                      noti.request?._id,
                      noti.roleFor,
                      noti.request?.file
                    )
                  }
                  className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <RequestIcon
                      type={noti.type}
                      status={noti.request?.status}
                    />
                  </div>
                  <div className="flex flex-col flex-1 truncate">
                    {noti.roleFor === "admin" ? (
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {noti.type === "account" && "New user request."}
                        {noti.type === "upload" && "Upload Request."}
                        {noti.type === "download" && "Download request."}
                      </h3>
                    ) : (
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {noti.type === "account"
                          ? (noti.request?.status === "approved" &&
                              "Account approved") ||
                            (noti.request?.status === "rejected" &&
                              "Account rejected")
                          : noti.request?.file?.originalName}
                      </h3>
                    )}
                    <p className="text-sm text-gray-600 truncate">{noti.message}</p>
                    <span className="text-xs text-gray-400 mt-1 truncate">
                      {new Date(noti.createdAt).toLocaleString([], {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div>
                    <StatusBadge status={noti.request?.status} />
                  </div>
                </div>
              );
            })}
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
  switch (true) {
    //account
    case type === "account" && status === "approved":
      return <UserRoundCheck className="h-6 w-6 text-emerald-500" />;
    case type === "account" && status === "rejected":
      return <UserRoundX className="h-6 w-6 text-red-500" />;
    case type === "account" && status === "pending":
      return <UserRoundPlus className="h-6 w-6 text-yellow-500" />;

    //upload
    case type === "upload" && status === "pending":
      return <CloudUpload className="h-6 w-6 text-yellow-500" />;
    case type === "upload" && status === "approved":
      return <CloudCheck className="h-6 w-6 text-emerald-500" />;
    case type === "upload" && status === "rejected":
      return <CloudOff className="h-6 w-6 text-red-500" />;

    //download

    //defaults
    case status === "pending":
        return <Clock2 className="h-6 w-6 text-yellow-500" />;
      case status === "approved":
        return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
      case status === "rejected":
        return <XCircle className="h-6 w-6 text-red-500" />;
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
