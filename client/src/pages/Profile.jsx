import { clearUser } from "@/store/slices/user.slice";
import { logoutUserThunk } from "@/store/thunks/user.thunk";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userProfile, buttonLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    const data = await dispatch(logoutUserThunk());
    if (data?.payload?.success) {
      dispatch(clearUser());
      toast.success(data?.payload?.message || "Logout successful!");
      navigate("/");
    } else {
      toast.error(data?.payload?.message || "Logout failed.");
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No profile data found.</p>
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto md:px-4 py-6 pb-20">
        {/* Profile Header */}
        <section className="mb-8">
          <div
            className={`rounded-xl p-6 shadow-md flex items-center gap-4 ${
              userProfile.role === "admin"
                ? "bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50"
                : "bg-gray-50 "
            }`}
          >
            {/*  */}
            <div
              className={`h-16 w-16 rounded-full  flex items-center justify-center text-3xl font-bold text-gray-600 ${
                userProfile.role === "admin" ? "bg-[#ffffffba]" : "bg-gray-100"
              }`}
            >
              {userProfile.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userProfile.username}
              </h2>
              <p className="text-gray-600">{userProfile.email}</p>
              <p className="text-sm text-gray-500">
                Role: {userProfile.role === "admin" ? "Admin" : "User"}
              </p>
            </div>
          </div>
        </section>

        {/* Account Info */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Account Information
          </h2>
          <div className="rounded-xl bg-white p-4 shadow-md space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Full Name</span>
              <span className="font-medium">{userProfile.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Role</span>
              <span className="font-medium">
                {userProfile.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Phone</span>
              <span className="font-medium">{userProfile.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Email</span>
              <span className="font-medium">{userProfile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Locality</span>
              <span className="font-medium">{userProfile.locality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Joined At</span>
              <span className="font-medium">
                {new Date(userProfile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Settings</h2>
          <div className="rounded-xl bg-white p-4 shadow-md space-y-3">
            <button
              onClick={() => setShowLogoutModal(true)}
              disabled={buttonLoading}
              className="w-full text-left rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 font-medium text-red-600"
            >
              Logout
            </button>
          </div>
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#000000a1] bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to log out from your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={buttonLoading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                {buttonLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
