import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const location = useLocation();
    const { email, plan, price } = location.state || {};

    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [expiry, setExpiry] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const generateRandomCardNumber = () => {
            return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
        };

        setCardNumber(generateRandomCardNumber());
    }, []);

    const validateCardNumber = (number) => {
        const regex = /^[0-9]{16}$/; 
        return regex.test(number);
    };

    const validateCVV = (cvv) => {
        const regex = /^[0-9]{3,4}$/; 
        return regex.test(cvv);
    };

    const validateExpiry = (expiry) => {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; 
        return regex.test(expiry);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);

        if (!cardNumber || !cvv || !expiry) {
            setError("Please fill in all payment details.");
            setIsProcessing(false);
            return;
        }

        if (!validateCardNumber(cardNumber)) {
            setError("Invalid card number. Please enter a 16-digit card number.");
            setIsProcessing(false);
            return;
        }

        if (!validateCVV(cvv)) {
            setError("Invalid CVV. Please enter a 3 or 4-digit CVV.");
            setIsProcessing(false);
            return;
        }

        if (!validateExpiry(expiry)) {
            setError("Invalid expiry date. Please use MM/YY format.");
            setIsProcessing(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:4000/api/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, plan, price, cardNumber, cvv, expiry }),
            });

            const data = await res.json();

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Payment Successful!",
                    text: "Redirecting to Create Event...",
                    showConfirmButton: false,
                    timer: 3000,
                });

                setTimeout(() => {
                    navigate("/createEvent");
                }, 3000);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Payment Failed",
                    text: data.message || "Something went wrong.",
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Please try again later.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 border">
                <h2 className="text-2xl font-bold text-center mb-6">Payment Summary</h2>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 mb-2"><strong>Email Address:</strong> {email}</p>
                    <p className="text-gray-700 mb-2"><strong>Plan:</strong> {plan}</p>
                    <p className="text-gray-700"><strong>Price:</strong> {price}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Card Number</label>
                            <input
                                type="text"
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">CVV</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="123"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="08/26"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full mt-6 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-all"
                    >
                        {isProcessing ? "Processing..." : "Complete Payment"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;