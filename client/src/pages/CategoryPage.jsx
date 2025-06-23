import { useEffect, useState } from "react";
import { useParams , Link } from "react-router-dom";
import axios from "axios";
import EventCard from "../components/EventCard"; 
import Categories from "../components/Categories";
import { IoMdArrowBack } from "react-icons/io";

const CategoryPage = () => {
  const { categoryName } = useParams(); 
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/events");
        const filteredEvents = response.data.filter(event => event.category === categoryName);
        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categoryName]);

  return (
    <>

    

    <Categories/>
    <div className="mx-10 my-8">


      {/* Back button */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/">
          <button className="inline-flex gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            <IoMdArrowBack className="w-6 h-6" /> Back
          </button>
        </Link>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">
        🎭 {categoryName} Events
      </h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {events.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
        ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No events found for this category.</p>
      )}
    </div>
    </>
  );
};

export default CategoryPage;
