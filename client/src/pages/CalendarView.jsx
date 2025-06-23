import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from "date-fns";
import { useEffect, useState } from "react";
import { BsCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  //! Fetch events from the server
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/events") // Ensure the correct API route
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const firstDayOfWeek = firstDayOfMonth.getDay();

  //! Create an array of empty cells to align days correctly
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, index) => (
    <div key={`empty-${index}`} className="p-2 bg-gray-100 rounded-lg"></div>
  ));

  //! Function to Generate Random Colors for Events
  const eventColors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"];
  const getRandomColor = (index) => eventColors[index % eventColors.length];

  return (
    <div className="p-6 max-w-7xl mx-auto min-w-[1200px]"> {/* Adjusted Width */}
    
    {/* Back Button */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/">
          <button className="inline-flex gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            <IoMdArrowBack className="w-6 h-6" /> Back
          </button>
        </Link>
      </div>

      <div className="bg-white bg-opacity-80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 text-gray-900">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full shadow-md transition duration-300"
            onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, -1))}
          >
            <BsCaretLeftFill className="w-6 h-6 text-gray-600" />
          </button>
          <span className="text-3xl font-semibold tracking-wide">{format(currentMonth, "MMMM yyyy")}</span>
          <button
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full shadow-md transition duration-300"
            onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))}
          >
            <BsFillCaretRightFill className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Days of the Week */}
        <div className="grid grid-cols-7 text-center font-semibold text-lg text-gray-700 border-b border-gray-300 pb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-3">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mt-2">
          {emptyCells.concat(
            daysInMonth.map((date, index) => {
              const dayEvents = events.filter(
                (event) => format(new Date(event.eventDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
              );

              return (
                <div
                  key={date.toISOString()}
                  className={`p-4 relative bg-white border border-gray-300 shadow-md rounded-lg hover:shadow-xl transition duration-300 min-h-[140px] flex flex-col justify-start text-gray-800 ${
                    dayEvents.length > 0 ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Day Number */}
                  <div className="text-lg font-semibold">{format(date, "dd")}</div>

                  {/* Event Display (only if events exist) */}
                  {dayEvents.length > 0 &&
                    dayEvents.map((event, eventIndex) => (
                      <Link to={`/event/${event._id}`} key={event._id}>
                        <div
                          className={`text-white text-xs md:text-sm font-medium px-2 py-1 rounded-md shadow-md truncate mt-2 transition duration-300 hover:scale-105 ${getRandomColor(eventIndex)}`}
                        >
                          {event.title}
                        </div>
                      </Link>
                    ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
