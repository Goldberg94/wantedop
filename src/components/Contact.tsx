import React from 'react';
import { Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="mt-24 max-w-4xl mx-auto px-6 sm:px-12 lg:px-16 text-white">
      <div className="bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-lg p-6 sm:p-10 shadow-lg border border-gray-700">
        <h2 className="text-3xl text-center font-bold mb-6">Contact Us</h2>

        <p className="text-gray-300 text-center mb-6">
          Have questions or feedback? Feel free to reach out!
        </p>

        {/* Contact Form */}
        <form className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Your Name</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Your Email</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Your Message</label>
            <textarea
              rows={4}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="Enter your message"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#8B5CF6] text-white py-3 rounded-lg hover:bg-[#7C3AED] transition-colors"
          >
            Send Message
          </button>
        </form>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <a href="https://instagram.com" className="text-gray-300 hover:text-[#8B5CF6] transition-colors">
            <Instagram size={24} />
          </a>
          <a href="https://twitter.com" className="text-gray-300 hover:text-[#8B5CF6] transition-colors">
            <Twitter size={24} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
