import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import { Mail } from "lucide-react";


const VerifyEmailMessage = () => {
    const location = useLocation()

  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const { email } = location.state

  const handleResendEmail = async () => {
    if (!email) return;
    try {
      setIsResending(true);
      setResendStatus(null);
      
      await axios.post("/auth/resend-verification", { email });
      
      setResendStatus("A new verification link has been sent to your email.");
    } catch (error) {
      setResendStatus((axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message) || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        {/* Email Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600">
            <Mail size={40} />
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Check your email
          </h2>
          <p className="text-sm text-gray-600">
            We sent a verification link to{" "}
            {email ? (
              <span className="font-semibold text-gray-900">{email}</span>
            ) : (
              "your email address"
            )}
            . Please click the link to activate your account.
          </p>
        </div>

        {/* Alert / Feedback message */}
        {resendStatus && (
          <div className="p-3 text-xs rounded-lg bg-blue-50 text-blue-700 font-medium">
            {resendStatus}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isResending ? "Resending..." : "Resend Email"}
          </button>

        </div>

        {/* Spam Footer Warning */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Didn't receive the email? Check your spam or junk folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailMessage;