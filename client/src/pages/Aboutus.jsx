import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaLock, FaUsers, FaQuestionCircle, FaTicketAlt, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/logo.png';

export default function AboutUs() {
  return (
    <section className="bg-gray-100 py-16 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <motion.img src={logo} alt="Eventio Logo" className="mx-auto h-16 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.h2 className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >About Eventio</motion.h2>
        <motion.p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          Eventio is your go-to platform for seamless event management and ticketing. Whether you're organizing a conference, concert, or meetup, we provide a hassle-free solution to create, manage, and sell tickets for your events.
        </motion.p>
        
        <div className="mt-8 flex justify-center gap-6">
          {[{
            icon: <FaChartLine className="text-blue-500 text-4xl" />, title: "Real-Time Analytics", text: "Get live insights into ticket sales and attendee engagement."
          }, {
            icon: <FaLock className="text-green-500 text-4xl" />, title: "Secure Payments", text: "Our platform ensures secure and seamless transactions for ticket purchases."
          }, {
            icon: <FaUsers className="text-purple-500 text-4xl" />, title: "User-Friendly Interface", text: "Easily navigate through our intuitive platform for hassle-free event management."
          }].map((item, index) => (
            <motion.div key={index} className="p-6 bg-white shadow-lg rounded-xl max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {item.icon}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 py-12 px-6 bg-gray-200 rounded-lg max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission & Vision</h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our mission is to revolutionize the event industry by providing an all-in-one platform that simplifies event management, enhances audience engagement, and ensures seamless ticketing experiences.
          </p>
        </div>

        <div className="mt-16 py-12 px-6 bg-white rounded-lg max-w-5xl mx-auto text-center shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          {[{
            icon: <FaTicketAlt className="text-blue-500 text-2xl mr-2" />,
            question: "How do I create an event on Eventio?",
            answer: "Simply sign up, navigate to the event creation section, and fill in the necessary details. Your event will be live in minutes!"
          }, {
            icon: <FaQuestionCircle className="text-purple-500 text-2xl mr-2" />,
            question: "Can I refund a ticket?",
            answer: "Refund policies are set by event organizers. Please check the event details or contact the organizer directly."
          }, {
            icon: <FaEnvelope className="text-red-500 text-2xl mr-2" />,
            question: "How do I contact Eventio support?",
            answer: "You can reach out to us via our support page or email us at support@eventio.in."
          }].map((faq, index) => (
            <motion.div key={index} className="mb-6 text-left max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <h4 className="text-xl font-semibold text-gray-800 flex items-center">{faq.icon} {faq.question}</h4>
              <p className="text-gray-600 mt-2">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
