import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import apiService from "../../Config/ApiService";
import { CircularProgress } from "@mui/material";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

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
        setTimeout(() => navigate("/home"), 5000);
      }
    };
    if (sessionId) confirm();
    else {
      setError("No session_id found in URL");
      setLoading(false);
      setTimeout(() => navigate("/home"), 5000);
    }
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Payment Error
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
          </>
        ) : (
          <>
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-2">
              Your booking has been confirmed.
            </p>
            <p className="text-gray-600 mb-2">
              <b>Booking ID:</b> {bookingId}
            </p>
            <p className="text-gray-600 mb-2">
              <b>Confirmation Code:</b> {confirmationCode}
            </p>
            <p className="text-gray-500 mt-4">
              Redirecting to homepage in 5 seconds...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
