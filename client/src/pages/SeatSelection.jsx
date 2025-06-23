import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
    FaMicrophone,
    FaDoorOpen,
    FaCheckCircle,
    FaTicketAlt,
    FaChair,
    FaMoneyBillWave,
    FaList,
} from "react-icons/fa";

export default function SeatSelection() {
    const { id: eventId } = useParams();
    const { state } = useLocation();
    const { ticketQuantity, finalTotal } = state || {};
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [totalSeats, setTotalSeats] = useState(100);
    const [emptySeats, setEmptySeats] = useState(100);
    const [allBooked, setAllBooked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookedSeats = async () => {
            try {
                const response = await axios.get(`/api/tickets/event/${eventId}/seats`);
                const normalizedBookedSeats = (response.data.bookedSeats || []).map(Number);
                setBookedSeats(normalizedBookedSeats);
                const currentEmptySeats = totalSeats - normalizedBookedSeats.length;
                setEmptySeats(currentEmptySeats);
                setAllBooked(currentEmptySeats === 0);
            } catch (error) {
                console.error("Error fetching booked seats:", error);
            }
        };

        fetchBookedSeats();
    }, [eventId, totalSeats]);

    const handleSeatClick = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) {
            Swal.fire("Seat Unavailable", `Seat ${seatNumber} is already booked.`, "error");
            return;
        }

        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats((prev) => prev.filter((num) => num !== seatNumber));
        } else {
            if (selectedSeats.length >= ticketQuantity) {
                Swal.fire("Limit Reached", `You can only select ${ticketQuantity} seat(s).`, "info");
                return;
            }
            setSelectedSeats((prev) => [...prev, seatNumber]);
        }
    };

    const handleConfirm = () => {
        if (selectedSeats.length !== ticketQuantity) {
            Swal.fire("Incomplete Selection", `Please select ${ticketQuantity} seats.`, "warning");
            return;
        }

        navigate(`/event/${eventId}/ordersummary/paymentsummary`, {
            state: {
                selectedSeats,
                finalTotal,
                ticketQuantity,
            },
        });
    };

    const renderSeats = (range, color) => {
        return Array.from({ length: range[1] - range[0] + 1 }, (_, i) => {
            const seatNumber = range[0] + i;
            const isSelected = selectedSeats.includes(seatNumber);
            const isBooked = bookedSeats.includes(seatNumber);

            return (
                <div
                    key={seatNumber}
                    onClick={() => handleSeatClick(seatNumber)}
                    className={`relative w-12 h-12 flex items-center justify-center rounded-lg font-bold text-sm cursor-pointer transition-all duration-300 transform
                        ${isBooked ? "bg-red-400 text-white cursor-not-allowed" : isSelected ? "bg-green-400 scale-110 shadow-lg shadow-green-400/50" : `${color} hover:scale-105 hover:brightness-110`}`}
                >
                    {seatNumber}
                    <span className="absolute top-[-6px] right-[-6px] w-2 h-2 rounded-full bg-white opacity-30" />
                </div>
            );
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 flex flex-col items-center">
            <h1 className="text-5xl font-bold text-yellow-400 mb-10 animate-pulse">
                <FaTicketAlt className="inline-block mr-2" /> Book Your Seats
            </h1>

            {allBooked ? (
                <div className="w-full max-w-2xl bg-red-900/80 text-center p-10 rounded-3xl shadow-2xl border border-red-500 animate-bounce">
                    <h2 className="text-4xl font-extrabold text-yellow-300 mb-4">
                        <FaChair className="inline-block mr-2" /> All Seats Booked!
                    </h2>
                    <p className="text-lg text-white mb-4">
                        Better luck next time! Please check back later or choose another event.
                    </p>
                    <button
                        className="mt-4 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl shadow-lg"
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </button>
                </div>
            ) : (
                <>
                    <div className="w-full max-w-5xl flex justify-center items-center bg-purple-700 text-white font-bold text-xl p-4 rounded-t-xl shadow-md mb-6">
                        <FaMicrophone className="mr-2" /> STAGE
                    </div>

                    <div className="w-full max-w-5xl bg-gray-800 p-6 rounded-b-xl shadow-lg">
                        <div className="mb-6">
                            <div className="grid grid-cols-8 sm:grid-cols-10 gap-4">
                                {renderSeats([1, 8], "bg-yellow-400")}
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="grid grid-cols-8 sm:grid-cols-10 gap-4">
                                {renderSeats([9, 24], "bg-blue-500")}
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-8 sm:grid-cols-10 gap-4">
                                {renderSeats([25, 100], "bg-gray-500")}
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-5xl flex justify-between mt-4 text-xs font-semibold text-gray-400">
                        <div className="bg-red-600 px-4 py-1 rounded shadow">
                            <FaDoorOpen className="inline-block mr-1" /> ENTRY
                        </div>
                        <div className="bg-red-600 px-4 py-1 rounded shadow">
                            <FaDoorOpen className="inline-block mr-1" /> EXIT
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gray-500 rounded shadow" /> Normal
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-green-400 rounded shadow" /> Selected
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-red-400 rounded shadow" /> Booked
                        </div>
                    </div>

                    <div className="mt-10 w-full max-w-xl bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10">
                        <h2 className="text-2xl font-bold text-green-400 mb-4">
                            <FaCheckCircle className="inline-block mr-2" /> Booking Summary
                        </h2>
                        <ul className="space-y-2 text-gray-200 text-md">
                            <li>
                                <FaTicketAlt className="inline-block mr-2" /> <strong>Ticket Quantity:</strong>{" "}
                                {ticketQuantity}
                            </li>
                            <li>
                                <FaMoneyBillWave className="inline-block mr-2" /> <strong>Final Total:</strong> INR{" "}
                                {finalTotal}
                            </li>
                            <li>
                                <FaChair className="inline-block mr-2" /> <strong>Selected Seats:</strong>{" "}
                                <span className="text-green-300">
                                    {selectedSeats.length ? selectedSeats.join(", ") : "None"}
                                </span>
                            </li>
                        </ul>
                        <div className="flex gap-4">
                            <button
                                className={`mt-6 w-full py-3 rounded-2xl font-bold text-lg ${
                                    selectedSeats.length === ticketQuantity
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : "bg-gray-600 text-gray-300 cursor-not-allowed"
                                }`}
                                disabled={selectedSeats.length !== ticketQuantity}
                                onClick={handleConfirm}
                            >
                                <FaCheckCircle className="inline-block mr-2" /> Confirm & Continue
                            </button>

                            <button
                                className="mt-6 w-full py-3 rounded-2xl font-bold text-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                                onClick={() => navigate(`/event/${eventId}/ordersummary`)}
                            >
                                <FaTicketAlt className="inline-block mr-2" /> Edit Order
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="fixed right-4 top-1/4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                    <FaList className="inline-block mr-2" /> Seat Availability
                </h3>
                <p>
                    <strong>Total Seats:</strong> {totalSeats}
                </p>
                <p>
                    <strong>Empty Seats:</strong> {emptySeats}
                </p>
            </div>
        </div>
    );
}
