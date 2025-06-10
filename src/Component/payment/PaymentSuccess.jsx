import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Copy, Printer, Home, AlertCircle } from "lucide-react";
import apiService from "../../Config/ApiService";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COUNTDOWN = 100000000;
console.log("This is first commit");
console.log("This is second commit");
console.log("This is third commit");
console.log("This is fourth commit");

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(COUNTDOWN);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let timer;
    if (!loading && !error) {
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            setRedirecting(true);
            navigate("/home");
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loading, error, navigate]);

  useEffect(() => {
    const confirm = async () => {
      try {
        const res = await apiService.confirmPayment(sessionId);
        setConfirmationCode(res.data?.bookingConfirmationCode || "");
        setBookingId(res.data?.bookingId || "");
        setError("");
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) confirm();
    else {
      setError("No session_id found in URL");
      setLoading(false);
    }
  }, [sessionId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleHome = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="w-full max-w-md mx-auto shadow-lg border-none bg-white rounded-lg">
          <div className="p-8">
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
              <div className="h-16 w-16 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin"></div>
              <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                Processing Payment
              </h2>
              <p className="text-gray-500">
                Please wait while we confirm your booking...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="w-full max-w-md mx-auto shadow-lg border-none bg-white rounded-lg animate-fade-in">
          <div className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 p-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-semibold text-red-700">
                Payment Failed
              </h2>
              <p className="text-gray-700 text-center mb-6">{error}</p>
              <button
                onClick={handleHome}
                className="w-full flex items-center justify-center gap-2 bg-[#007F86] hover:bg-[#005f66] text-white px-4 py-2 rounded"
              >
                <Home className="h-4 w-4" />
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 print:bg-white print:p-0">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="w-full max-w-md mx-auto shadow-lg border-none animate-fade-in print:shadow-none print:border bg-white rounded-lg">
        {/* Header */}
        <div className="bg-[#007F86] text-white p-8 rounded-t-lg print:bg-white print:text-[#007F86]">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-white/20 p-4 mb-4 print:bg-[#ecfdf5]">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold">Payment Successful</h2>
            <p className="opacity-90 mt-1">Your booking has been confirmed</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            {/* Booking ID */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Booking ID</span>
                <button
                  className="h-6 w-6 p-0 flex items-center justify-center bg-[#007F86] text-white"
                  onClick={() => copyToClipboard(bookingId)}
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="text-lg font-mono font-semibold text-gray-800">
                {bookingId}
              </p>
            </div>

            {/* Confirmation Code */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Confirmation Code</span>
                <button
                  className="h-6 w-6 p-0 flex items-center justify-center bg-[#007F86] text-white"
                  onClick={() => copyToClipboard(confirmationCode)}
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="text-lg font-mono font-semibold text-gray-800">
                {confirmationCode}
              </p>
            </div>

            <div className="border border-gray-100 rounded-lg p-3 bg-green-50 text-[#007F86]">
              <p className="text-center text-sm">Thanks for Order</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 p-4 pt-0">
          <div className="flex justify-between w-full gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>

            <button
              onClick={handleHome}
              className="flex-1 bg-[#007F86] hover:bg-[#005f66] text-white flex items-center justify-center gap-1 px-2 py-1 rounded"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-2">
            {redirecting
              ? "Redirected to homepage!"
              : `Redirecting to homepage in ${countdown} seconds...`}
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          @media print {
            .print\\:static { position: static !important; }
            .print\\:bg-white { background-color: white !important; }
            .print\\:p-0 { padding: 0 !important; }
            .print\\:hidden { display: none !important; }
            .print\\:shadow-none { box-shadow: none !important; }
            .print\\:border { border: 1px solid #e5e7eb !important; }
            .print\\:text-emerald-600 { color: #059669 !important; }
            .print\\:bg-emerald-50 { background-color: #ecfdf5 !important; }
          }
        `}
      </style>
    </div>
  );
};

export default PaymentSuccess;
