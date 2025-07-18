// Import Statements
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { FaUser } from "react-icons/fa";
import { BiSearch, BiLogOut } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { RiWallet3Fill, RiCalendarEventFill } from "react-icons/ri";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { MdOutlineWatchLater } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const searchInputRef = useRef();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const handleDocumentClick = (event) => {
  //     if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
  //       setSearchQuery("");
  //     }
  //   };
  //   document.addEventListener("click", handleDocumentClick);
  //   return () => document.removeEventListener("click", handleDocumentClick);
  // }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data based on user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
              params: {
                lat: latitude,
                lon: longitude,
                appid: API_KEY,
                units: "metric",
              },
            });
            setWeather(response.data);
          } catch (err) {
            console.error("Error fetching weather data:", err);
            setError("Weather unavailable");
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Location access denied");
        }
      );
    }
  }, []);

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     if (searchQuery.trim() === "") {
  //       setEvents([]);
  //       return;
  //     }
  //     try {
  //       const response = await axios.get("http://localhost:4000/api/events", {
  //         params: { search: searchQuery },
  //       });
  //       setEvents(response.data);
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //     }
  //   };

  //   const debounceTimeout = setTimeout(fetchEvents, 500);
  //   return () => clearTimeout(debounceTimeout);
  // }, [searchQuery]);

  // logout Function
  async function logout() {
    await axios.post("/logout");
    setUser(null);
    localStorage.clear();
    navigate("/");
  }

  // Updated Subscription Check
  async function handleNewEvent() {
    const userEmail = user?.email;

    if (userEmail) {
      try {
        const response = await axios.get(`http://localhost:4000/api/subscription/${userEmail}`);

        if (response.data.success && response.data.subscription.active) {
          navigate("/createEvent");
        } else {
          Swal.fire({
            icon: "info",
            title: "No Active Subscription",
            text: "You need an active subscription to create a new event.",
            showCancelButton: true,
            confirmButtonText: "Subscribe Now",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/subscribe");
            }
          });
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Email not matched / No subscription found
          Swal.fire({
            icon: "warning",
            title: "Subscription Not Found",
            text: "Your email is not subscribed. Please subscribe to continue.",
            showCancelButton: true,
            confirmButtonText: "Subscribe Now",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/subscribe");
            }
          });
        } else {
          console.error("Error checking subscription:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong while checking your subscription. Please try again.",
          });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please log in to create a new event.",
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/login");
      });
    }
  }

  return (
    <header className="flex py-4 px-8 justify-between items-center bg-blue-800 shadow-lg sticky top-0 z-50 text-white transition-all duration-300">
      {/* Logo */}
      <Link to={"/"} className="flex items-center gap-2 text-lg font-bold transition-transform duration-300">
        <img src="../src/assets/logo-white.png" alt="Logo" className="w-26 h-10 object-contain" />
      </Link>

      {/* Search Bar */}
      <div className="relative flex bg-white rounded-full py-2 px-6 w-1/4 gap-3 items-center shadow-md text-black focus-within:ring-2 ring-blue-400 transition-all duration-300">
        <BiSearch className="w-6 h-6 text-gray-600" />
        <input
          type="text"
          placeholder="Search..."
          // value={searchQuery}
          // onChange={(e) => setSearchQuery(e.target.value)}
          className="text-base outline-none w-full bg-transparent"
          ref={searchInputRef}
        />
        {events.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 max-h-60 overflow-y-auto z-50">
            {events.map((event) => (
              <Link
                key={event._id}
                to={`/event/${event._id}`}
                className="block px-4 py-2 hover:bg-gray-100 transition-all duration-300"
              >
                {event.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Location & Time */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FaMapMarkerAlt className="text-red-500 w-6 h-6" />
          {weather ? <span>{weather.name}</span> : <span>{error || "Loading..."}</span>}
        </div>

        <div className="flex items-center gap-2 min-w-[110px] justify-center">
          <MdOutlineWatchLater className="w-7 h-7 text-yellow-300" />
          <span className="text-lg font-semibold">{time}</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex gap-6 text-lg">
        <Link to={"/aboutus"} className="flex flex-col items-center hover:text-yellow-300 transition-transform duration-300">About</Link>
        <Link to={"/ContactUs"} className="flex flex-col items-center hover:text-yellow-300 transition-transform duration-300">Contact</Link>
        <Link to={"/reviews"} className="flex flex-col items-center hover:text-yellow-300 transition-transform duration-300">Reviews</Link>
      </div>

      {/* Profile & Menu */}
      <div className="relative">
        {!!user ? (
          <div className="flex items-center gap-4">
            <Link to={"/useraccount"} className="flex items-center gap-3 hover:text-yellow-300 transition-all duration-300">
              <FaUser className="w-8 h-8" />
              <span className="font-semibold text-lg">{user.name.toUpperCase()}</span>
            </Link>

            <div
              className="relative"
              onMouseEnter={() => {
                clearTimeout(window.menuTimeout);
                setIsMenuOpen(true);
              }}
              onMouseLeave={() => {
                window.menuTimeout = setTimeout(() => setIsMenuOpen(false), 200);
              }}
            >
              <HiOutlineMenuAlt3 className="w-6 h-6 cursor-pointer hover:rotate-180 transition-transform duration-300" />

              {isMenuOpen && (
                <div className="absolute right-0 mt-4 w-52 bg-white shadow-xl rounded-lg p-3 text-black border border-gray-200 transition-all duration-300">
                  <button
                    onClick={handleNewEvent}
                    className="flex w-full px-4 py-2 gap-2 items-center hover:bg-gray-100 rounded-md transition-all duration-300"
                  >
                    <IoMdAdd className="w-6 h-6" />
                    New Event
                  </button>

                  <Link to={"/wallet"} className="flex gap-2  px-4 py-2 hover:bg-gray-100 rounded-md transition-all duration-300">
                    <RiWallet3Fill className="w-6 h-6" />
                    Wallet
                  </Link>

                  <Link to={"/calendar"} className="flex gap-2  px-4 py-2 hover:bg-gray-100 rounded-md transition-all duration-300">
                    <RiCalendarEventFill className="w-6 h-6" />
                    Calendar
                  </Link>

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md transition-all duration-300"
                  >
                    <BiLogOut className="inline-block w-6 h-6 mr-2" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to={"/login"}>
            <button className="bg-yellow-300 text-black px-6 py-2 rounded-full shadow-md hover:bg-yellow-400 transition-all duration-300 font-semibold">
              Sign in
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
