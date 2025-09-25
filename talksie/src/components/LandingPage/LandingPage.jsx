import React, { useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Hero from '../Hero/Hero';
import CharacterSlider from '../CharacterSlider/CharacterSlider';
import './LandingPage.css';

const LandingPage = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Character Slider Section */}
      <CharacterSlider />
      
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;