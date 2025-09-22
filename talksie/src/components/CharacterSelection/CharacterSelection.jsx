import React, { useState } from 'react';
import './CharacterSelection.css';

const characters = [
  {
    id: 'voldemort',
    name: 'Lord Voldemort',
    description: 'The Dark Lord of the Wizarding World',
    emoji: '🐍',
    theme: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#22c55e',
      glow: '#16a34a'
    },
    personality: 'Mysterious, powerful, and commanding',
    tags: ['Dark Magic', 'Powerful', 'Mysterious']
  },
  {
    id: 'ironman',
    name: 'Tony Stark',
    description: 'Genius, Billionaire, Playboy, Philanthropist',
    emoji: '🤖',
    theme: {
      primary: '#7f1d1d',
      secondary: '#991b1b',
      accent: '#fbbf24',
      glow: '#f59e0b'
    },
    personality: 'Witty, intelligent, and innovative',
    tags: ['Technology', 'Genius', 'Hero']
  },
  {
    id: 'doraemon',
    name: 'Doraemon',
    description: 'The robotic cat from the future',
    emoji: '🔵',
    theme: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#fbbf24',
      glow: '#38bdf8'
    },
    personality: 'Friendly, helpful, and adventurous',
    tags: ['Future Tech', 'Friendly', 'Magical']
  }
];

const CharacterSelection = ({ onCharacterSelect, userData }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [hoveredCharacter, setHoveredCharacter] = useState(null);

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    // Add a small delay for animation effect
    setTimeout(() => {
      onCharacterSelect(character);
    }, 500);
  };

  const getBackgroundStyle = () => {
    const character = hoveredCharacter || selectedCharacter;
    if (!character) {
      return {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #374151 100%)'
      };
    }

    const { theme } = character;
    return {
      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.primary} 100%)`,
      transition: 'background 0.5s ease-in-out'
    };
  };

  return (
    <div className="character-selection-screen" style={getBackgroundStyle()}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="selection-container">
        {/* Header */}
        <div className="selection-header">
          <h1 className="selection-title">
            Choose Your Character
          </h1>
          <p className="selection-subtitle">
            Hello {userData?.name}, who would you like to talk with today?
          </p>
        </div>

        {/* Character Grid */}
        <div className="character-grid">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`character-card ${selectedCharacter?.id === character.id ? 'selected' : ''}`}
              onMouseEnter={() => setHoveredCharacter(character)}
              onMouseLeave={() => setHoveredCharacter(null)}
              onClick={() => handleCharacterClick(character)}
              style={{
                '--theme-color': character.theme.accent,
                '--theme-glow': character.theme.glow
              }}
            >
              {/* Card Background Glow */}
              <div className="card-glow"></div>
              
              {/* Card Content */}
              <div className="card-content">
                {/* Character Avatar */}
                <div className="character-avatar">
                  <span className="character-emoji">{character.emoji}</span>
                  <div className="avatar-ring"></div>
                </div>

                {/* Character Info */}
                <div className="character-info">
                  <h3 className="character-name">{character.name}</h3>
                  <p className="character-description">{character.description}</p>
                  <p className="character-personality">{character.personality}</p>
                  
                  {/* Tags */}
                  <div className="character-tags">
                    {character.tags.map((tag, index) => (
                      <span key={index} className="character-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedCharacter?.id === character.id && (
                  <div className="selection-indicator">
                    <div className="selection-pulse"></div>
                    <span className="selection-text">Selected</span>
                  </div>
                )}
              </div>

              {/* Hover Effect */}
              <div className="card-hover-effect"></div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedCharacter && (
          <div className="continue-container">
            <button
              className="continue-button"
              style={{
                '--theme-color': selectedCharacter.theme.accent,
                '--theme-glow': selectedCharacter.theme.glow
              }}
              onClick={() => onCharacterSelect(selectedCharacter)}
            >
              Start Conversation with {selectedCharacter.name}
              <span className="button-arrow">→</span>
            </button>
          </div>
        )}
      </div>

      {/* Ambient Particles */}
      <div className="ambient-particles">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="ambient-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterSelection;