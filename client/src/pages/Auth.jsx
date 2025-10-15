import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Auth() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col w-full max-w-sm items-center justify-center space-y-10">
        {/* Logo / Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-primary">xCHnG</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Upload, review and exchange <br /> documents & images
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col gap-3">
          <Link to="/register" className="w-full">
            <Button className="w-full rounded-xl py-6 text-lg  cursor-pointer" size="lg">
              Get Started
            </Button>
          </Link>
          <Link to="/login" className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-xl py-6 text-lg  cursor-pointer"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
