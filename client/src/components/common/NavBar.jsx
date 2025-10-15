import { Home, Search, UserCog, User, ClipboardClock } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function NavBar() {
  const userRole = useSelector((state) => state.auth.userProfile.role);
  return (
    <nav className="hidden sm:flex items-center gap-2">
      <NavLink
        to="/app/home"
        className={({ isActive }) =>
          `flex items-center gap-1 hover:text-gray-200 transition p-2 rounded-lg  ${
            isActive ? "text-white font-bold bg-[#333333c6]" : "text-gray-400"
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span className="text-sm font-medium">Home</span>
      </NavLink>

      <NavLink
        to="/app/search"
        className={({ isActive }) =>
          `flex items-center gap-1 hover:text-gray-200 transition p-2 rounded-lg  ${
            isActive ? "text-white font-bold bg-[#333333c6]" : "text-gray-400"
          }`
        }
      >
        <Search className="w-5 h-5" />
        <span className="text-sm font-medium">Search</span>
      </NavLink>

      <NavLink
        to="/app/my-requests"
        className={({ isActive }) =>
          `flex items-center gap-1 hover:text-gray-200 transition p-2 rounded-lg  ${
            isActive ? "text-white font-bold bg-[#333333c6]" : "text-gray-400"
          }`
        }
      >
        <ClipboardClock className="w-5 h-5" />
        <span className="text-sm font-medium">My Requests</span>
      </NavLink>

      {userRole === "admin" && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-1 hover:text-gray-200 transition p-2 rounded-lg ${
              isActive ? "text-white font-bold bg-[#333333c6]" : "text-gray-400"
            }`
          }
        >
          <UserCog className="w-5 h-5" />
          <span className="text-sm font-medium">Admin</span>
        </NavLink>
      )}

      <NavLink
        to="/app/profile"
        className={({ isActive }) =>
          `flex items-center gap-1 hover:text-gray-200 transition p-2 rounded-lg ${
            isActive ? "text-white font-bold bg-[#333333c6]" : "text-gray-400"
          }`
        }
      >
        <User className="w-5 h-5" />
        <span className="text-sm font-medium">Profile</span>
      </NavLink>
    </nav>
  );
}

export default NavBar;
