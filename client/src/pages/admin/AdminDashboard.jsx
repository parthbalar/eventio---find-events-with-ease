import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


// for admin login 
// adminEmail = admin@example.com
// adminPassword = Admin@123

const AdminDashboard = () => {
  const [stats, setStats] = useState({ events: 0, users: 0, contacts: 0 });

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardStyle = "bg-white shadow rounded-lg p-6 text-center";
  const numberStyle = "text-3xl font-bold text-indigo-600";
  const labelStyle = "mt-2 text-gray-600";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <Link to="/admin/events">
            <div className={numberStyle}>{stats.events}</div>
            <div className={labelStyle}>Total Events</div>
          </Link>
        </div>
        <div className={cardStyle}>
          <Link to="/admin/users">
            <div className={numberStyle}>{stats.users}</div>
            <div className={labelStyle}>Total Users</div>
          </Link>
        </div>
        <div className={cardStyle}>
          <Link to="/admin/contacts">
            <div className={numberStyle}>{stats.contacts}</div>
            <div className={labelStyle}>Contact Messages</div>
          </Link>
        </div>
        <div className={cardStyle}>
          <Link to="/admin/tickets">
            <div className={numberStyle}>{stats.tickets}</div>
            <div className={labelStyle}>Tickets</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
