import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort, BsArrowDownShort } from "react-icons/bs";
import { motion } from "framer-motion";
import ImageSlider from "./ImageSlider";
import Categories from "../components/Categories";
import Topdesti from "../components/Topdesti";
import EventCard from "../components/EventCard";

export default function IndexPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleEvents, setVisibleEvents] = useState(4);

  const isUpcoming = (eventDate, eventTime) =>
    new Date(`${eventDate} ${eventTime}`) > new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/events");
        const upcomingEvents = response.data.filter((event) =>
          isUpcoming(event.eventDate, event.eventTime)
        );
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) =>
        prev.filter((event) => isUpcoming(event.eventDate, event.eventTime))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((event) =>
    isUpcoming(event.eventDate, event.eventTime)
  );

  const loadMoreEvents = () => {
    setVisibleEvents((prev) => Math.min(prev + 4, filteredEvents.length));
  };

  const isTodayAndUpcoming = (eventDate, eventTime) => {
    const eventDateTime = new Date(`${eventDate} ${eventTime}`);
    const now = new Date();
    return (
      eventDateTime.getDate() === now.getDate() &&
      eventDateTime.getMonth() === now.getMonth() &&
      eventDateTime.getFullYear() === now.getFullYear() &&
      eventDateTime > now
    );
  };

  return (
    <>
    {/* image slider */}
      <ImageSlider />
      {/* categories */}
      <Categories />

      {/* All Event CTA */}
      <motion.div
        className="mx-10 my-10 flex flex-col items-center text-center bg-blue-100/50 p-8 rounded-xl shadow-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Exciting Events!
        </h2>
        <p className="text-gray-600 text-lg mb-6 max-w-xl">
          Discover amazing events happening near you. Don&apos;t miss out—book your tickets today!
        </p>
        <Link to="/events">
   
          <button className="relative inline-flex items-center gap-3 font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis rounded-full px-5 py-3 pl-5 transition-colors duration-300 bg-[#3779cf] hover:bg-black">
            <span className="relative w-[25px] h-[25px] grid place-items-center rounded-full bg-white text-[#085fd0] overflow-hidden">
        
              <svg
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[10px] h-[10px] transition-transform duration-300 ease-in-out group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
              >
                <path
                  d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                  fill="currentColor"
                />
              </svg>
           
              <svg
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[10px] h-[10px] absolute transition-transform duration-300 ease-in-out delay-100 translate-x-[-150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0"
              >
                <path
                  d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Explore
          </button>

        </Link>
      </motion.div>

      {/* Today’s Events Section */}
      <motion.div
        className="mx-10 my-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">
          Today&apos;s Events
        </h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : events.some((event) => isTodayAndUpcoming(event.eventDate, event.eventTime)) ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {events
              .filter((event) => isTodayAndUpcoming(event.eventDate, event.eventTime))
              .map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <EventCard event={event} index={index} />
                </motion.div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No events scheduled for today.</p>
        )}
      </motion.div>

      {/* Upcoming Events Section */}
      <motion.div
        className="mx-10 my-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
          Upcoming Events
        </h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-center text-gray-600">There are no upcoming events.</p>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredEvents.slice(0, visibleEvents).map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <EventCard event={event} index={index} />
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {filteredEvents.length > visibleEvents && visibleEvents < 12 && (
              <div className="flex justify-center mt-6 gap-4">
                <motion.button
                  onClick={loadMoreEvents}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-lg shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-purple-700 active:scale-95 flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View More <BsArrowDownShort className="w-6 h-6" />
                </motion.button>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Top Destinations */}
      <motion.div
        className="mx-10 my-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
          Top Destinations in India
        </h2>
        <Topdesti />
      </motion.div>
    </>
  );
}
