/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams, useLocation } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { UserContext } from "../UserContext";
import Qrcode from "qrcode";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export default function PaymentSummary() {
    const { id } = useParams();
    const location = useLocation();
    const { ticketQuantity, finalTotal, selectedSeats } = location.state || {};
    const { user } = useContext(UserContext);

    const [event, setEvent] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    const [ticketDetails, setTicketDetails] = useState({
        userid: user ? user._id : "",
        eventid: "",
        ticketDetails: {
            name: user ? user.name : "",
            email: user ? user.email : "",
            eventname: "",
            eventdate: "",
            eventtime: "",
            ticketprice: "",
            qr: "",
            selectedSeats: selectedSeats || [],
            tickets: ticketQuantity || 0,
        },
    });

    // Fetch event details
    useEffect(() => {
        if (!id) return;
        axios
            .get(`/api/events/${id}/ordersummary/paymentsummary`)
            .then((response) => {
                setEvent(response.data);
                setTicketDetails((prev) => ({
                    ...prev,
                    eventid: response.data._id,
                    ticketDetails: {
                        ...prev.ticketDetails,
                        eventname: response.data.title,
                        eventdate: response.data.eventDate.split("T")[0],
                        eventtime: response.data.eventTime,
                        ticketprice: response.data.ticketPrice,
                    },
                }));
            })
            .catch((error) => {
                console.error("Error fetching event details:", error);
                Swal.fire("Error", "Failed to load event details.", "error");
            });
    }, [id]);

    useEffect(() => {
        setTicketDetails((prev) => ({
            ...prev,
            userid: user ? user._id : "",
            ticketDetails: {
                ...prev.ticketDetails,
                name: user ? user.name : "",
                email: user ? user.email : "",
                selectedSeats: selectedSeats || [],
                tickets: ticketQuantity || 0,
            },
        }));
    }, [user, ticketQuantity, selectedSeats]);

    const generateQRCode = async (name, eventName) => {
        try {
            return await Qrcode.toDataURL(`Event: ${eventName} | Name: ${name}`);
        } catch (error) {
            console.error("Error generating QR code:", error);
            return null;
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        if (!user) {
            Swal.fire("Error", "Please log in to proceed.", "error");
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.post("/api/payment/create-payment-intent", {
                amount: finalTotal,
                currency: "INR",
            });

            const clientSecret = data.clientSecret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                Swal.fire("Error", result.error.message, "error");
            } else {
                Swal.fire("Success", "Payment Successful!", "success");
                await createTicket();
            }
        } catch (error) {
            Swal.fire("Error", "Payment failed. Try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const createTicket = async () => {
        try {
            const qrCode = await generateQRCode(
                ticketDetails.ticketDetails.name,
                ticketDetails.ticketDetails.eventname
            );

            const updatedTicket = {
                ...ticketDetails,
                ticketDetails: {
                    ...ticketDetails.ticketDetails,
                    qr: qrCode,
                    selectedSeats: selectedSeats,
                    tickets: ticketQuantity,
                },
            };

            console.log("Sending Ticket to DB:", updatedTicket);

            await axios.post(`/api/tickets`, updatedTicket);

            Swal.fire({
                title: "Success",
                text: "Ticket Created Successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });

            setTimeout(() => setRedirect(true), 2000);
        } catch (error) {
            Swal.fire("Error", "Failed to create ticket.", "error");
        }
    };

    if (redirect) return <Navigate to={"/wallet"} />;
    if (!ticketQuantity || !finalTotal) return <Navigate to="/seat-selection" />;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <Link to={`/event/${event?._id}/ordersummary`} className="text-blue-500 flex items-center">
                <IoMdArrowBack className="mr-2" /> Back
            </Link>

            <h2 className="text-2xl font-bold mt-6">Payment Summary</h2>

            {/* Order Summary */}
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <p>{event?.title}</p>
                <p>{event?.eventDate?.split("T")[0]}, {event?.eventTime}</p>
                <p className="font-bold">Total: Rs. {finalTotal}</p>
                <p className="font-bold">Tickets: {ticketQuantity}</p>
                <p className="font-semibold">Selected Seats: {selectedSeats?.join(", ")}</p>
            </div>

            {/* Card Details */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold">Enter Card Details</h3>
                <div className="border p-4 rounded-md">
                    <CardElement className="p-2 border rounded-md" />
                </div>
                <p className="text-gray-500 text-sm mt-2">
                    Use test card: <strong>4242 4242 4242 4242</strong> (Expiry: Any future date, CVC: Any 3 digits)
                </p>
            </div>

            {/* Pay Button */}
            <button
                onClick={handlePayment}
                className={`w-full mt-4 text-white p-3 rounded-lg transition ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={loading}
            >
                {loading ? "Processing..." : "Make Payment"}
            </button>

            {/* QR Code */}
            {ticketDetails.ticketDetails.qr && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Your Ticket QR Code</h3>
                    <img src={ticketDetails.ticketDetails.qr} alt="QR Code" className="w-32 h-32 mx-auto" />
                </div>
            )}
        </div>
    );
}
