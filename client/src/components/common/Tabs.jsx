import { Home, Search, UserCog, User } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export const Tabs = () => {
  const userRole = useSelector((state) => state.auth.userProfile.role);
  return (
    <div className="fixed bottom-0 left-0 w-full bg-primary  flex justify-around items-center shadow-lg rounded-t-xl md:hidden">
      <NavLink
        to="/app/home"
        className={({ isActive }) =>
          `flex flex-col items-center w-25 h-full py-3 border-b-2 border-transparent transition-all ${
            isActive ? "text-white border-b-2 border-white " : "text-gray-400"
          }`
        }
      >
        <Home size={26} />
        <span className="text-xs mt-1">Home</span>
      </NavLink>

      <NavLink
        to="/app/search"
        className={({ isActive }) =>
          `flex flex-col items-center w-25 h-full py-3 border-b-2 border-transparent transition-all ${
            isActive ? "text-white border-b-2 border-white " : "text-gray-400"
          }`
        }
      >
        <Search size={26} />
        <span className="text-xs mt-1">Search</span>
      </NavLink>

      {userRole === "admin" && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex flex-col items-center w-25 h-full py-3 border-b-2 border-transparent transition-all ${
              isActive ? "text-white border-b-2 border-white " : "text-gray-400"
            }`
          }
        >
          <UserCog size={26} />
          <span className="text-xs mt-1">Admin</span>
        </NavLink>
      )}
      
      <NavLink
        to="/app/profile"
        className={({ isActive }) =>
          `flex flex-col items-center w-25 h-full py-3 border-b-2 border-transparent transition-all ${
            isActive ? "text-white border-b-2 border-white " : "text-gray-400"
          }`
        }
      >
        <User size={26} />
        <span className="text-xs mt-1">Profile</span>
      </NavLink>
    </div>
  );
};
