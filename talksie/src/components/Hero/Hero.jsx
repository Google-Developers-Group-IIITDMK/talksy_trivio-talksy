import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Hero.css';

const HeroSection = () => {
  const laptopRef = useRef(null);
  const screenRef = useRef(null);
  const heroTextRef = useRef(null);
  const textChangeRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);

 const humorousTexts = [
  "PJ pe bhi hassenge",
  "Star Wars theory free me sunenge",
  "Eye contact ka tension nahi",
  "Dad jokes = comedy show",
  "Pajama me baat karo",
  "Kabhi udhaar nahi maangenge",
  "Khate-peete baat karo"
];


  useEffect(() => {
    // Initialize GSAP animations
    const timeline = gsap.timeline({
      defaults: { duration: 1.2, ease: "power3.out" }
    });

    // Animate laptop appearance
    if (laptopRef.current) {
      timeline.fromTo(laptopRef.current, 
        { y: 100, opacity: 0, rotationX: 15, rotationY: -20 }, 
        { y: 0, opacity: 1, rotationX: 8, rotationY: -12, duration: 1.5 }
      );
    }

    // Animate screen glow
    if (screenRef.current) {
      gsap.to(screenRef.current, {
        boxShadow: '0 0 40px rgba(108, 99, 255, 0.4), inset 0 0 30px rgba(99, 255, 218, 0.3)',
        repeat: -1,
        yoyo: true,
        duration: 3
      });
    }

    // Text stagger animation
    if (heroTextRef.current) {
      timeline.fromTo(
        heroTextRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2 },
        "-=0.5"
      );
    }

    // 3D hover effect for laptop
    if (laptopRef.current) {
      const laptop = laptopRef.current;
      const container = laptop.parentElement;
      
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        gsap.to(laptop, {
          rotationY: -12 + x * 8,
          rotationX: 8 - y * 5,
          duration: 0.8,
          ease: "power1.out"
        });
      });
      
      container.addEventListener('mouseleave', () => {
        gsap.to(laptop, {
          rotationY: -12,
          rotationX: 8,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)"
        });
      });
    }

    // Setup text rotation interval
    const textInterval = setInterval(() => {
      if (textChangeRef.current) {
        gsap.to(textChangeRef.current, {
          opacity: 0, 
          y: -20, 
          duration: 0.5, 
          onComplete: () => {
            setTextIndex(prev => (prev + 1) % humorousTexts.length);
            gsap.to(textChangeRef.current, {opacity: 1, y: 0, duration: 0.5, delay: 0.1});
          }
        });
      }
    }, 5000);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>
        <div className="floating-shape shape5"></div>
      </div>
      
      <div className="hero-content container">
        <div className="hero-text" ref={heroTextRef}>
          <h1 className="hero-title">Talk to Your Favorite Characters</h1>
          <div className="humorous-text-container">
            <h3 className="humorous-text" ref={textChangeRef}>
              {humorousTexts[textIndex]}
            </h3>
          </div>
          <h2 className="hero-subtitle">
            Experience lifelike conversations with AI-driven 3D avatars.
          </h2>
          <button className="cta-button">
            <span>Get Started</span>
            <div className="button-glow"></div>
          </button>
        </div>
        
        <div className="hero-image">
          <div className="laptop-container">
            <div className="laptop" ref={laptopRef}>
              <div className="laptop-lid">
                <div className="laptop-logo"></div>
              </div>
              <div className="screen" ref={screenRef}>
                <div className="screen-bezel">
                  <div className="camera"></div>
                </div>
                <div className="screen-content">
                  <div className="model-video-container">
                    <img 
                      src="/assets/hero-character.gif" 
                      alt="Hero Character" 
                      className="model-video"
                    />
                    <div className="screen-glare"></div>
                  </div>
                  <div className="conversation-overlay">
                    <div className="character">
                      <div className="character-avatar"></div>
                      <div className="speech-bubble character-bubble">
                        Hello there! Ready for an adventure at Hogwarts?
                      </div>
                    </div>
                    <div className="user">
                      <div className="user-avatar"></div>
                      <div className="speech-bubble user-bubble">
                        I can't believe I'm talking to you!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="laptop-base">
                <div className="laptop-bottom"></div>
                <div className="laptop-keyboard">
                  <div className="touchpad"></div>
                  <div className="keyboard-keys"></div>
                </div>
              </div>
              <div className="laptop-shadow"></div>
            </div>
            <div className="holographic-effect"></div>
            <div className="laptop-reflection"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
