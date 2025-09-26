import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function AdminRoutes() {
  const { userProfile, loading, isAuthorized } = useSelector(
    (state) => state.auth
  );

  if (loading) return <LoadingScreen />;

  if (!isAuthorized || !userProfile) {
    return <Navigate to="/" replace />;
  }

  if (userProfile.role !== "admin") {
    return <Navigate to="/app/home" replace />;
  }

  return <Outlet />;
}
