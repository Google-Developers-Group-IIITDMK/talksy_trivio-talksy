import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
// Import logo directly from the assets directory
const TalksieLogoSVG = '/assets/talksie.png'; // Access it from the public directory

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={TalksieLogoSVG} alt="TalkSie Logo" className="logo-image" />
          </Link>
        </div>
        
        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <Link to="/" className="nav-link" style={{"--i": 0}}>Home</Link>
          <Link to="/characters" className="nav-link" style={{"--i": 1}}>Characters</Link>
        </div>
        
        <div className="navbar-actions">
          <Link to="/user-info" className="btn-try-now">Try Now</Link>
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'is-active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;