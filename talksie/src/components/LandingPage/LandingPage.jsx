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
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Start Your Journey?</h2>
              <p>Join TalkSie today and begin meaningful conversations with fascinating characters from across time and imagination.</p>
              <div className="cta-buttons">
                <a href="/user-info" className="btn-cta-primary">
                  Get Started Free
                  <span className="btn-glow"></span>
                </a>
                <a href="/pricing" className="btn-cta-secondary">
                  View Pricing
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
              <div className="cta-users">
                <div className="user-avatars">
                  {[1, 2, 3, 4].map((idx) => (
                    <div className="user-avatar" key={idx} style={{ zIndex: 5 - idx }}>
                      <img src={`/assets/user-${idx}.jpg`} alt={`User ${idx}`} />
                    </div>
                  ))}
                </div>
                <p className="user-count">Join 50,000+ users talking to characters</p>
              </div>
            </div>
            <div className="cta-image">
              <div className="image-wrapper">
                <img src="/assets/cta-image.png" alt="Start talking with characters" />
                <div className="image-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;