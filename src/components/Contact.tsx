import React, { useState } from 'react';
import { Instagram, Twitter } from 'lucide-react';

const Contact = () => {
  const [comingSoon, setComingSoon] = useState(false);

  const handleSocialClick = () => {
    setComingSoon(true);
    setTimeout(() => {
      setComingSoon(false);
    }, 2000); // Message will disappear after 2 seconds
  };

  return (
    <section id="contact" className="mt-24 max-w-4xl mx-auto sm:px-12 lg:px-16 text-white">
      <div className="bg-gradient-to-b from-[#1e1f2b] to-[#151621] 
  backdrop-blur-lg border border-[rgba(255,255,255,0.1)] 
  rounded-xl sm:rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.3)] 
  p-6 sm:p-8 space-y-4">

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
              className="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Your Email</label>
            <input
              type="email"
              className="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Your Message</label>
            <textarea
              rows={4}
              className="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
              placeholder="Enter your message"
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] 
            text-white font-semibold p-4 rounded-xl sm:rounded-2xl 
            flex items-center justify-center gap-2 
            hover:opacity-90 transition-all shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Send Message
          </button>
        </form>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={handleSocialClick}
            className="text-gray-300 hover:text-[#8B5CF6] transition-colors"
          >
            <Instagram size={24} />
          </button>
          <button
            onClick={handleSocialClick}
            className="text-gray-300 hover:text-[#8B5CF6] transition-colors"
          >
            <Twitter size={24} />
          </button>
        </div>

        {comingSoon && (
          <div className="text-center text-lg text-[#8B5CF6] mt-4">
            Coming soon...
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
