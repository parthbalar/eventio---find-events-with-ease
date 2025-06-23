import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const SubscriptionDetails = () => {
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      setError("User email not found in localStorage.");
      return;
    }

    const fetchSubscription = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/subscription/${userEmail}`
        );
        if (response.data.success) {
          setSubscription(response.data.subscription);
        } else {
          Swal.fire({
            icon: "info",
            title: "No Subscription Found",
            text: "You are not subscribed to any plan.",
          });
          setError("No active subscription found.");
        }
      } catch (error) {
        console.error("Error fetching subscription: ", error);
        setError("Failed to fetch subscription.");
      }
    };

    fetchSubscription();
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Subscription Details
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {!subscription && !error ? (
          <p className="text-center text-gray-500 text-lg">Loading subscription...</p>
        ) : subscription && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md">
              <h2 className="text-gray-700 font-semibold text-lg">Plan</h2>
              <p className="text-blue-700 text-xl font-bold">{subscription.plan}</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-md">
              <h2 className="text-gray-700 font-semibold text-lg">Status</h2>
              <p className="text-green-700 text-xl font-bold flex items-center gap-2">
                <FaCheckCircle /> Active
              </p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
              <h2 className="text-gray-700 font-semibold text-lg">Price</h2>
              <p className="text-yellow-700 text-xl font-bold">{subscription.price}</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-gray-700 font-semibold text-lg">Card Number</h2>
              <p className="text-gray-700 text-lg">
                **** **** **** {subscription.cardNumber.slice(-4)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/useraccount")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Back to Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;