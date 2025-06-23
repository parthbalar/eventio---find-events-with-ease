import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function OrderSummary() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        if (!id) return;

        // Fetch event details
        axios.get(`http://localhost:4000/api/events/${id}/ordersummary`)
            .then(response => setEvent(response.data))
            .catch(error => console.error("Error fetching event details:", error));
    }, [id]);

    const handleCheckboxChange = (e) => {
        setIsCheckboxChecked(e.target.checked);
    };

    const handleQuantityChange = (e) => {
        setTicketQuantity(Number(e.target.value));
    };

    const generatePromoCode = () => {
        const newCode = `PROMO${Math.floor(Math.random() * 10000)}`;
        setPromoCode(newCode);
        setDiscount(10); // Setting a fixed discount for simplicity
    };

    const handleProceed = () => {
        if (!isCheckboxChecked) {
            Swal.fire({
                title: "Accept Terms",
                text: "You must accept the terms and conditions.",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }

        // Proceed to seat selection page
        navigate(`/event/${event._id}/seatselection`, {
            state: { ticketQuantity, finalTotal: discountedPrice }
          });
          
    };

    if (!event) return '';

    const totalPrice = event.ticketPrice * ticketQuantity;
    const discountedPrice = totalPrice - (totalPrice * discount / 100);

    return (
        <div className="p-10 bg-gray-900 min-h-screen text-white flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <Link to={`/event/${event._id}`}>
                    <button className='inline-flex gap-2 p-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all shadow-md'>
                        <IoMdArrowBack className='w-6 h-6' /> Back
                    </button>
                </Link>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
                    {/* Terms & Conditions */}
                    <div className='p-6 bg-gray-800 rounded-lg shadow-lg'>
                        <h2 className='font-bold text-xl border-b pb-2 text-blue-400'>Terms & Conditions</h2>
                        <ul className='mt-4 list-disc pl-6 text-gray-300 leading-relaxed space-y-2'>
                            <li>Refunds available up to 14 days before the event.</li>
                            <li>Tickets will be sent via email.</li>
                            <li>Maximum purchase: 2 tickets per person.</li>
                            <li>Postponed event tickets remain valid.</li>
                        </ul>
                    </div>

                    {/* Booking Summary */}
                    <div className='p-6 bg-blue-900 rounded-lg shadow-lg flex flex-col justify-between'>
                        <h2 className='font-bold text-lg text-yellow-300 border-b pb-2'>Booking Summary</h2>
                        <div className='text-sm mt-4 flex justify-between border-b pb-2'>
                            <span>{event.title}</span>
                            <span>₹ {event.ticketPrice}</span>
                        </div>

                        {/* Ticket Quantity */}
                        <div className='mt-4'>
                            <label className='block text-sm font-bold'>Ticket Quantity</label>
                            <input type='number' value={ticketQuantity} min='1' max='2' onChange={handleQuantityChange}
                                className='w-full p-2 border rounded-md mt-2 bg-gray-100 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>

                        {/* Promo Code */}
                        <div className='mt-4'>
                            <label className='block text-sm font-bold'>Promo Code</label>
                            <div className='flex mt-2'>
                                <input type='text' value={promoCode} readOnly className='w-full p-2 border rounded-md bg-gray-100 text-black shadow-sm' />
                                <button onClick={generatePromoCode} className='ml-2 p-2 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-600 transition-all shadow-md'>Generate</button>
                            </div>
                        </div>

                        <hr className='my-4 border-gray-500' />
                        <div className='text-sm font-bold flex justify-between text-gray-200'>
                            <span>SUB TOTAL</span>
                            <span>₹ {totalPrice}</span>
                        </div>
                        <div className='text-sm font-bold flex justify-between mt-2 text-red-300'>
                            <span>DISCOUNT</span>
                            <span>-₹ {totalPrice * discount / 100}</span>
                        </div>
                        <div className='text-sm font-bold flex justify-between mt-2 text-green-400'>
                            <span>FINAL TOTAL</span>
                            <span>₹ {discountedPrice}</span>
                        </div>

                        <div className='flex mt-4 items-center'>
                            <input type='checkbox' className='h-5 w-5' onChange={handleCheckboxChange} />
                            <span className='px-2 text-sm'>I accept the terms and conditions.</span>
                        </div>

                        <div className='mt-4'>
                            <button
                                onClick={handleProceed}
                                className={`p-3 w-full text-white font-bold rounded-md transition-all shadow-md ${isCheckboxChecked ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'}`}
                                disabled={!isCheckboxChecked}>
                                Proceed to Seat Selection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
