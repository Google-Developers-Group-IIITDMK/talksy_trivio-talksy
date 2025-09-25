import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 4000);

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-background"></div>
      <div className="floating-shapes">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`shape shape-${i + 1}`}></div>
        ))}
      </div>
      <div className="splash-content">
        <h1 className="app-title">TalkSie</h1>
        <p className="app-tagline">Talk to your favorite characters</p>
        <div className="loading-bar-container">
          <div 
            className="loading-bar" 
            style={{ width: `${loadingProgress}%` }}
          >
            <div className="loading-glow"></div>
          </div>
        </div>
        <p className="loading-text">
          <span className="loading-dot-animation">Loading magic</span> {loadingProgress}%
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;