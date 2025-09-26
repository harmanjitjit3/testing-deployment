import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store.js";
import { Toaster } from "react-hot-toast";
import Layout from "@/Layout.jsx";
import RootLayout from "@/RootLayout.jsx";
import Auth from "@/pages/Auth.jsx";
import Login from "@/pages/Login.jsx";
import Register from "@/pages/Register.jsx";
import Home from "@/pages/Home.jsx";
import SearchPage from "@/pages/Search.jsx";
import Profile from "@/pages/Profile.jsx";
import Notifications from "@/pages/NotificationsPage.jsx";
import NotFound from "@/pages/NotFound.jsx";
import PendingApproval from "@/pages/PendingApproval.jsx";
import RequestDetail from "@/pages/admin/RequestDetail.jsx";
import ProtectedRoute from "@/context/ProtectedRoute.jsx";
import PublicRoute from "@/context/PublicRoute.jsx";
import AdminRoutes from "@/context/AdminRoutes.jsx";
import RequestsList from "./pages/admin/RequestsList";
import AuthRoute from "./context/AuthRoutes";
import AdminPanel from "./pages/admin/AdminPanel";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: "/", element: <Auth /> },
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },

      {
        path: "/pending-approval",
        element: <AuthRoute />,
        children: [{ index: true, element: <PendingApproval /> }],
      },

      {
        path: "/app",
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              { index: true, element: <Navigate to="home" replace /> },
              { path: "home", element: <Home /> },
              { path: "search", element: <SearchPage /> },
              { path: "profile", element: <Profile /> },
            ],
          },
          { path: "notifications", element: <Notifications /> },
        ],
      },

      {
        path: "/admin",
        element: <AdminRoutes />,
        children: [
          {
            element: <Layout />,
            children: [
              { index: true, element: <AdminPanel /> },
              { path: "requests", element: <RequestsList /> },
            ],
          },
          { path: "request-detail/:id", element: <RequestDetail /> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster position="top-right" reverseOrder={false} />
  </Provider>
);
