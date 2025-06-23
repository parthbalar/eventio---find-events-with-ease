import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikedEvent = () => {
  const [likedEvents, setLikedEvents] = useState([]);

  // Fetch liked events from local storage
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedEvents")) || [];
    setLikedEvents(storedLikes);
  }, []);

  // Function to remove event from liked list
  const removeLikedEvent = (eventId) => {
    const updatedLikes = likedEvents.filter((event) => event.id !== eventId);
    setLikedEvents(updatedLikes);
    localStorage.setItem("likedEvents", JSON.stringify(updatedLikes));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Liked Events</h1>

        {likedEvents.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">You haven't liked any events yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedEvents.map((event) => (
              <div key={event.id} className="bg-white shadow-lg rounded-xl overflow-hidden transition transform hover:scale-105">
                <img
                  src={event.image || "https://via.placeholder.com/300"}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                  <p className="text-gray-500">{event.date} • {event.location}</p>
                  <div className="flex justify-between items-center mt-3">
                    <Link
                      to={`/event/${event.id}`}
                      className="text-indigo-600 font-medium hover:underline"
                    >
                      View Details
                    </Link>
                    <button onClick={() => removeLikedEvent(event.id)} className="text-red-500 hover:text-red-700">
                      <FaHeart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedEvent;
