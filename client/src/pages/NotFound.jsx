import { Button } from "@/components/ui/button";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/app/home");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center ">
      <div className="text-5xl font-semibold">404</div>

      <div className="text-lg">Page not found.</div>

      <Button onClick={goBack} className="cursor-pointer mt-4">
        Go Back
      </Button>
    </div>
  );
}

export default NotFound;
