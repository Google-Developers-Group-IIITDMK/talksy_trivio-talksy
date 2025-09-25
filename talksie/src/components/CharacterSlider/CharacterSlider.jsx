import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CharacterSlider.css';

// Character data (in a real app, this would come from an API)
const characters = [
  {
    id: 1,
    name: 'Sherlock Holmes',
    type: 'Literature • Detective',
    image: '/assets/character-1.jpg',
    rating: 4.9,
    talks: '24k',
    popular: true,
    badges: ['Top Rated', 'Popular']
  },
  {
    id: 2,
    name: 'Princess Leia',
    type: 'Sci-Fi • Royalty',
    image: '/assets/character-2.jpg',
    rating: 4.8,
    talks: '19k',
    popular: true,
    badges: ['Trending']
  },
  {
    id: 3,
    name: 'Tony Stark',
    type: 'Superhero • Genius',
    image: '/assets/character-3.jpg',
    rating: 4.7,
    talks: '32k',
    popular: true,
    badges: ['Most Talked']
  },
  {
    id: 4,
    name: 'Elizabeth Bennet',
    type: 'Literature • Romance',
    image: '/assets/character-4.jpg',
    rating: 4.6,
    talks: '15k',
    popular: true,
    badges: []
  },
  {
    id: 5,
    name: 'Albert Einstein',
    type: 'Historical • Scientist',
    image: '/assets/character-5.jpg',
    rating: 4.5,
    talks: '21k',
    popular: true,
    badges: ['Educational']
  },
  {
    id: 6,
    name: 'Wonder Woman',
    type: 'Superhero • Warrior',
    image: '/assets/character-6.jpg',
    rating: 4.4,
    talks: '18k',
    popular: true,
    badges: ['New']
  },
  {
    id: 7,
    name: 'Harry Potter',
    type: 'Fantasy • Wizard',
    image: '/assets/character-1.jpg',
    rating: 4.9,
    talks: '30k',
    popular: true,
    badges: ['Fan Favorite']
  },
  {
    id: 8,
    name: 'Marie Curie',
    type: 'Historical • Scientist',
    image: '/assets/character-2.jpg',
    rating: 4.7,
    talks: '12k',
    popular: true,
    badges: ['Educational']
  }
];

const CharacterSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // Number of cards to show based on screen width
  const [cardsToShow, setCardsToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 992) {
        setCardsToShow(2);
      } else if (window.innerWidth < 1200) {
        setCardsToShow(3);
      } else {
        setCardsToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Auto slide every 5 seconds
    const autoSlide = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(autoSlide);
    };
  }, [activeSlide]);

  // Handlers for slider controls
  const nextSlide = () => {
    setActiveSlide((prev) => 
      prev + cardsToShow >= characters.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setActiveSlide((prev) => 
      prev === 0 ? characters.length - cardsToShow : prev - 1
    );
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      nextSlide();
    }
    
    if (touchStart - touchEnd < -150) {
      prevSlide();
    }
  };

  // Calculate visible characters based on current slide position
  const visibleCharacters = characters.slice(
    activeSlide,
    Math.min(activeSlide + cardsToShow, characters.length)
  );

  return (
    <section className="character-slider-section">
      <div className="section-background"></div>
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="slider-title">
              Meet <span className="gradient-text">Our Characters</span>
            </h2>
            <p className="slider-subtitle">
              Start a conversation with our most popular characters
            </p>
          </div>
          <div className="slider-controls">
            <button 
              className="slider-arrow prev" 
              onClick={prevSlide}
              aria-label="Previous characters"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="slider-pagination">
              {Array.from({ length: Math.ceil((characters.length - cardsToShow + 1) / 1) }).map((_, idx) => (
                <span 
                  key={idx}
                  className={`slider-dot ${idx === Math.floor(activeSlide / 1) ? 'active' : ''}`}
                  onClick={() => setActiveSlide(idx * 1)}
                ></span>
              ))}
            </div>
            <button 
              className="slider-arrow next" 
              onClick={nextSlide}
              aria-label="Next characters"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        <div 
          className="character-slider"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="slider-track"
            style={{ transform: `translateX(-${activeSlide * (100 / cardsToShow)}%)` }}
          >
            {characters.map((character) => (
              <div className="character-card" key={character.id}>
                <div className="character-image">
                  <img src={character.image} alt={character.name} />
                  {character.badges.length > 0 && (
                    <div className="character-badge">{character.badges[0]}</div>
                  )}
                  <div className="character-hover-info">
                    <p>"{character.name} is waiting to talk with you..."</p>
                    <Link to={`/character/${character.id}`} className="btn-talk-now">
                      Talk Now
                    </Link>
                  </div>
                </div>
                <div className="character-info">
                  <h3>{character.name}</h3>
                  <p className="character-type">{character.type}</p>
                  <div className="character-meta">
                    <span className="character-rating">
                      <i className="fas fa-star"></i> {character.rating}
                    </span>
                    <span className="character-talks">
                      <i className="fas fa-comment"></i> {character.talks} talks
                    </span>
                  </div>
                  <Link to={`/character/${character.id}`} className="btn-talk">
                    Start Talking <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="view-all-container">
          <Link to="/characters" className="btn-view-all">
            View All Characters
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CharacterSlider;