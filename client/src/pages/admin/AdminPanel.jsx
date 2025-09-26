import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight, Plus, Search, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestsThunk } from "@/store/thunks/request.thunk";
import { useNavigate } from "react-router-dom";
import { addNewAdminThunk, findAdminThunk } from "@/store/thunks/admin.thunk";

export default function AdminPanel() {
  const [msg, setMsg] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { requests, loading, buttonLoading } = useSelector(
    (state) => state.requests
  );

  useEffect(() => {
    dispatch(fetchRequestsThunk());
  }, [dispatch]);

  const findAdmin = async (e) => {
    e.preventDefault();

    if (!newAdminEmail) return toast.error("Please Enter Email!");

    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!reg.test(String(newAdminEmail).toLowerCase())) {
      toast.error("Invalid Email!");
      return;
    }

    const response = await dispatch(findAdminThunk({ email: newAdminEmail }));

    if (response.payload?.data?.success || response.payload?.success) {
      setFoundUser(response.payload?.data?.user);
    } else {
      toast.error(
        response.payload?.data?.message ||
          response.payload?.message ||
          "Failed to add Admin!"
      );
    }
  };

  const createAdmin = async (e) => {
    const response = await dispatch(addNewAdminThunk({ email: newAdminEmail }));

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
  };

  return (
    <div className="space-y-6 py-4 pb-20">
      <h2 className="text-xl font-bold">Admin Panel</h2>

      {/* Pending Requests Card */}
      <Card
        onClick={() => {
          navigate("/admin/requests");
        }}
      >
        <CardContent className="text-lg flex items-center justify-between">
          <CardTitle className="text-lg">
            Pending Requests ({requests.length})
          </CardTitle>
          <ChevronRight />
        </CardContent>
      </Card>

      {/* Add New Admin Card */}
      <Card className={"mb-6"}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">Add New Admin</h3>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search Form */}
          <form className="flex flex-row gap-3">
            <input
              type="email"
              placeholder="Search User by Email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              required
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={findAdmin}
              className="rounded-xl bg-primary px-4 md:px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
            >
              <p className="hidden md:block">Search</p>
              <Search color="#ffffff" className="md:hidden " />
            </button>
          </form>

          {/* Show only when user found */}
          {foundUser && (
            <>
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
                    <p className="">Admin</p>
                  </div>
                ) : (
                  <button
                    onClick={createAdmin}
                    className="flex justify-self-end gap-2 rounded-xl bg-primary px-4 md:px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
                  >
                    <Plus color="#ffffff" />
                    <p>Add Admin</p>
                  </button>
                )}
              </section>
            </>
          )}
        </CardContent>
      </Card>

      {msg && <p className="text-sm text-center text-red-500">{msg}</p>}
    </div>
  );
}
