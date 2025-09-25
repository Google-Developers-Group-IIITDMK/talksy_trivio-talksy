import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CallControls from '../CallControls/CallControls';
import './CharacterRoom.css';

const CharacterRoom = ({ character, userData, onEndCall, onChangeCharacter }) => {
  const navigate = useNavigate();
  
  // Redirect to appropriate screen if prerequisites are missing
  useEffect(() => {
    if (!character) {
      navigate('/characters');
    } else if (!userData) {
      navigate('/user-info');
    }
  }, [character, userData, navigate]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false);
  const [facialExpression, setFacialExpression] = useState('neutral');

  // Get user name safely
  const userName = userData?.name || 'friend';
  
  // Sample conversation messages
  const messages = [
    `Hello ${userName}, it's a pleasure to meet you.`,
    'What would you like to talk about today?',
    'I find your world quite interesting.',
    'Tell me more about yourself.',
    'The future holds many possibilities.'
  ];

  useEffect(() => {
    // Simulate character speaking
    const speakingInterval = setInterval(() => {
      setIsCharacterSpeaking(true);
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
      
      // Set random facial expression
      const expressions = ['neutral', 'speaking', 'thinking', 'smiling'];
      setFacialExpression(expressions[Math.floor(Math.random() * expressions.length)]);

      setTimeout(() => {
        setIsCharacterSpeaking(false);
        setFacialExpression('neutral');
      }, 3000);
    }, 8000);

    // Initial greeting
    setTimeout(() => {
      setIsCharacterSpeaking(true);
      const userName = userData?.name || 'friend';
      setCurrentMessage(`Hello ${userName}, welcome to my realm.`);
      setFacialExpression('speaking');
      
      setTimeout(() => {
        setIsCharacterSpeaking(false);
        setFacialExpression('neutral');
      }, 3000);
    }, 1000);

    return () => clearInterval(speakingInterval);
  }, [userName]);

  const getThemeStyles = () => {
    // Default theme if no character is selected
    if (!character || !character.theme) {
      return {
        '--theme-primary': '#3a86ff',
        '--theme-secondary': '#8338ec',
        '--theme-accent': '#ff006e',
        '--theme-glow': 'rgba(58, 134, 255, 0.4)'
      };
    }
    
    return {
      '--theme-primary': character.theme.primary,
      '--theme-secondary': character.theme.secondary,
      '--theme-accent': character.theme.accent,
      '--theme-glow': character.theme.glow
    };
  };

  return (
    <div 
      className="character-room" 
      style={getThemeStyles()}
    >
      {/* Dynamic Background */}
      <div className="room-background">
        <div className="background-gradient"></div>
        <div className="background-particles">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="bg-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="room-content">
        {/* Character Display Area */}
        <div className="character-display">
          {/* 3D Model Placeholder */}
          <div className="model-container">
            <div className="model-placeholder">
              {/* Character Avatar with Animated Face */}
              <div className={`character-face ${facialExpression}`}>
                <div className="face-background">
                  <span className="character-emoji">{character.emoji}</span>
                </div>
                
                {/* Animated Features */}
                <div className="face-features">
                  <div className="eyes">
                    <div className="eye left-eye"></div>
                    <div className="eye right-eye"></div>
                  </div>
                  <div className={`mouth ${isCharacterSpeaking ? 'speaking' : ''}`}></div>
                </div>

                {/* Holographic Effect */}
                <div className="holographic-overlay"></div>
              </div>

              {/* Energy Rings */}
              <div className="energy-rings">
                <div className="energy-ring ring-1"></div>
                <div className="energy-ring ring-2"></div>
                <div className="energy-ring ring-3"></div>
              </div>
            </div>

            {/* Character Info */}
            <div className="character-info-display">
              <h2 className="character-name-display">{character.name}</h2>
              <div className="status-indicator">
                <div className={`status-dot ${isCharacterSpeaking ? 'speaking' : 'listening'}`}></div>
                <span className="status-text">
                  {isCharacterSpeaking ? 'Speaking...' : 'Listening'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle Area */}
        <div className="subtitle-area">
          {currentMessage && (
            <div className={`subtitle-container ${isCharacterSpeaking ? 'active' : ''}`}>
              <p className="subtitle-text">{currentMessage}</p>
              <div className="subtitle-glow"></div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <CallControls 
          onEndCall={onEndCall}
          onChangeCharacter={onChangeCharacter}
          character={character}
        />
      </div>

      {/* Ambient Effects */}
      <div className="ambient-effects">
        {/* Floating Elements */}
        <div className="floating-elements">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Theme-specific Effects */}
        <div className={`theme-effects ${character.id}`}>
          {character.id === 'voldemort' && (
            <div className="dark-wisps">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="dark-wisp" />
              ))}
            </div>
          )}
          
          {character.id === 'ironman' && (
            <div className="tech-grid">
              <div className="grid-lines horizontal"></div>
              <div className="grid-lines vertical"></div>
            </div>
          )}
          
          {character.id === 'doraemon' && (
            <div className="magic-sparkles">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="sparkle" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterRoom;