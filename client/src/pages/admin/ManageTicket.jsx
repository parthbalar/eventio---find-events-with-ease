import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/api/admin/ticket');
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  const handleDelete = async (ticketId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This ticket will be cancelled permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/admin/ticket/${ticketId}`);
        toast.success('Ticket cancelled successfully');
        fetchTickets();
      } catch (err) {
        toast.error('Error cancelling ticket');
      }
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.ticketDetails.eventname.toLowerCase().includes(search.toLowerCase()) ||
    ticket.ticketDetails.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="p-6">
      <ToastContainer autoClose={1500} />
      <h1 className="text-2xl font-bold mb-4">Manage Tickets</h1>

      <input
        type="text"
        placeholder="Search by event title or user email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 border rounded mb-4"
      />

      {filteredTickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border-b">User</th>
                <th className="p-2 text-left border-b">Email</th>
                <th className="p-2 text-left border-b">Event Title</th>
                <th className="p-2 text-left border-b">Total Price</th>
                <th className="p-2 text-left border-b">Purchase Date</th>
                <th className="p-2 text-left border-b">Manage</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{ticket.ticketDetails.name}</td>
                  <td className="p-2">{ticket.ticketDetails.email}</td>
                  <td className="p-2">{ticket.ticketDetails.eventname}</td>
                  <td className="p-2">₹{ticket.ticketDetails.ticketprice}</td>
                  <td className="p-2">{new Date(ticket.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(ticket._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageTickets;
