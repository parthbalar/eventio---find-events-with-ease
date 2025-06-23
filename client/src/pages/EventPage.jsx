import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillCalendar, AiOutlineClockCircle, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import img1 from "../assets/hero.jpg";
import { IoMdArrowBack } from "react-icons/io";

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [img, setImg] = useState();
  const [timeLeft, setTimeLeft] = useState("");
  const [isHurry, setIsHurry] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:4000/api/events/${id}`)
      .then((response) => {
        const imageUrl = response.data.imageUrl
          ? `http://localhost:4000${response.data.imageUrl.replace(/\\/g, "/")}`
          : img1;
        setImg(imageUrl);
        setEvent(response.data);

        return axios.get(`http://localhost:4000/api/reviews/event/${id}`);
      })
      .then((res) => {
        setReviews(res.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  useEffect(() => {
    if (!event) return;

    const eventDate = new Date(event.eventDate);
    const today = new Date();

    const isSameDate =
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear();

    if (isSameDate) {
      setIsHurry(true);

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = eventDate.getTime() - now;

        if (difference <= 0) {
            setTimeLeft("Event will be live soon!");
          clearInterval(interval);
        } else {
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m left`);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsHurry(false);
    }
  }, [event]);

  if (!event)
    return (
      <div className="text-center mt-10 text-lg font-semibold text-gray-700">
        Loading event details...
      </div>
    );

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const shareUrl = window.location.href;

  return (
    <motion.div className="w-[975px] max-w-full mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg mb-20">
      {/* Back button */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/">
          <button className="inline-flex gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            <IoMdArrowBack className="w-6 h-6" /> Back
          </button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-md">
        <img src={img} alt="Event" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
      </div>

      {/* Event Title & Booking */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
        <Link to={`/event/${event._id}/ordersummary`}>
          <motion.button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all">
            Book Tickets
          </motion.button>
        </Link>
      </div>

      <div className="text-xl font-semibold text-gray-800 mt-3">
        Price : ₹{event.ticketPrice || 0}
      </div>

      {/* Description */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold">About This Event</h2>
        <p className="text-gray-700 mt-2">{event.description}</p>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 md:mb-3">
        <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow">
          <AiFillCalendar className="text-blue-600 text-3xl" />
          <div className="ml-3">
            <h2 className="text-lg font-bold">Date</h2>
            <p>{event.eventDate.split("T")[0]}</p>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow">
          <AiOutlineClockCircle className="text-blue-600 text-3xl" />
          <div className="ml-3">
            <h2 className="text-lg font-bold">Time</h2>
            <p>{event.eventTime}</p>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow">
          <MdLocationPin className="text-blue-600 text-3xl" />
          <div className="ml-3">
            <h2 className="text-lg font-bold">City</h2>
            <p>{event.location}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow">
        <MdLocationPin className="text-blue-600 text-3xl" />
        <div className="ml-3">
          <h2 className="text-lg font-bold">Address</h2>
          <p>{event.address}</p>
        </div>
      </div>

      {/* Hurry Section - only for today's events */}
      {isHurry && (
        <div className="mt-6 bg-red-100 p-4 rounded-lg text-red-600 font-semibold text-lg">
          Hurry! {timeLeft}
        </div>
      )}

      {/* Map */}
      <div className="mt-6 rounded-lg overflow-hidden shadow-md">
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
          allowFullScreen
        ></iframe>
      </div>

      {/* Refund Policy */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-red-500">Refund Policy</h2>
        <p className="text-gray-700">
          Refunds up to 7 days before the event.
        </p>
      </div>

      {/* Social Share Buttons */}
      <div className="mt-6 flex gap-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="text-blue-600 text-3xl hover:scale-110 transition-all" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter className="text-blue-400 text-3xl hover:scale-110 transition-all" />
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="text-green-500 text-3xl hover:scale-110 transition-all" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="text-blue-700 text-3xl hover:scale-110 transition-all" />
        </a>
      </div>

      
      
    </motion.div>
  );
}
