import {
  FaUser,
  FaSignOutAlt,
  FaCalendarDay,
  FaCaretRight,
  FaCaretDown,
  FaTicketAlt,
  FaMoneyBillAlt,
  FaBell,
} from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import profilephoto from "../assets/Profile.png";

const UserNavbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [user, setUser] = useState(null);
  const [todayRemindersCount, setTodayRemindersCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/profile", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const storedReminders = JSON.parse(localStorage.getItem("reminders")) || [];

    const today = new Date().toISOString().split("T")[0];

    const count = storedReminders.filter((reminder) => {
      return reminder.eventdate.split("T")[0] === today;
    }).length;

    setTodayRemindersCount(count);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("userEmail");
    await axios.post("/logout");
    navigate("/");
    window.location.reload();
  };

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const profilePic = user?.picture
    ? user.picture.startsWith("https") || user.picture.startsWith("data:image")
      ? user.picture
      : `http://localhost:4000/${user.picture}`
    : profilephoto;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen h-100vh p-5 shadow-lg">
      <Link
        to={"/"}
        className="flex items-center justify-center gap-2 text-lg font-bold transition-transform duration-300"
      >
        <img
          src="../src/assets/logo-white.png"
          alt="Logo"
          className="w-26 h-10 object-contain"
        />
      </Link>

      <div className="flex flex-col items-center justify-center mt-6">
        {user === null ? (
          <div className="w-28 h-28 bg-gray-700 rounded-full animate-pulse" />
        ) : (
          <img
            src={profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-white"
          />
        )}
        <h1 className="text-xl mt-4 font-bold mb-6 text-center">Dashboard</h1>
      </div>

      <nav>
        <ul className="space-y-4">
          <li
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
              location.pathname === "/profile"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            <Link to="/useraccount" className="flex items-center gap-3 w-full">
              <FaUser />
              Profile
            </Link>
          </li>

          {/* Bookings Menu */}
          <li className="cursor-pointer">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-gray-700"
              onClick={() => toggleMenu("bookings")}
            >
              {openMenu === "bookings" ? <FaCaretDown /> : <FaCaretRight />}
              My Bookings
            </div>
          {openMenu === "bookings" && (
              <ul className="ml-6 space-y-2 mt-2">
                <li>
                  <Link
                    to="/wallet"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700"
                  >
                    <FaTicketAlt /> Tickets
                  </Link>
                </li>
                <li
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    location.pathname === "/review"
                      ? "bg-blue-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <Link to="/review" className="flex items-center gap-3 w-full">
                    <FaCalendarDay />
                    Ratings
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
              location.pathname === "/my-events"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            <Link to="/my-events" className="flex items-center gap-3 w-full">
              <FaCalendarDay />
              My Events
            </Link>
          </li>

          <li>
            <Link to="/subscription-details">
              <button className="flex items-center gap-2 px-4 py-2 font-bold text-white rounded-full cursor-pointer transition-all bg-[length:300%] bg-left bg-gradient-to-r from-[#880088] via-[#aa2068] via-[#cc3f47] via-[#de6f3d] via-[#f09f33] to-[#880088] hover:bg-[length:320%] hover:bg-right shadow-[2px_2px_3px_rgba(136,0,136,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" className="w-[23px] fill-[#f09f33] transition-all group-hover:fill-white">
                  <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z" />
                </svg>
                Premium 
              </button>
            </Link>
          </li>

          <li
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all hover:bg-red-600"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </li>
        </ul>

        <div className="mt-6">
          <Link to="/">
            <button className="w-full flex items-center gap-3 justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
              <IoMdArrowBack className="w-5 h-5" /> Back
            </button>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export { UserNavbar };
