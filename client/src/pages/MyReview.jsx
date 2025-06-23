// import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import Swal from "sweetalert2";
import { UserNavbar } from "../components/UserNavbar";
import ReviewForm from "../components/ReviewForm";
// import { FaStar } from "react-icons/fa"; // Import Star Icon
// import { AiOutlineStar,AiFillStar } from "react-icons/ai";

export default function MyReview() {
  const { user } = useContext(UserContext);
  const [userTickets, setUserTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  // const [rating, setRating] = useState(0);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  // const [pendingReview, setPendingReview] = useState(null);


  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/tickets/user/${user._id}`
      );
      setUserTickets(response.data);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load tickets. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // const handleStarClick = (selectedRating) => {
  //   setReview((prevReview) => ({ ...prevReview, rating: selectedRating }));
  // };
  

  const isTodayOrBefore = (eventDate) => {
    const eventDateTime = new Date(eventDate);
    const now = new Date();
    const eventDateOnly = new Date(
      eventDateTime.getFullYear(),
      eventDateTime.getMonth(),
      eventDateTime.getDate()
    );
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return eventDateOnly >= nowDateOnly;
  };


  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setReview({ rating: 0, comment: "" });
    setTimeout(() => {
      setSelectedTicket(null);
    }, 500);
  
  };

  useEffect(() => {
  }, [selectedTicket]);

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <UserNavbar />

        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-6">
            Welcome, {user?.name || "User"}
          </h2>

          <h3 className="text-2xl font-bold mb-6">Review :</h3>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-600">Past Tickets</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {userTickets
              .filter(ticket => !isTodayOrBefore(ticket.ticketDetails.eventdate))
              .map(ticket => (
                <div
                  key={ticket._id}
                  className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
                >
                  <div className="flex gap-6 items-center">
                    {ticket.ticketDetails.qr ? (
                      <img
                        src={ticket.ticketDetails.qr}
                        alt="QR Code"
                        className="w-28 h-28 object-cover rounded-lg border border-gray-300 shadow-sm"
                      />
                    ) : (
                      <p className="text-red-500">QR Code not available</p>
                    )}
                    <div className="text-sm space-y-2">
                      <p>
                        <span className="font-semibold text-gray-700">Event Name:</span>{" "}
                        <span className="text-blue-700 font-bold">{ticket.ticketDetails.eventname.toUpperCase()}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Date & Time:</span>{" "}
                        {ticket.ticketDetails.eventdate.split("T")[0]}, {ticket.ticketDetails.eventtime}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(ticket)}
                    className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-800 transition duration-300"
                  >
                    Review Event
                  </button>
                </div>
              ))}
          </div>
        </main>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedTicket && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <ReviewForm selectedTicket={selectedTicket} closeModal={closeModal} />

    </div>
  </div>
)}

    </>
  );
}
