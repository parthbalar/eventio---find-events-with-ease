import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 text-center">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-start gap-6 md:text-left">
        <div className="max-w-sm">
          {/* <img src={logo} alt="Eventio Logo" className="h-12 mb-4" /> */}
          <h2 className="text-xl font-semibold mb-4">About Us</h2>
          <p className="text-sm leading-relaxed">
          Eventio helps visitors discover and book events effortlessly while allowing hosts to showcase their events. With a verified host system, we ensure a secure and engaging event experience.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="flex flex-col space-y-2">
            <li><Link to="/" className="text-gray-300 hover:text-orange-500">Home</Link></li>
            <li><Link to="/Aboutus" className="text-gray-300 hover:text-orange-500">About Us</Link></li>
            <li><Link to="/events" className="text-gray-300 hover:text-orange-500">Events</Link></li>
            <li><Link to="/Contactus" className="text-gray-300 hover:text-orange-500">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
          <ul className="flex flex-col space-y-3">
            <li className="flex items-center space-x-2">
              <FaFacebook className="text-orange-500" /><a href="https://www.facebook.com/" target='_blank' className="text-gray-300 hover:text-orange-500">Facebook</a>
            </li>
            <li className="flex items-center space-x-2">
              <FaTwitter className="text-orange-500" /><a href="https://x.com/home" target='_blank' className="text-gray-300 hover:text-orange-500">Twitter</a>
            </li>
            <li className="flex items-center space-x-2">
              <FaLinkedin className="text-orange-500" /><a href="https://www.linkedin.com/feed/" target='_blank' className="text-gray-300 hover:text-orange-500">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-700 pt-4 text-sm">
        <p>&copy; 2025 Eventio. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
