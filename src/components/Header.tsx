import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [openItem, setOpenItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;

      setIsVisible(!isScrollingDown || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setOpenItem(openItem === sectionId ? null : sectionId);
    document.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-[rgba(15,15,25,0.6)] backdrop-blur-md py-4 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Mobile header (logo only) */}
      <div className="md:hidden max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center">
          <a href="/" className="flex items-center gap-2">
            <img 
              src="https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Berries_Logo2.png" 
              alt="One Piece Logo" 
              className="w-10 h-10"
            />
            <span className="text-[#dfd0bd] text-3xl font-['Pirata_One']">Wanted Maker</span>
          </a>
        </div>
      </div>

      {/* Desktop header (full navigation) */}
      <div className="hidden md:block max-w-6xl mx-auto px-4 rounded-bl-[30px] rounded-br-[30px]">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img 
              src="https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Berries_Logo2.png" 
              alt="One Piece Logo" 
              className="w-10 h-10"
            />
            <span className="text-[#ded1bd] text-3xl font-['Pirata_One']">Wanted Maker</span>
          </a>
          
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <a 
                  href="#" 
                  onClick={scrollToTop}
                  className="text-white font-bold font-hanken-grotesk text-xl hover:text-[#DED1BD] transition-colors"
                >
                  Create a Wanted Poster
                </a>
              </li>
              <li>
                <a 
                  href="#faq"
                  onClick={(e) => scrollToSection(e, 'faq')}
                  className="text-white font-bold font-hanken-grotesk text-xl hover:text-[#DED1BD] transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="text-white font-bold font-hanken-grotesk text-xl hover:text-[#DED1BD] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;