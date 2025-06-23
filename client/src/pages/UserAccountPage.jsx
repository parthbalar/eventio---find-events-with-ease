import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserNavbar } from "../components/UserNavbar";
import { FaCalendarAlt, FaEnvelope, FaTicketAlt } from "react-icons/fa";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/profile", { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch(() => navigate("/login"));
  }, []);

  useEffect(() => {
    if (user?.email) {
      axios.get("http://localhost:4000/api/events").then(({ data }) => {
        setUserEvents(data.filter((event) => event.organizerEmail === user.email));
      });

      axios
        .get(`http://localhost:4000/api/tickets/user/${user._id}`)
        .then(({ data }) => setTotalTickets(data.length))
        .catch((err) => console.error("Error fetching tickets:", err));
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <UserNavbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 overflow-y-auto flex-grow">
          <h2 className="text-3xl font-bold mb-6">
            Welcome, {user?.name || "User"}
          </h2>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            <Link to="/my-events">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                <FaCalendarAlt size={32} className="text-blue-500" />
                <div>
                  <h3 className="text-xl font-semibold">{userEvents.length}</h3>
                  <p className="text-gray-600">Events Created</p>
                </div>
              </div>
            </Link>

            <Link to="/wallet">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                <FaTicketAlt size={32} className="text-red-500" />
                <div>
                  <h3 className="text-xl font-semibold">{totalTickets}</h3>
                  <p className="text-gray-600">Tickets Booked</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Events Table */}
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-2xl font-semibold mb-4">Your Events</h3>

            {userEvents.length === 0 ? (
              <p className="text-gray-600 text-center">No events found.</p>
            ) : (
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="border p-3">Title</th>
                    <th className="border p-3">Date</th>
                    <th className="border p-3">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {userEvents.map((event) => (
                    <tr key={event._id} className="border hover:bg-gray-50">
                      <td className="p-3">{event.title}</td>
                      <td className="p-3">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">{event.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
