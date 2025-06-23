import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import axios from "axios";
import { useState, useEffect } from "react";
import { UserContextProvider } from "./UserContext";
import UserAccountPage from "./pages/UserAccountPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddEvent from "./pages/AddEvent";
import EventPage from "./pages/EventPage";
import CalendarView from "./pages/CalendarView";
import OrderSummary from "./pages/OrderSummary";
import PaymentSummary from "./pages/PaymentSummary";
import TicketPage from "./pages/TicketPage";
import Aboutus from "./pages/Aboutus";
import Contactus from "./pages/Contactus";
import LikedEvent from "./pages/LikedEvent";
import CategoryPage from "./pages/CategoryPage";
import CityPage from "./pages/CityPage";
import Events from "./pages/Events";
import Layout from "./Layout";
import MyEvents from "./pages/MyEvents";
import MyReview from "./pages/MyReview";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Review from "./pages/Review";
import SeatSelection from "./pages/SeatSelection";

// admin imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminRoutes from "./components/AdminRoutes";
import ManageContacts from "./pages/admin/ManageContacts";
import ManageTickets from "./pages/admin/ManageTicket";

// NEW IMPORT: Subscription Page
import Subscription from "./pages/Subscription";
import SubscriptionDetails from "./pages/SubscriptionDetails";

// NEW IMPORT: CheckoutForm
import CheckoutForm from "./pages/CheckoutForm "; // Add this import for your CheckoutForm



// Axios setup
axios.defaults.baseURL = "http://localhost:4000/";
axios.defaults.withCredentials = true;

// Stripe key
const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY"); // Replace with your actual Stripe public key

function App() {
  // const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/createEvent" element={<AddEvent />} />
          <Route path="/event/:id" element={<EventPage/>} />
          <Route path="/events" element={<Events  events={events} loading={loading} />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/reviews" element={<Review />} />
          <Route path="/event/:id/ordersummary" element={<OrderSummary />} />
          <Route path="/Aboutus" element={<Aboutus />} />
          <Route path="/Contactus" element={<Contactus />} />
          <Route path="/like" element={<LikedEvent />} />
          <Route path="/Category/:categoryName" element={<CategoryPage />} />
          <Route path="/city/:CityName" element={<CityPage />} />

          {/* Subscription Page Route */}
          <Route path="/subscribe" element={<Subscription />} />
          <Route path="/subscription-details" element={<SubscriptionDetails />} />.
        </Route>

        <Route path="/useraccount" element={<UserAccountPage />} />
        <Route path="/wallet" element={<TicketPage />} />
        <Route path="/review" element={<MyReview />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

          {/* Admin Panel Routes */}
          <Route element={<AdminRoutes />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="contacts" element={<ManageContacts />} />
              <Route path="tickets" element={<ManageTickets />} />
            </Route>
          </Route>
       

        {/* Stripe PaymentSummary wrapped in Elements */}
        <Route
          path="/event/:id/ordersummary/paymentsummary"
          element={
            <Elements stripe={stripePromise}>
              <PaymentSummary />
            </Elements>
          }
        />

        {/* Seat selection route */}
        <Route path="/event/:id/seatselection" element={<SeatSelection />} />

        {/* Checkout Form Route (as a separate page if needed) */}
        <Route path="/checkoutForm" element={<CheckoutForm />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
