import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRequestsThunk } from "@/store/thunks/request.thunk";
import { Skeleton } from "@/components/ui/skeleton";
import { setOpenedFile } from "@/store/slices/file.slice.js";
import {
  CheckCircle2,
  XCircle,
  Clock2,
  UserPlus,
  Download,
  Upload,
  ChevronLeft,
} from "lucide-react";

export default function UserRequests() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userRequests, loading, error } = useSelector(
    (state) => state.requests
  );

  useEffect(() => {
    dispatch(fetchUserRequestsThunk());
  }, [dispatch]);

  const handleFileOpen = (f, s) => {
    let fileData = {...f};
    fileData.meta = { status: s };
    dispatch(setOpenedFile(fileData));
    navigate("/app/file-detail/" + f._id);
  };

  return (
    <div className="space-y-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="h-10 w-10 flex items-center justify-center cursor-pointer"
          onClick={() => {
            navigate("/admin");
          }}
        >
          <ChevronLeft size={26} />
        </div>
        <h2 className="text-xl font-bold">My Requests</h2>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <ul className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <li key={i}>
              <div className="flex items-center gap-3 bg-white rounded-xl shadow px-3 py-4 border">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="text-red-500 font-medium">Failed to load requests.</p>
      )}

      {!loading && userRequests?.length > 0 && (
        <div className="space-y-3  pb-20">
          {userRequests.map((req, idx) => {
            return (
              <div
                key={idx}
                onClick={handleFileOpen.bind(this, req.file, req.status)}
                className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full">
                  <RenderIcon type={req.type} status={req.status} />
                </div>
                <div className="flex flex-col flex-1 truncate">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {req.file?.originalName}
                    {req.type === "account" && "Account Request."}
                  </h3>

                  <p className="text-sm text-gray-600 truncate">
                    {req.status === "pending"
                      ? `Your ${req.type} request is pending.`
                      : `Your ${req.type} request has been ${req.status}.`}
                  </p>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(req.createdAt).toLocaleString([], {
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
                  <StatusBadge status={req.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && userRequests?.length === 0 && (
        <p className="text-gray-500 text-center mt-40 ">
          No requests found.
        </p>
      )}
    </div>
  );
}

const RenderIcon = ({ type, status }) => {
  const color =
    status === "approved"
      ? "text-green-500"
      : status === "rejected"
      ? "text-red-500"
      : "text-yellow-500";
  switch (type) {
    case "account":
      return <UserPlus className={color} size={24} />;
    case "download":
      return <Download className={color} size={24} />;
    case "upload":
      return <Upload className={color} size={24} />;
    default:
      return <UserPlus className="text-gray-500" size={24} />;
  }
};

const StatusBadge = ({ status }) => {
  switch (status) {
    case "pending":
      return <Clock2 className="text-yellow-500" size={24} />;
    case "approved":
      return <CheckCircle2 className="text-green-500" size={24} />;
    case "rejected":
      return <XCircle className="text-red-500" size={24} />;
    default:
      return <UserPlus className="text-gray-500" size={24} />;
  }
};
