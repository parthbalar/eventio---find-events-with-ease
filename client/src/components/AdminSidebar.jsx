import { Link, useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // or just remove tokens
    navigate('/');
  };

  return (

    <div className="w-64 h-100vh bg-blue-600 text-white shadow-lg px-6 py-8">
      <h2 className="text-3xl font-semibold mb-10 text-center">
        <Link to="/admin" className="text-white hover:text-yellow-400 transition duration-300">Admin Panel</Link>
      </h2>
      <nav className="flex flex-col gap-6">
        <Link
          to="/admin"
          className="text-lg hover:text-yellow-400"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/events"
          className="text-lg hover:text-yellow-400"
        >
          Manage Events
        </Link>
        <Link
          to="/admin/users"
          className="text-lg hover:text-yellow-400"
        >
          Manage Users
        </Link>
        <Link
          to="/admin/contacts"
          className="text-lg hover:text-yellow-400"
        >
          Manage Contacts
        </Link>
        <Link
          to="/admin/tickets"
          className="text-lg hover:text-yellow-400"
        >
          Manage Tickets
        </Link>
        <button
          onClick={handleLogout}
          className="mt-8 text-left text-lg text-red-400"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
