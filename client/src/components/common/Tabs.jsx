import { Home, Search, User, ClipboardClock } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Tabs = () => {
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

      <NavLink
        to={"/app/my-requests"}
        className={({ isActive }) =>
          `flex flex-col items-center w-25 h-full py-3 border-b-2 border-transparent transition-all ${
            isActive ? "text-white border-b-2 border-white " : "text-gray-400"
          }`
        }
      >
        <ClipboardClock size={26} />
        <span className="text-xs mt-1">My Requests</span>
      </NavLink>


      

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
