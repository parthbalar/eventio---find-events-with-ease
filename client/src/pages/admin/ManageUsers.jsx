import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleDelete = async (userId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error('Error deleting user');
        console.error('Error deleting user:', err);
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <ToastContainer autoClose={1000} />
      <h1 className="text-2xl font-bold mb-4">Registered Users</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left border-b">Name</th>
              <th className="p-2 text-left border-b">Email</th>
              <th className="p-2 text-left border-b">Manage</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
