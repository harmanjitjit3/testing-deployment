import { Outlet } from "react-router-dom";
import AppInitializer from "@/context/AppInitilizer";

export default function RootLayout() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto">
        <AppInitializer>
          <Outlet />
        </AppInitializer>
      </div>
    </div>
  );
}
