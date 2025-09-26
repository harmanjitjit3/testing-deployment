import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUserThunk } from "@/store/thunks/user.thunk";
import { setUser } from "@/store/slices/user.slice";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    locality: "",
    password: "",
  });

  const state = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const { username, email, phone, locality, password } = formData;
    const errors = {};

    if (!username) errors.username = "Username is required";
    if (!email) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = "Invalid phone number";
    }

    if (!locality) errors.locality = "Locality is required";

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password should be at least 8 characters long";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      toast.error(
        errors.username ||
          errors.email ||
          errors.phone ||
          errors.locality ||
          errors.password
      );
      return;
    }

    const data = await dispatch(signupUserThunk(formData));

    if (data?.payload?.success) {
      dispatch(setUser(data?.payload?.user));
      toast.success(
        data?.payload?.response?.message ||
          data?.payload?.message ||
          "Signup Success!"
      );
      navigate("/pending-approval");
    } else {
      toast.error(
        data?.payload?.response?.message ||
          data?.payload?.message ||
          "Something went wrong!"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm flex flex-col items-center space-y-8">
        {/* Title + Subtext */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500">Join us today and start exchanging!</p>
        </div>

        {/* Form */}
        <form
          className="flex w-full flex-col space-y-4"
          autoComplete="on"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <Label className="text-sm text-gray-800 mb-1 px-2">Username</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              name="username"
              autoComplete="name"
              value={formData.username}
              onChange={handleChange}
              className="w-full !px-4 !py-5 !text-lg rounded-lg border-2 focus:border-2 !focus-visible:outline-none focus-visible:ring-0"
              required
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm text-gray-800 mb-1 px-2">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full !px-4 !py-5 !text-lg rounded-lg border-2 focus:border-2 !focus-visible:outline-none focus-visible:ring-0"
              required
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm text-gray-800 mb-1 px-2">
              Phone Number
            </Label>
            <Input
              type="text"
              placeholder="Enter your phone number"
              name="phone"
              autoComplete="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full !px-4 !py-5 !text-lg rounded-lg border-2 focus:border-2 !focus-visible:outline-none focus-visible:ring-0"
              required
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm text-gray-800 mb-1 px-2">Locality</Label>
            <Input
              type="text"
              placeholder="Your locality"
              name="locality"
              autoComplete="locality"
              value={formData.locality}
              onChange={handleChange}
              className="w-full !px-4 !py-5 !text-lg rounded-lg border-2 focus:border-2 !focus-visible:outline-none focus-visible:ring-0"
              required
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm text-gray-800 mb-1 px-2">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              name="password"
              autoComplete="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full !px-4 !py-5 !text-lg rounded-lg border-2 focus:border-2 !focus-visible:outline-none focus-visible:ring-0"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={state.buttonLoading}
            className="text-lg w-full py-6 rounded-lg font-semibold transition-transform shadow-lg cursor-pointer text-white"
            // className="w-full rounded-xl py-3 text-lg font-semibold text-white shadow-md bg-primary hover:opacity-90 disabled:opacity-70"
          >
            {state.buttonLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
