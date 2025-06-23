import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageContacts = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/contact-messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This message will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/admin/contact-messages/${id}`);
        toast.success('Message deleted successfully');
        fetchMessages(); // Refresh after delete
      } catch (err) {
        toast.error('Error deleting message');
        console.error('Delete failed:', err);
      }
    }
  };

  const filteredMessages = messages.filter((msg) =>
    `${msg.name} ${msg.email} ${msg.message}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <ToastContainer autoClose={1000} />
      <h1 className="text-2xl font-bold mb-4">Contact Form Messages</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {filteredMessages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div key={msg._id} className="p-4 border rounded-lg shadow-md relative">
              <p><strong>Name:</strong> {msg.name}</p>
              <p><strong>Email:</strong> {msg.email}</p>
              <p><strong>Message:</strong> {msg.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Submitted on: {new Date(msg.createdAt).toLocaleString()}
              </p>
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => handleDelete(msg._id)}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageContacts;
