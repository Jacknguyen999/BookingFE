import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error") || "Payment failed";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <p className="text-gray-500 mt-4">
          Redirecting to homepage in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;
