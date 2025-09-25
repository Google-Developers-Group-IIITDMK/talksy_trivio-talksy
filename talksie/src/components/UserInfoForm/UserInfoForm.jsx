import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserInfoForm.css';

// Import character images
import character1 from '../../assets/character-1.jpg';
import character2 from '../../assets/character-2.jpg';
import character3 from '../../assets/character-3.jpg';
import character4 from '../../assets/character-4.jpg';

const UserInfoForm = ({ onFormSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCharacter = location.state?.selectedCharacter;
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug log for character data
  useEffect(() => {
    console.log('Location State:', location.state);
    console.log('Selected Character:', selectedCharacter);
  }, [location.state, selectedCharacter]);

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
      onFormSubmit({ 
        name: userName,
        selectedCharacter 
      });
      setIsSubmitting(false);
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
              <img 
                src={selectedCharacter?.image || character1} 
                alt={`${selectedCharacter?.name || 'Character'} Avatar`} 
                className="character-image" 
              />
            </div>
            <div className="preview-rings"></div>
          </div>
          <div className="character-preview-text">
            <span id="welcomeName">Hello, there</span>
            <p className="preview-message">
              {selectedCharacter?.name ? `I'm ${selectedCharacter.name}, excited to meet you!` : "I'm excited to meet you!"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <div className="form-header">
            <h1 className="form-title">What's your <span>name</span>?</h1>
            <p className="form-subtitle">Let's begin your conversation with {selectedCharacter?.name || 'your character'}</p>
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
                <span>Start Chatting with {selectedCharacter?.name || 'Your Character'}</span>
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