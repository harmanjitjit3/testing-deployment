import React from "react";
import { Link } from "react-router-dom";
import { Bell, BellDot } from "lucide-react";
import NavBar from "@/components/common/NavBar";

function Header() {
  const user = false;

  return (
    <header className="sticky top-0 z-10 bg-primary text-white px-2 md:px-4 py-2 shadow-md flex items-center justify-between">
      <h1 className="text-xl sm:text-2xl px-3 font-bold">xCHnG</h1>

      <div className="hidden md:block">
        <NavBar />
      </div>
      <Link to={'/app/notifications'} className="flex items-center gap-3 p-3">
        {true ? (
          <BellDot className="cursor-pointer" />
        ) : (
          <Bell className="cursor-pointer" />
        )}
      </Link>
    </header>
  );
}

export default Header;
