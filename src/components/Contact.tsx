import React, { useState } from 'react';
import { Instagram, Twitter } from 'lucide-react';

const Contact = () => {
  const [comingSoon, setComingSoon] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSocialClick = () => {
    setComingSoon(true);
    setTimeout(() => {
      setComingSoon(false);
    }, 2000); // Message will disappear after 2 seconds
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);

    try {
      // Create form data to send
      const formElement = e.target as HTMLFormElement;
      const formDataToSend = new FormData(formElement);
      
      // Send the form data using fetch
      const response = await fetch('https://formsubmit.co/hello@cartoontoi.fr', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Form submission failed');
      }
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
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
        <form 
          className="space-y-6" 
          onSubmit={handleSubmit}
          action="https://formsubmit.co/hello@cartoontoi.fr" 
          method="POST"
        >
          {/* FormSubmit configuration */}
          <input type="hidden" name="_subject" value="New message from Wanted Poster Generator" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_next" value={window.location.href} />
          
          <div>
            <label className="block text-gray-300 font-medium mb-2">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Your Message</label>
            <textarea
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
              placeholder="Enter your message"
              required
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] 
            text-white font-semibold p-4 rounded-xl sm:rounded-2xl 
            flex items-center justify-center gap-2 
            hover:opacity-90 transition-all shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Send Message
              </>
            )}
          </button>

          {submitSuccess && (
            <div className="text-center text-green-400 mt-4">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}

          {submitError && (
            <div className="text-center text-red-500 mt-4">
              There was an error sending your message. Please try again.
            </div>
          )}
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