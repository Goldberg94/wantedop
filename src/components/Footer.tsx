import React, { useState, useEffect } from 'react';
import { Instagram, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [posterCount, setPosterCount] = useState(0);
  const [comingSoon, setComingSoon] = useState(false);
  
  // Get the actual download count from localStorage
  useEffect(() => {
    // Check if we have a global download count in localStorage
    const storedCount = localStorage.getItem('globalPosterCount');
    if (storedCount) {
      setPosterCount(parseInt(storedCount, 10));
    }
    
    // Listen for the custom event that's triggered when a poster is downloaded
    const handlePosterDownload = (e: CustomEvent) => {
      setPosterCount(prevCount => {
        const newCount = prevCount + 1;
        localStorage.setItem('globalPosterCount', newCount.toString());
        return newCount;
      });
    };

    // Add event listener for poster downloads
    window.addEventListener('posterDownloaded' as any, handlePosterDownload);
    
    return () => {
      window.removeEventListener('posterDownloaded' as any, handlePosterDownload);
    };
  }, []);

  // Add effect to handle the obfuscated terms link
  useEffect(() => {
    // This is the obfuscated script that will handle the terms link click
    const handleTermsClick = (e: MouseEvent) => {
      e.preventDefault();
      window.location.href = '/' + String.fromCharCode(116, 101, 114, 109, 115); // "terms"
    };
    
    // Find the terms link and attach the event listener
    const termsLink = document.querySelector('a[data-info="legal"]');
    if (termsLink) {
      termsLink.addEventListener('click', handleTermsClick as any);
    }
    
    // Cleanup
    return () => {
      if (termsLink) {
        termsLink.removeEventListener('click', handleTermsClick as any);
      }
    };
  }, []);

  const handleSocialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setComingSoon(true);
    setTimeout(() => {
      setComingSoon(false);
    }, 2000); // Message will disappear after 2 seconds
  };

  // Obfuscated link handling
  const handleObfuscatedLink = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'faq' || target === 'contact') {
      document.querySelector(`#${target}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1a1b26] border-t border-[rgba(255,255,255,0.1)] py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Footer Top Section with Logo and Social */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <img 
              src="https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Berries_Logo2.png" 
              alt="One Piece Logo" 
              className="w-10 h-10"
            />
            <span className="text-[#ded1bd] text-3xl font-['Pirata_One']">Wanted Maker</span>
          </div>
          
          <a 
            href="#" 
            onClick={handleSocialClick}
            className="bg-[#f4e4bc] text-[#1a1b26] font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <Instagram size={20} />
            Follow our community on Instagram!
          </a>
        </div>
        
        {/* Divider */}
        <div className="border-t border-[rgba(255,255,255,0.1)] my-8"></div>
        
        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column - Links */}
          <div>
            <nav className="flex flex-col space-y-3">
              <a 
                href="#" 
                onClick={(e) => handleObfuscatedLink(e, 'home')}
                className="text-white hover:text-[#dfd0bd] transition-colors"
              >
                Create a Wanted Poster
              </a>
              <a 
                href="#faq" 
                onClick={(e) => handleObfuscatedLink(e, 'faq')}
                className="text-white hover:text-[#dfd0bd] transition-colors"
              >
                FAQ
              </a>
              <a 
                href="#contact" 
                onClick={(e) => handleObfuscatedLink(e, 'contact')}
                className="text-white hover:text-[#dfd0bd] transition-colors"
              >
                Contact
              </a>
              {/* Obfuscated terms link */}
              <a 
                href="#" 
                className="text-white hover:text-[#dfd0bd] transition-colors"
                data-info="legal"
              >
                Terms & Conditions
              </a>
            </nav>
          </div>
          
          {/* Right Column - Description */}
          <div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Create custom One Piece wanted posters with our easy-to-use generator! Choose design options and select all the information for a wanted poster. Create unique posters and enhance your One Piece fan experience!
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="mailto:hello@cartoontoi.fr" className="text-[#8B5CF6] hover:text-white transition-colors flex items-center gap-2">
                <Mail size={18} />
                Mail
              </a>
              <a href="#" onClick={handleSocialClick} className="text-[#8B5CF6] hover:text-white transition-colors flex items-center gap-2">
                <Twitter size={18} />
                Twitter
              </a>
              <a href="#" onClick={handleSocialClick} className="text-[#8B5CF6] hover:text-white transition-colors flex items-center gap-2">
                <Instagram size={18} />
                Instagram
              </a>
            </div>
          </div>
        </div>
        
        {/* Coming Soon Message */}
        {comingSoon && (
          <div className="text-center text-lg text-[#8B5CF6] mt-4">
            Coming soon...
          </div>
        )}
        
        {/* Divider */}
        <div className="border-t border-[rgba(255,255,255,0.1)] my-8"></div>
        
        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Wanted Maker
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-[#DED1BD] flex items-center gap-2">
              {posterCount.toLocaleString()} posters created
              <img 
                src="https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Berries_Logo2.png" 
                alt="One Piece Logo" 
                className="w-6 h-6"
              />
            </span>
          </div>
        </div>
        
        {/* Credits */}
        <div className="text-center mt-8 text-gray-500 text-xs">
          <p>Created with <Heart size={12} className="inline text-red-500" /> for One Piece fans. This site is not affiliated with Toei Animation or Eiichiro Oda.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;