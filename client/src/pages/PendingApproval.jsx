import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { setUser } from "../store/slices/user.slice";


export default function PendingApproval() {
  const { userProfile } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userProfile || userProfile.status === "rejected") {
      navigate("/", { replace: true });
      return;
    }
    if (userProfile.status === "approved") {
      navigate("/app/home", { replace: true });
      return;
    }
  }, [ userProfile, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-md rounded-2xl border bg-white">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-6">
            <ShieldAlert size={40} />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Account Under Review
          </h2>

          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            Your account is currently{" "}
            <span className="font-medium text-indigo-600">
              pending admin approval
            </span>
            . Once approved, you’ll gain full access to the platform.
          </p>

          <div className="w-full mt-6 bg-gray-50 border rounded-lg p-4 text-sm text-gray-500">
            ⏳ You’ll be notified instantly once the review is complete.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
