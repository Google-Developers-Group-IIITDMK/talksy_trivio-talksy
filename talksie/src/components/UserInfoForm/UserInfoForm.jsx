import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserInfoForm.css';

const UserInfoForm = ({ onFormSubmit }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a typing animation effect when the component mounts
  useEffect(() => {
    const welcomeNames = ['there', 'friend', 'explorer', 'adventurer', 'traveler'];
    const randomName = welcomeNames[Math.floor(Math.random() * welcomeNames.length)];
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= randomName.length) {
        document.getElementById('welcomeName').textContent = `Hello, ${randomName.substring(0, i)}`;
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);

  const handleNameChange = (e) => {
    setUserName(e.target.value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateName = () => {
    if (!userName.trim()) {
      return 'Name is required';
    } else if (userName.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateName();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    
    // Add confetti effect
    createConfettiEffect();
    
    // Simulate API call
    setTimeout(() => {
      onFormSubmit({ name: userName });
      setIsSubmitting(false);
      // Navigate to character room after form submission
      navigate('/character-room');
    }, 1800);
  };
  
  // Create a confetti effect when form is submitted successfully
  const createConfettiEffect = () => {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-container';
    
    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 3}s`;
      piece.style.backgroundColor = getRandomColor();
      confetti.appendChild(piece);
    }
    
    document.querySelector('.user-info-screen').appendChild(confetti);
    
    // Remove the confetti after animation
    setTimeout(() => {
      document.querySelector('.confetti-container')?.remove();
    }, 4000);
  };
  
  const getRandomColor = () => {
    const colors = [
      '#6c63ff', // Primary purple
      '#63ffda', // Primary mint
      '#5a51d3', // Dark purple
      '#4ad6b6', // Dark mint
      '#ebe6ff', // Lavender light
      '#e6fff9', // Mint light
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="user-info-screen">
      {/* Floating Shapes Background */}
      <div className="floating-shapes">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>
        <div className="floating-shape shape5"></div>
      </div>

      {/* Content */}
      <div className="form-container">
        {/* Character Avatar */}
        <div className="character-preview">
          <div className="character-preview-circle">
            <div className="character-preview-avatar">
              <img src="/assets/character-1.jpg" alt="Character Avatar" className="character-image" />
            </div>
            <div className="preview-rings"></div>
          </div>
          <div className="character-preview-text">
            <span id="welcomeName">Hello, there</span>
            <p className="preview-message">I'm excited to meet you!</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <div className="form-header">
            <h1 className="form-title">What's your <span>name</span>?</h1>
            <p className="form-subtitle">Let's get to know each other</p>
          </div>

          <form onSubmit={handleSubmit} className="form-body">
            {/* Name Input */}
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={userName}
                  onChange={handleNameChange}
                  placeholder="Your Name"
                  className={`floating-input name-input ${error ? 'error' : ''}`}
                  autoComplete="off"
                  autoFocus
                />
                <label className="floating-label">Your Name</label>
                <div className="input-highlight"></div>
              </div>
              {error && <span className="error-message">{error}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Let's Go...</span>
                </>
              ) : (
                <span>Meet Your Character</span>
              )}
            </button>
            
            <div className="privacy-note">
              We value your privacy. Your name is only used to personalize your experience.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;