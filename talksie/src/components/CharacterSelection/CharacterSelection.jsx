import React, { useState } from 'react';
import './CharacterSelection.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

// Import character images
import character1 from '../../assets/character-1.jpg';
import character2 from '../../assets/character-2.jpg';
import character3 from '../../assets/character-3.jpg';
import character4 from '../../assets/character-4.jpg';

const characters = [
  {
    id: 'voldemort',
    name: 'Lord Voldemort',
    description: 'The Dark Lord of the Wizarding World',
    image: character1,
    personality: 'Mysterious, powerful, and commanding',
    tags: ['Villain', 'Dark Magic', 'Powerful']
  },
  {
    id: 'harry',
    name: 'Harry Potter',
    description: 'The Boy Who Lived, wizard and hero',
    image: character2,
    personality: 'Brave, loyal, and determined',
    tags: ['Wizard', 'Hero', 'Gryffindor']
  },
  {
    id: 'doraemon',
    name: 'Doraemon',
    description: 'The robotic cat from the future',
    image: character3,
    personality: 'Friendly, helpful, and resourceful',
    tags: ['Robot', 'Future', 'Gadgets']
  },
  {
    id: 'nobita',
    name: 'Nobita Nobi',
    description: 'Doraemon\'s best friend and companion',
    image: character4,
    personality: 'Kind-hearted, clumsy, and imaginative',
    tags: ['Student', 'Friend', 'Adventure']
  }
];

const CharacterSelection = ({ onCharacterSelect, userData }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    // Add a small delay for animation effect
    setTimeout(() => {
      onCharacterSelect(character);
    }, 800);
  };

  return (
    <>
      <Navbar />
      <section id="characterSelectionSection">
        <div className="background-shapes">
          <div className="floating-shape shape1"></div>
          <div className="floating-shape shape2"></div>
          <div className="floating-shape shape3"></div>
          <div className="floating-shape shape4"></div>
          <div className="floating-shape shape5"></div>
        </div>
        
        <div className="selection-container">
          {/* Header */}
        <div className="selection-header">
          <h1 className="selection-title">
            Choose Your <span className="gradient-text">Character</span>
          </h1>
          <p className="selection-subtitle">
            Hello {userData?.name || 'there'}, select a character to start an engaging conversation
          </p>
        </div>

        {/* Character Grid */}
        <div className="character-grid">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`character-card ${selectedCharacter?.id === character.id ? 'selected' : ''}`}
              onClick={() => handleCharacterClick(character)}
            >
              <div className="card-inner">
                {/* Card Image */}
                <div className="character-image-container">
                  <div className="image-glow"></div>
                  <img src={character.image} alt={character.name} className="character-image" />
                  <div className="type-badge">{character.tags[0]}</div>
                  <div className="image-overlay">
                    <p className="character-personality">{character.personality}</p>
                    <button className="select-button">
                      <span>Select</span>
                      <div className="button-glow"></div>
                    </button>
                  </div>
                </div>
                
                {/* Character Info */}
                <div className="character-info">
                  <h3 className="character-name">{character.name}</h3>
                  <p className="character-description">{character.description}</p>

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
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedCharacter && (
          <div className="continue-container">
            <button
              className="continue-button"
              onClick={() => onCharacterSelect(selectedCharacter)}
            >
              <span>Start Conversation with {selectedCharacter.name}</span>
              <div className="button-glow"></div>
              <span className="button-arrow">→</span>
            </button>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="decorative-particles">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="decorative-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </section>
    <Footer />
    </>
  );
};

export default CharacterSelection;