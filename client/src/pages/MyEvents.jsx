import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRedo, FaPlus  } from "react-icons/fa";
import { UserNavbar } from "../components/UserNavbar";
import Swal from "sweetalert2";

const MyEvents = () => {
  const [user, setUser] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [repeatingEvent, setRepeatingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({});
  const navigate = useNavigate();

  // Fetch user session
  useEffect(() => {
    axios
      .get("http://localhost:4000/profile", { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch(() => navigate("/login"));
  }, []);

  // Fetch events created by the user
  useEffect(() => {
    if (user?.email) {
      axios
        .get("http://localhost:4000/api/events")
        .then(({ data }) => {
          setUserEvents(data.filter((event) => event.organizerEmail === user.email));
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // Handle repeat event click (copy event data)
  const handleRepeatClick = (event) => {
    const { _id, createdAt, updatedAt, ...eventData } = event;
    setRepeatingEvent(event);
    setNewEvent({
      ...eventData,
      eventDate: "", // Ensure user sets a new date
      eventTime: "",
      organizerEmail: user?.email,
      image: null, // Reset image
    });
  };

  // Handle event creation with FormData
  const handleCreateEvent = async () => {
    if (
      !newEvent.eventDate ||
      !newEvent.eventTime ||
      !newEvent.address ||
      !newEvent.location ||
      !newEvent.ticketPrice ||
      !newEvent.description ||
      !newEvent.image
    ) {
      Swal.fire("Error!", "All fields including the image must be filled.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("organizedBy", user?.name);
      formData.append("eventDate", newEvent.eventDate);
      formData.append("eventTime", newEvent.eventTime);
      formData.append("address", newEvent.address);
      formData.append("location", newEvent.location);
      formData.append("ticketPrice", newEvent.ticketPrice);
      formData.append("category", newEvent.category);
      formData.append("organizerEmail", user?.email);
      formData.append("image", newEvent.image); // File Upload

      const { data } = await axios.post("http://localhost:4000/api/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setUserEvents([...userEvents, data]);
      Swal.fire("Success!", "Your event has been created.", "success");
      setRepeatingEvent(null);
      setNewEvent({});
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to create event.", "error");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <UserNavbar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Events</h2>
          <button
            onClick={() => navigate("/useraccount")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
          <button
            onClick={() => navigate("/createEvent")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition my-4"
          >
           <FaPlus /> Create Event
          </button>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Created Events</h3>
          {userEvents.length > 0 ? (
            <ul>
              {userEvents.map((event) => (
                <li key={event._id} className="p-4 border rounded-lg mb-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-semibold">{event.title}</h4>
                    <p className="text-gray-700">{new Date(event.eventDate).toLocaleDateString()}</p>
                    <p className="text-gray-700">{event.location} - Rs. {event.ticketPrice}</p>
                  </div>
                  <button
                    onClick={() => handleRepeatClick(event)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <FaRedo />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">You haven't created any events yet.</p>
          )}
        </div>
      </main>

      {repeatingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Repeat Event</h2>
            <div className="space-y-2">
              <label className="font-semibold">Title</label>
              <input type="text" className="w-full p-2 border rounded mb-2 bg-gray-200" value={newEvent.title} disabled />
              <label className="font-semibold">Date</label>
              <input type="date" className="w-full p-2 border rounded mb-2" value={newEvent.eventDate} onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })} />
              <label className="font-semibold">Time</label>
              <input type="time" className="w-full p-2 border rounded mb-2" value={newEvent.eventTime} onChange={(e) => setNewEvent({ ...newEvent, eventTime: e.target.value })} />
              <label className="font-semibold">Address</label>
              <input type="text" className="w-full p-2 border rounded mb-2" value={newEvent.address} onChange={(e) => setNewEvent({ ...newEvent, address: e.target.value })} />
              
              
              <label className="font-semibold">Image</label>
              <input type="file" className="w-full p-2 border rounded mb-2" onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRepeatingEvent(null)} className="px-4 py-2 bg-gray-400 rounded">Cancel</button>
              <button onClick={handleCreateEvent} className="px-4 py-2 bg-blue-600 text-white rounded">Create Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;