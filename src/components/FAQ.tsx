import React, { useState } from 'react';

const FAQ = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <section id="faq" className="mt-24">
      <h2 className="text-3xl text-center text-[#fff] mb-12 font-bold">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-3">
        {/* Supported formats */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'formats'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'formats' ? null : 'formats')
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">What image formats are supported?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            You can upload images in <strong>JPG, PNG, and WEBP</strong> formats. For the best results, use a high-resolution image with a clean background.
          </div>
        </details>

        {/* Adjusting image size and position */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'size'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'size' ? null : 'size');
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">Can I adjust my image's size and position?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            Yes! After uploading your image, you can <strong>move, resize, and zoom</strong> to ensure a perfect fit within the poster frame.
          </div>
        </details>

        {/* Poster styles */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'styles'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'styles' ? null : 'styles');
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">What Wanted poster styles are available?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            We offer several styles:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Classic</strong> (aged paper effect)</li>
              <li><strong>Holo</strong> (shiny and modern)</li>
              <li><strong>White Edition</strong> (clean, minimalist look)</li>
            </ul>
          </div>
        </details>

        {/* Background options */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'backgrounds'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'backgrounds' ? null : 'backgrounds');
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">What backgrounds can I choose from?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            You can select from One Piece-inspired locations, including:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Wano Kuni</strong></li>
              <li><strong>Dressrosa</strong></li>
              <li><strong>Skypiea</strong></li>
              <li><strong>Sabaody</strong></li>
              <li><strong>Ohara</strong></li>
              <li><strong>Water 7</strong></li>
            </ul>
            You can also <strong>upload your own background</strong> for a fully customized look!
          </div>
        </details>

        {/* File format and resolution */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'format'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'format' ? null : 'format');
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">What's the output format and quality?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            Your poster will be downloaded in <strong>high-resolution PNG format (2000x2828 px)</strong>, perfect for sharing or printing.
          </div>
        </details>

        {/* Printing the poster */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'print'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'print' ? null : 'print');
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">Can I print my Wanted poster?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            Yes! You can print your poster on <strong>A3/A4 paper, photo paper, or even a t-shirt</strong>.  
            Be sure to use a <strong>high-resolution image</strong> for the best results.
          </div>
        </details>

        {/* Sharing on social media */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'social'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'social' ? null : 'social');
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">Can I share my Wanted poster on social media?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            Absolutely! Share your Wanted poster on <strong>Instagram, TikTok, Twitter, or Facebook</strong>.  
            Use the hashtag <strong>#WantedOnePieceMaker</strong> for a chance to be featured!
          </div>
        </details>

        {/* Custom text options */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'customText'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'customText' ? null : 'customText');
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">Can I add custom text to my poster?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            Currently, the <strong>"Dead or Alive"</strong> text is fixed. However, you can <strong>customize the character's name and bounty</strong>  
            to create your own unique Wanted poster.
          </div>
        </details>

        {/* Editing after download */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'edit'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'edit' ? null : 'edit');
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">Can I edit my poster after downloading it?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            If you need to make changes, simply <strong>return to the editor</strong>, adjust your settings,  
            and download a new version.
          </div>
        </details>

        {/* Using as a personalized gift */}
        <details 
          className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
          open={openItem === 'gift'}
          onClick={(e) => {
            e.preventDefault();
            setOpenItem(openItem === 'gift' ? null : 'gift');
          }}
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <h3 className="text-xl text-white">Can I use this as a personalized gift?</h3>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 text-[#dbd0f5]">
            Yes! A custom Wanted poster makes a <strong>perfect gift for One Piece fans</strong> or  
            a unique surprise for a <strong>birthday, special occasion, or even as a joke</strong>.
          </div>
        </details>
      </div>
    </section>
  );
};

export default FAQ;