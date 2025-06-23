import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/admin/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const confirm = await Swal.fire({
        title: 'Are you sure?',
        text: 'This event will be deleted permanently.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      });

      if (confirm.isConfirmed) {
        await axios.delete(`/api/admin/events/${eventId}`);
        Swal.fire('Deleted!', 'Event has been deleted.', 'success');
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (eventId) => {
    window.location.href = `/admin/edit-event/${eventId}`;
  };

  // Filter events based on search term
  const filteredEvents = events.filter((event) => {
    return event.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by event title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="p-2 border rounded w-full"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center text-gray-500 mt-10 text-lg">No events found.</div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-600">
                  <strong>Organized By:</strong> {event.organizedBy}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {event.eventTime}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Price:</strong> ₹{event.ticketPrice}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {event.category}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleEdit(event._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
