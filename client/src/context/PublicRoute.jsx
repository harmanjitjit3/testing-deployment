import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function PublicRoute() {
  const { userProfile, loading, isAuthorized } = useSelector(
    (state) => state.auth
  );

  if (loading) return <LoadingScreen />;

  if (isAuthorized && userProfile && userProfile.status !== "rejected") {
    if (userProfile.status === "pending")
      return <Navigate to="/pending-approval" replace />;
    if (userProfile.status === "approved")
      return <Navigate to="/app/home" replace />;
    if (userProfile.status === "rejected")
      return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
