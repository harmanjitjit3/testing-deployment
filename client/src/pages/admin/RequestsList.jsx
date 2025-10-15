import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserPlus, Download, Upload, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestsThunk } from "@/store/thunks/request.thunk";
import { Skeleton } from "@/components/ui/skeleton";

export default function RequestsList() {
  const { status } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { requests, loading, error } = useSelector((state) => state.requests);

  useEffect(() => {
    if (requests.length === 0) {
      dispatch(fetchRequestsThunk(status));
    }
  }, [dispatch]);

  const openRequestDetail = (id) => {
    navigate(`/admin/request-detail/${id}`);
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
        <h2 className="text-xl font-bold">
          {status[0].toUpperCase() + status.slice(1)} Requests
        </h2>
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

      {!loading && requests?.length > 0 && (
        <ul className="space-y-3  pb-20">
          {requests.map(
            (req) =>
              req.status === status && (
                <li
                  key={req._id}
                  className="flex items-center gap-3 bg-white rounded-xl shadow px-4 py-3 border hover:shadow-md transition cursor-pointer truncate"
                  onClick={() => openRequestDetail(req._id)}
                >
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 aspect-square">
                    <RenderIcon type={req.type} status={req.status} />
                  </div>

                  <div className="flex-1 truncate">
                    <p className="font-semibold truncate">
                      {req.type === "account"
                        ? `${req.user.username} requested to account approval.`
                        : `${req.user.username} requested to ${req.type} file.`}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {req.user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {req.user.phone} • {req.type.toUpperCase()}
                    </p>
                  </div>

                  <div className="text-xs text-gray-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </li>
              )
          )}
        </ul>
      )}

      {/* Empty state */}
      {(!loading && requests?.length === 0) ||
        (requests.filter((req) => req.status === status).length === 0 && (
          <p className="text-gray-500 text-center mt-20 ">No requests found.</p>
        ))}
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
  }
};
