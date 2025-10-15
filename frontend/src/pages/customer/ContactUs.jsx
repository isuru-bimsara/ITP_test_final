import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setResponseMessage("");

    try {
      const { data } = await axios.post("/api/contacts", formData); // matches your backend
      setResponseMessage(data.message || "Thank you! We'll get back to you soon.");
      setFormData({ fullName: "", email: "", phoneNumber: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setResponseMessage(
        error.response?.data?.message || "Error submitting message. Please try again."
      );
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-800 mb-4">📞 Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Send us a Message</h2>

            {responseMessage && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                {responseMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Phone Number * (10 digits)</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  placeholder="0712345678 "
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 via-blue-500 to-blue-400 hover:from-blue-500 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitted ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">Email</h3>
                    <p className="text-gray-600">support@feedbackapp.com</p>
                    <p className="text-gray-600">info@feedbackapp.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">Phone</h3>
                    <p className="text-gray-600">+94763516184</p>
                    <p className="text-gray-600">+94767014133</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">Address</h3>
                    <p className="text-gray-600">
                      123 Mernstraint Street<br />
                      Tech City, TC 12345<br />
                      Colombo7
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">🕒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="text-xl">✨</span>
                  <span>24/7 Customer Support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-xl">🚀</span>
                  <span>Fast Response Time</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-xl">💎</span>
                  <span>Premium Quality Service</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-xl">🎯</span>
                  <span>Personalized Solutions</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
