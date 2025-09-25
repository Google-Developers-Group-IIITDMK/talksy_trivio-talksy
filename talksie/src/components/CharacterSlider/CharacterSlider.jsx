import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CharacterSlider.css';

// Character data (in a real app, this would come from an API)
const characters = [
  {
    id: 1,
    name: 'Lord Voldemort',
    type: 'Literature • Fantasy • Villain',
    image: '/assets/character-1.jpg',
    rating: 4.8,         
    talks: '12k',         
    popular: true,
    badges: ['Top Rated', 'Villain Icon', 'Dark Wizard']
  },
  {
    id: 2,
    name: 'Harry Potter',
    type: 'Literature • Fantasy • Wizard',
    image: '/assets/character-2.jpg',
    rating: 4.9,           
    talks: '30k',
    popular: true,
    badges: ['Popular', 'Hero', 'Popular']
  },
  {
    id: 3,
    name: 'Doraemon',
    type: 'Anime • Robot • Kids Show',
    image: '/assets/character-3.jpg',
    rating: 4.9,          
    talks: '40k',          
    popular: true,
    badges: ['Most Loved', 'Classic', 'Most Loved']
  },
  {
    id: 4,
    name: 'Nobita Nobi',
    type: 'Anime • Kids Show • Student',
    image: '/assets/character-4.jpg',
    rating: 4.5,          
    talks: '25k',          
    popular: true,
    badges: ['Classic', 'Lovable', 'Funny']
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
    
    // Auto slide every 7 seconds
    const autoSlide = setInterval(() => {
      nextSlide();
    }, 7000);
    
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
    <section id="characterSliderSection">
      <div id="sliderBackground">
        <div id="sliderShape1" className="floating-shape"></div>
        <div id="sliderShape2" className="floating-shape"></div>
        <div id="sliderShape3" className="floating-shape"></div>
        <div id="sliderShape4" className="floating-shape"></div>
      </div>
      <div id="characterSliderContainer">
        <div id="sectionHeader">
          <div id="headerContent">
            <h2 id="sliderTitle">
              Meet <span id="gradientTitleText">Our Characters</span>
            </h2>
            <p id="sliderSubtitle">
              Start a conversation with our most popular characters
            </p>
          </div>
        </div>
        
        <div 
          id="characterSlider"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            id="sliderTrack"
            style={{ transform: `translateX(-${activeSlide * (100 / cardsToShow)}%)` }}
          >
            {characters.map((character) => (
              <div id={`characterCard${character.id}`} key={character.id}>
                <div id={`imageContainer${character.id}`}>
                  <div id={`characterGlow${character.id}`}></div>
                  <img 
                    src={character.image} 
                    alt={character.name} 
                    id={`characterImage${character.id}`} 
                  />
                  {character.badges.length > 0 && (
                    <div id={`characterBadge${character.id}`}>{character.badges[0]}</div>
                  )}
                  <div id={`characterHoverInfo${character.id}`}>
                    <p>"{character.name} is waiting to talk with you..."</p>
                    <Link to={`/character/${character.id}`} id={`talkNowBtn${character.id}`}>
                      <span>Talk Now</span>
                      <div id={`talkNowBtnGlow${character.id}`}></div>
                    </Link>
                  </div>
                </div>
                <div id={`characterInfo${character.id}`}>
                  <h3 id={`characterName${character.id}`}>{character.name}</h3>
                  <p id={`characterType${character.id}`}>{character.type}</p>
                  <div id={`characterMeta${character.id}`}>
                    <span id={`characterRating${character.id}`}>
                      <i className="fas fa-star"></i> {character.rating}
                    </span>
                    <span id={`characterTalks${character.id}`}>
                      <i className="fas fa-comment"></i> {character.talks} talks
                    </span>
                  </div>
                  <Link to={`/character/${character.id}`} id={`startTalkingBtn${character.id}`}>
                    <span>Start Talking</span> <i className="fas fa-arrow-right"></i>
                    <div id={`startTalkingBtnGlow${character.id}`}></div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div id="viewAllContainer">
          <Link to="/characters" id="viewAllBtn">
            <span>View All Characters</span>
            <i className="fas fa-arrow-right"></i>
            <div id="viewAllBtnGlow"></div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CharacterSlider;