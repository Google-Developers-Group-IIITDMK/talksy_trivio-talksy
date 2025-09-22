import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  // Generate animated particles
  const particles = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${15 + Math.random() * 10}s`
      }}
    />
  ));

  return (
    <div className="splash-screen">
      {/* Animated Background */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 absolute inset-0">
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Animated Particles */}
      <div className="particles-container">
        {particles}
      </div>

      {/* Main Content */}
      <div className="splash-content">
        {/* Main Title */}
        <div className="title-container">
          <h1 className="main-title">
            <span className="title-t">T</span>
            <span className="title-a">a</span>
            <span className="title-l">l</span>
            <span className="title-k">k</span>
            <span className="title-s">S</span>
            <span className="title-i">i</span>
            <span className="title-e">e</span>
          </h1>
          <p className="subtitle animate-pulse-slow">
            Talk with Your Favorite Characters
          </p>
        </div>

        {/* Loading Bar */}
        <div className="loading-container">
          <div className="loading-bar-bg">
            <div 
              className="loading-bar-fill"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="loading-text">
            Loading... {loadingProgress}%
          </p>
        </div>

        {/* Shimmer Effect */}
        <div className="shimmer-overlay"></div>
      </div>
    </div>
  );
};

export default SplashScreen;