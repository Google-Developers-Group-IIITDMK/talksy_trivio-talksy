import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import CallControls from '../CallControls/CallControls';
import './CharacterRoom.css';
import './CharacterRoomAnimations.css';

// Model component that loads and renders the 3D model
function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  
  // Set up rotation animation
  React.useEffect(() => {
    if (scene) {
      // Initial position adjustments if needed
      scene.position.y = -1;
    }
  }, [scene]);
  
  // Return the 3D primitive with appropriate scaling and positioning
  return (
    <primitive 
      object={scene} 
      scale={2} 
      position={[0, -2, 0]}
      rotation={[0, Math.PI / 6, 0]} // Slightly rotate for better viewing angle
    />
  );
}

const CharacterRoom = ({ character, userData, onEndCall, onChangeCharacter }) => {
  const navigate = useNavigate();
  const modelContainerRef = useRef(null);
  
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
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
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

  // Character-specific messages based on character identity
  const getCharacterSpecificMessages = () => {
    switch(character?.id) {
      case 'voldemort':
        return [
          `${userName}... I've been waiting for you.`,
          "The Dark Arts are a pathway to many abilities some consider to be... unnatural.",
          "Tell me, what brings you to seek the Dark Lord?",
          "Muggles... they are so... insignificant.",
          `Curious... very curious that our paths would cross, ${userName}.`
        ];
      case 'harrypotter':
        return [
          `Hi ${userName}! Fancy a game of Quidditch?`,
          "Hogwarts has always been there to welcome me home.",
          "My friends are my greatest strength.",
          "Expecto Patronum! That's how you cast a Patronus charm.",
          "Dumbledore always said our choices show what we truly are."
        ];
      case 'doraemon':
        return [
          `Konnichiwa, ${userName}! I have many gadgets to show you!`,
          "Would you like to try my Anywhere Door?",
          "Oh no! I hope Nobita isn't in trouble again.",
          "Time travel is very exciting, but also quite dangerous!",
          "My favorite food is dorayaki. Do you have any?"
        ];
      case 'nobita':
        return [
          `Hi ${userName}, have you seen Doraemon?`,
          "I should probably be studying, but adventures are more fun!",
          "Shizuka is the smartest person I know.",
          "Giant can be a bully sometimes, but he's not all bad.",
          "I wish I had a Time Machine to redo my test!"
        ];
      default:
        return messages;
    }
  };

  useEffect(() => {
    // Set up 3D model interaction
    if (modelContainerRef.current) {
      // Code to initialize 3D model when available
      // Will be replaced with actual model loader when .glb/.gltf files are provided
    }
    
    // Simulate user speaking occasionally
    const userSpeakingInterval = setInterval(() => {
      setIsUserSpeaking(true);
      
      setTimeout(() => {
        setIsUserSpeaking(false);
      }, 1500);
    }, 15000);
    
    // Simulate character speaking
    const characterMessages = getCharacterSpecificMessages();
    
    const speakingInterval = setInterval(() => {
      setIsCharacterSpeaking(true);
      const randomMessage = characterMessages[Math.floor(Math.random() * characterMessages.length)];
      setCurrentMessage(randomMessage);
      
      // Set character-appropriate facial expression
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
      
      // Character-specific greeting
      let greeting = `Hello ${userName}, welcome to my realm.`;
      
      if (character?.id === 'voldemort') {
        greeting = `${userName}... I've been expecting you.`;
      } else if (character?.id === 'harry') {
        greeting = `Hi ${userName}! Welcome to Hogwarts!`;
      } else if (character?.id === 'doraemon') {
        greeting = `Konnichiwa, ${userName}! Let's have a fun adventure!`;
      } else if (character?.id === 'nobita') {
        greeting = `Hey ${userName}! Want to hang out with me today?`;
      }
      
      setCurrentMessage(greeting);
      setFacialExpression('speaking');
      
      setTimeout(() => {
        setIsCharacterSpeaking(false);
        setFacialExpression('neutral');
      }, 3000);
    }, 1000);

    return () => {
      clearInterval(speakingInterval);
      clearInterval(userSpeakingInterval);
    };
  }, [userName, character?.id]);

  const getThemeStyles = () => {
    // Default theme if no character is selected
    if (!character) return {
      '--theme-primary': '#3a86ff',
      '--theme-secondary': '#8338ec',
      '--theme-accent': '#ff006e',
      '--theme-glow': 'rgba(58, 134, 255, 0.4)'
    };
    
    // Character-specific themes
    const themes = {
      voldemort: {
        primary: '#1a0b14', // Dark purple/black
        secondary: '#3d0a1f', // Dark red
        accent: '#ff0000', // Bright red
        glow: 'rgba(255, 0, 0, 0.4)' // Red glow
      },
      harrypotter: {
        primary: '#0e1a40', // Deep blue
        secondary: '#762c00', // Burgundy
        accent: '#ffc500', // Gold
        glow: 'rgba(255, 197, 0, 0.4)' // Gold glow
      },
      doraemon: {
        primary: '#005bea', // Bright blue
        secondary: '#ffffff', // White
        accent: '#ff4757', // Red
        glow: 'rgba(0, 168, 255, 0.4)' // Light blue glow
      }
    };
    
    // Use character theme if available, otherwise fall back to predefined themes
    const theme = character.theme || themes[character.id] || themes.voldemort;
    
    return {
      '--theme-primary': theme.primary,
      '--theme-secondary': theme.secondary,
      '--theme-accent': theme.accent,
      '--theme-glow': theme.glow
    };
  };

  // Determine which model to load based on character
  const getModelPath = () => {
    switch(character?.id) {
      case 'voldemort':
        return '/assets/voldemort.glb'; // Path to your voldemort.glb file in the public/assets folder
      case 'harrypotter':
        return '/assets/harrypotter.glb'; // Path to Harry Potter model when available
      case 'doraemon':
        return '/assets/doraemon.glb'; // Path to Doraemon model when available
      default:
        return '/assets/voldemort.glb'; // Fallback to Voldemort model
    }
  };

  return (
    <div 
      className="character-room" 
      style={getThemeStyles()}
      data-character={character?.id || ''}
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
          {/* 3D Model Container */}
          <div className="model-container" ref={modelContainerRef}>
            {/* Use 3D model if available for this character */}
            {getModelPath() ? (
              <div className={`model-3d-container character-${character?.id}`}>
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 50 }}
                  style={{ width: '100%', height: '100%' }}
                  shadows
                  dpr={[1, 2]} // Dynamic pixel ratio for better performance
                  performance={{ min: 0.5 }} // Performance optimizations
                >
                  {/* Ambient light for general illumination */}
                  <ambientLight intensity={0.5} />
                  
                  {/* Main directional light with shadow */}
                  <directionalLight 
                    position={[5, 10, 5]} 
                    intensity={1} 
                    castShadow 
                    shadow-mapSize={1024} 
                  />
                  
                  {/* Character-specific lighting */}
                  {character?.id === 'voldemort' && (
                    <>
                      <spotLight 
                        position={[0, 5, 2]} 
                        intensity={0.8} 
                        color="#ff0000" 
                        angle={Math.PI / 6} 
                        penumbra={0.3} 
                      />
                      <fog attach="fog" args={['#000', 5, 15]} />
                    </>
                  )}
                  
                  {character?.id === 'harrypotter' && (
                    <>
                      <spotLight 
                        position={[0, 5, 2]} 
                        intensity={1.2} 
                        color="#ffc500" 
                        angle={Math.PI / 6} 
                        penumbra={0.3} 
                      />
                      <fog attach="fog" args={['#0e1a40', 8, 20]} />
                    </>
                  )}
                  
                  {character?.id === 'doraemon' && (
                    <>
                      <spotLight 
                        position={[0, 5, 2]} 
                        intensity={1.5} 
                        color="#00a8ff" 
                        angle={Math.PI / 5} 
                        penumbra={0.2} 
                      />
                      <hemisphereLight 
                        intensity={0.8}
                        color="#ffffff"
                        groundColor="#005bea"
                      />
                      <fog attach="fog" args={['#e6f7ff', 10, 25]} />
                    </>
                  )}
                  
                  {/* Fall back to a spinner or nothing while the model loads */}
                  <Suspense fallback={null}>
                    <Model modelPath={getModelPath()} />
                  </Suspense>
                  
                  {/* Limited OrbitControls for better user experience */}
                  <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    rotateSpeed={0.5}
                  />
                </Canvas>
                
                {/* Character-specific overlay effects */}
                {character?.id === 'voldemort' && (
                  <>
                    {/* Dark magic overlay */}
                    <div className="holographic-overlay dark-magic"></div>
                    
                    {/* Energy Rings */}
                    <div className="energy-rings">
                      <div className="energy-ring ring-1"></div>
                      <div className="energy-ring ring-2"></div>
                      <div className="energy-ring ring-3"></div>
                    </div>
                  </>
                )}
                
                {character?.id === 'harrypotter' && (
                  <>
                    {/* Magic overlay */}
                    <div className="holographic-overlay magic-aura"></div>
                    
                    {/* Magic particles */}
                    <div className="magic-particles">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div 
                          key={i} 
                          className="magic-particle"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {character?.id === 'doraemon' && (
                  <>
                    {/* Futuristic overlay */}
                    <div className="holographic-overlay future-tech"></div>
                    
                    {/* Floating gadget icons */}
                    <div className="floating-icons">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div 
                          key={i} 
                          className="floating-icon"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* User Speaking Indicator (Google-like voice animation) */}
                <div className={`user-speaking-indicator ${isUserSpeaking ? 'active' : ''}`}>
                  <div className="voice-wave">
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                  </div>
                </div>
              </div>
            ) : (
              // Fallback to original character placeholder for other characters
              <div className="model-placeholder">
                {/* Character Avatar with Animated Face */}
                <div className={`character-face ${facialExpression} ${character?.id || ''}`}>
                  <div className="face-background">
                    {/* Will be replaced with actual 3D model when available */}
                    <span className="character-emoji">
                      {character?.id === 'voldemort' ? '🧙‍♂️' : 
                       character?.id === 'harry' ? '⚡' : 
                       character?.id === 'doraemon' ? '🐱' :
                       character?.id === 'nobita' ? '👦' : 
                       '👤'}
                    </span>
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
                
                {/* User Speaking Indicator (Google-like voice animation) */}
                <div className={`user-speaking-indicator ${isUserSpeaking ? 'active' : ''}`}>
                  <div className="voice-wave">
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                  </div>
                </div>
              </div>
            )}

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
        <div className={`theme-effects ${character?.id || ''}`}>
          {character?.id === 'voldemort' && (
            <div className="dark-environment">
              <div className="dark-wisps">
                {Array.from({ length: 8 }, (_, i) => (
                  <div 
                    key={i} 
                    className="dark-wisp" 
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      width: `${100 + Math.random() * 200}px`
                    }}
                  />
                ))}
              </div>
              <div className="skull-particles">
                {Array.from({ length: 3 }, (_, i) => (
                  <div 
                    key={i} 
                    className="skull-particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 10}s`
                    }}
                  >
                    💀
                  </div>
                ))}
              </div>
              <div className="dark-mist"></div>
            </div>
          )}
          
          {character?.id === 'harry' && (
            <div className="magical-environment">
              <div className="magic-wisps">
                {Array.from({ length: 10 }, (_, i) => (
                  <div 
                    key={i} 
                    className="magic-wisp" 
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`
                    }}
                  />
                ))}
              </div>
              <div className="magical-objects">
                {Array.from({ length: 4 }, (_, i) => (
                  <div 
                    key={i} 
                    className="magical-object"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 10}s`
                    }}
                  >
                    {['⚡', '🧹', '🪄', '🧙‍♂️'][i]}
                  </div>
                ))}
              </div>
              <div className="hogwarts-sky"></div>
            </div>
          )}
          
          {character?.id === 'doraemon' && (
            <div className="doraemon-environment">
              <div className="magic-sparkles">
                {Array.from({ length: 15 }, (_, i) => (
                  <div 
                    key={i} 
                    className="sparkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`
                    }}
                  />
                ))}
              </div>
              <div className="floating-gadgets">
                {Array.from({ length: 4 }, (_, i) => (
                  <div 
                    key={i} 
                    className="floating-gadget"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${10 + Math.random() * 80}%`,
                      animationDelay: `${Math.random() * 10}s`
                    }}
                  >
                    {['🚪', '🔔', '🧸', '🎒'][i]}
                  </div>
                ))}
              </div>
              <div className="blue-clouds"></div>
            </div>
          )}
          
          {character?.id === 'nobita' && (
            <div className="nobita-environment">
              <div className="school-items">
                {Array.from({ length: 5 }, (_, i) => (
                  <div 
                    key={i} 
                    className="school-item"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${10 + Math.random() * 80}%`,
                      animationDelay: `${Math.random() * 8}s`
                    }}
                  >
                    {['📚', '✏️', '📝', '🎒', '🥪'][i]}
                  </div>
                ))}
              </div>
              <div className="dream-clouds">
                {Array.from({ length: 3 }, (_, i) => (
                  <div 
                    key={i} 
                    className="dream-cloud"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 15}s`
                    }}
                  />
                ))}
              </div>
              <div className="sunshine-effect"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Preload models for better performance
useGLTF.preload('/assets/voldemort.glb');
// Uncomment these when the models are available
// useGLTF.preload('/assets/harrypotter.glb');
// useGLTF.preload('/assets/doraemon.glb');

// Add character-specific message and animation logic for new characters
export default CharacterRoom;