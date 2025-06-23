import { Link } from "react-router-dom";
import { MdEvent, MdAccessTime, MdLocationOn, MdEventSeat } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";

const EventCard = ({ event, index }) => {
  const [bookedCount, setBookedCount] = useState(0);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/tickets/event/${event._id}/seats`
        );
        const bookedSeats = response.data.bookedSeats || [];
        setBookedCount(bookedSeats.length);
      } catch (err) {
        console.error("Failed to fetch booked seats:", err);
        setBookedCount(0);
      }
    };

    fetchBookedSeats();
  }, [event._id]);

  return (
    <div>
      <Link to={`/event/${event._id}`}>
        <div
          className="bg-gray-100 shadow-lg rounded-lg overflow-hidden border border-blue-300"
          key={event._id}
        >
          {/* Event Image */}
          <div className="relative">
            <img
              src={
                event.imageUrl
                  ? `http://localhost:4000${event.imageUrl}`
                  : "/default-event.jpg"
              }
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <span className="absolute top-2 right-2 bg-blue-700 text-white font-bold px-2 py-1 rounded-full text-xs shadow-md">
              #{index + 1}
            </span>
          </div>

          {/* Event Details */}
          <div className="p-4 bg-white">
            <h2 className="font-bold text-xl text-blue-800 truncate mb-2">
              {event.title}
            </h2>
            <div className="text-sm text-blue-700 space-y-2">
              <p className="flex items-center gap-2">
                <MdEvent className="text-blue-600" />
                <span>{event.eventDate?.split("T")[0]}</span>
              </p>
              <p className="flex items-center gap-2">
                <MdAccessTime className="text-blue-600" />
                <span>{event.eventTime}</span>
              </p>
              <p className="flex items-center gap-2">
                <MdLocationOn className="text-blue-600" />
                <span>{event.location || "Unknown Location"}</span>
              </p>
              <p className="flex items-center gap-2">
                <MdEventSeat className="text-blue-600" />
                <span>
                  {bookedCount} {bookedCount === 1 ? "seat" : "seats"} booked
                </span>
              </p>
            </div>

            {/* Details Button */}
            <div className="mt-4">
              <Link to={`/event/${event._id}`}>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
