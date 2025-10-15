import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  Plus,
  Search,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  XCircle,
  Clock2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestsThunk } from "@/store/thunks/request.thunk";
import { useNavigate } from "react-router-dom";
import { addNewAdminThunk, findAdminThunk } from "@/store/thunks/admin.thunk";

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { requests, loading } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequestsThunk("all"));
  }, [dispatch]);

  const findAdmin = async (e) => {
    e.preventDefault();
    setFoundUser(null);
    setIsLoading(true);

    try {
      const response = await dispatch(
        findAdminThunk({ identifier: identifier.trim() })
      );

      if (response.payload?.data?.success || response.payload?.success) {
        setFoundUser(response.payload?.data?.user);
      } else {
        toast.error(
          response.payload?.data?.message ||
            response.payload?.message ||
            "Failed to add Admin!"
        );
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmin = async () => {
    setIsLoading2(true);
    try {
      const response = await dispatch(
        addNewAdminThunk({ identifier: identifier.trim() })
      );

      if (response.payload?.data?.success || response.payload?.success) {
        toast.success(
          response.payload?.data?.message ||
            response.payload?.message ||
            "Admin created successfully."
        );
        setFoundUser(response.payload?.data?.user);
      } else {
        toast.error(
          response.payload?.data?.message ||
            response.payload?.message ||
            "Failed to add Admin!"
        );
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading2(false);
    }
  };

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/app/home");
    }
  };

  const SkeletonCard = () => (
    <Card>
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-4 w-4 rounded" />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-5 py-4 pb-20">
      <div className="flex items-center gap-2">
        <div
          className="h-10 w-10 flex items-center justify-center cursor-pointer"
          onClick={goBack}
        >
          <ChevronLeft size={26} />
        </div>
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>

      {/* Show skeletons while loading */}
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : (
        <>
          <Card onClick={() => navigate("/admin/requests/approved")}>
            <CardContent className="text-lg flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                Approved Requests (
                {
                  requests.filter((request) => request.status === "approved")
                    .length
                }
                )
              </CardTitle>
              <ChevronRight />
            </CardContent>
          </Card>

          <Card onClick={() => navigate("/admin/requests/pending")}>
            <CardContent className="text-lg flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock2 className="h-6 w-6 text-yellow-500" /> Pending Requests
                (
                {
                  requests.filter((request) => request.status === "pending")
                    .length
                }
                )
              </CardTitle>
              <ChevronRight />
            </CardContent>
          </Card>

          <Card onClick={() => navigate("/admin/requests/rejected")}>
            <CardContent className="text-lg flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-500" /> Rejected Requests (
                {
                  requests.filter((request) => request.status === "rejected")
                    .length
                }
                )
              </CardTitle>
              <ChevronRight />
            </CardContent>
          </Card>
        </>
      )}

      {/* Existing Add Admin Section */}
      <Card className={"mb-6"}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">Add New Admin</h3>
        </CardHeader>

        <CardContent className="space-y-6">
          <form className="flex flex-row gap-3">
            <input
              type="text"
              placeholder="Search User by Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={findAdmin}
              disabled={isLoading}
              className="rounded-xl bg-primary px-4 md:px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <p className="hidden md:block">Search</p>
                  <Search color="#ffffff" className="md:hidden " />
                </>
              )}
            </button>
          </form>

          {foundUser && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">
                Account Information
              </h2>
              <div className="px-2 md:px-4 space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Full Name</span>
                  <span className="font-medium">{foundUser.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Role</span>
                  <span className="font-medium">
                    {foundUser.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Phone</span>
                  <span className="font-medium">{foundUser.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Email</span>
                  <span className="font-medium">{foundUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Locality</span>
                  <span className="font-medium">{foundUser.locality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Joined At</span>
                  <span className="font-medium">
                    {new Date(foundUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {foundUser.role === "admin" ? (
                <div className="flex items-center justify-center gap-2 font-semibold text-lg text-emerald-500">
                  <CheckCircle2 className="h-6 w-6 " />
                  <p>Admin</p>
                </div>
              ) : (
                <button
                  onClick={createAdmin}
                  disabled={isLoading2}
                  className="flex justify-self-end gap-2 rounded-xl bg-primary px-4 md:px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
                >
                  {isLoading2 ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Plus color="#ffffff" />
                      <p>Add Admin</p>
                    </>
                  )}
                </button>
              )}
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
