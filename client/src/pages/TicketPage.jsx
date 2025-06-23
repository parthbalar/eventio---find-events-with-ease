import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { UserNavbar } from "../components/UserNavbar";

export default function TicketPage() {
  const { user } = useContext(UserContext);
  const [userTickets, setUserTickets] = useState([]);

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

      // Fetch event details for each ticket
      const ticketsWithEvents = await Promise.all(
        response.data.map(async (ticket) => {
          try {
            const eventResponse = await axios.get(
              `http://localhost:4000/api/events/name/${ticket.ticketDetails.eventname}`
            );
            return {
              ...ticket,
              eventId: eventResponse.data._id
            };
          } catch (error) {
            console.error("Error fetching event details:", error);
            return ticket;
          }
        })
      );

      setUserTickets(ticketsWithEvents);
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

  const downloadTicket = (ticket) => {
    const doc = new jsPDF();
  
    // Set document title with the logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Eventio", 20, 20); // Logo as text (Eventio)
  
    // Add a horizontal line under the logo
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  
    // Add the ticket details with a more organized layout
    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: [
        ["Event Name", ticket.ticketDetails.eventname.toUpperCase()],
        [
          "Date & Time",
          `${ticket.ticketDetails.eventdate.split("T")[0]}, ${ticket.ticketDetails.eventtime}`,
        ],
        ["Name", ticket.ticketDetails.name.toUpperCase()],
        // ["Price", `Rs. ${ticket.ticketDetails.ticketprice}`], // Optional: Uncomment if price is needed
        ["Tickets", `${ticket.ticketDetails.tickets}`],
        [
          "Seats",
          ticket.ticketDetails.selectedSeats
            ? ticket.ticketDetails.selectedSeats.sort().join(", ")
            : "N/A",
        ],
        ["Email", ticket.ticketDetails.email],
        ["Ticket ID", ticket._id],
      ],
      theme: "grid", // Grid theme for better readability
      headStyles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 12, fontStyle: "bold" },
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] },
      margin: { top: 30, left: 20, right: 20 },
    });
  
    // Add QR code image if available
    if (ticket.ticketDetails.qr) {
      const qrImage = new Image();
      qrImage.crossOrigin = "Anonymous";
      qrImage.src = ticket.ticketDetails.qr;
      qrImage.onload = () => {
        doc.addImage(qrImage, "PNG", 70, doc.autoTable.previous.finalY + 10, 60, 60);
        doc.save(`Ticket_${ticket._id}.pdf`);
      };
    } else {
      doc.save(`Ticket_${ticket._id}.pdf`);
    }
  };
  

  const isTodayOrBefore = (eventDate) => {
    const eventDateTime = new Date(eventDate);
    const now = new Date();

    const eventDateOnly = new Date(
      eventDateTime.getFullYear(),
      eventDateTime.getMonth(),
      eventDateTime.getDate()
    );

    const nowDateOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    return eventDateOnly >= nowDateOnly;
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <UserNavbar />

        <main className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6">
            Welcome, {user?.name || "User"}
          </h2>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-600">
            Tickets
          </h3>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {userTickets.length > 0 &&
              userTickets
                .filter((ticket) => isTodayOrBefore(ticket.ticketDetails.eventdate))
                .map((ticket) => (
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
                          <span className="font-semibold text-gray-700">
                            Event Name:
                          </span>{" "}
                          <span className="text-blue-700 font-bold">
                            {ticket.ticketDetails.eventname.toUpperCase()}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">
                            Date & Time:
                          </span>{" "}
                          {ticket.ticketDetails.eventdate.split("T")[0]},{" "}
                          {ticket.ticketDetails.eventtime}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">
                            Name:
                          </span>{" "}
                          {ticket.ticketDetails.name.toUpperCase()}
                        </p>
                        {/* <p>
                          <span className="font-semibold text-gray-700">
                            Price:
                          </span>{" "}
                          <span className="text-green-700 font-bold">
                            Rs. {ticket.ticketDetails.ticketprice}
                          </span>
                        </p> */}
                        <p>
                          <span className="font-semibold text-gray-700">
                            Email:
                          </span>{" "}
                          {ticket.ticketDetails.email}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">
                            Tickets:
                          </span>{" "}
                          {ticket.ticketDetails.tickets}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">
                            Seats No:
                          </span>{" "}
                          <span className="text-purple-700 font-medium">
                            {ticket.ticketDetails.selectedSeats.sort().join(", ")}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">
                            Ticket ID:
                          </span>{" "}
                          <span className="text-gray-500">{ticket._id}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => downloadTicket(ticket)}
                        className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                      >
                        Download Ticket
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </main>
      </div>
    </>
  );
}
