import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, message } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      Swal.fire("Error", "All fields are required!", "error");
      return false;
    }

    if (!emailRegex.test(email)) {
      Swal.fire("Error", "Please enter a valid email address!", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:4000/api/contact", formData);
      if (response.data.success) {
        Swal.fire({
          title: "Success",
          text: "Message sent successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        Swal.fire("Error", "Failed to send message.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong. Please try again later.", "error");
    }
  };

  return (
    <section className="bg-gray-100 text-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-4xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          📩 Get in Touch
        </motion.h2>
        <motion.p
          className="text-lg max-w-3xl mx-auto mb-10 text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Have questions or need assistance? Send us a message, and we’ll get back to you soon!
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-xl p-8 max-w-3xl mx-auto text-left"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <label className="block font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter your message"
              required
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Send Message
          </motion.button>
        </motion.form>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: <FaMapMarkerAlt className="text-blue-500 text-3xl mx-auto" />,
              title: "Visit Us",
              text: "123 Event Street, Baroda, India"
            },
            {
              icon: <FaPhoneAlt className="text-blue-500 text-3xl mx-auto" />,
              title: "Call Us",
              text: "+91 985xx xxxxx"
            },
            {
              icon: <FaClock className="text-blue-500 text-3xl mx-auto" />,
              title: "Working Hours",
              text: "Mon - Fri: 9:00 AM - 6:00 PM"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              {item.icon}
              <p className="text-lg font-semibold mt-2">{item.title}</p>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center space-x-6 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-700 hover:text-blue-600 text-2xl">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-700 hover:text-blue-400 text-2xl">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-700 hover:text-blue-700 text-2xl">
            <FaLinkedin />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
