import React, { useState, useEffect, useRef, Suspense, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import CallControls from '../CallControls/CallControls';
import './CharacterRoom.css';
import './CharacterRoomAnimations.css';
import './VideoCallStyle.css';

// Add debug logging
console.log('CharacterRoom component loaded');

// Error Boundary for handling rendering errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Model component that loads and renders the 3D model for video call style
function Model({ modelPath, character }) {
  console.log('Model component rendering with path:', modelPath);
  
  const modelRef = useRef();
  
  // Use error boundary pattern for hooks
  const [hasError, setHasError] = useState(false);
  
  // Safe model loading
  const { scene } = useGLTF(modelPath, 
    // Success callback
    undefined,
    // Error callback 
    (error) => {
      console.error('Error loading model:', error);
      setHasError(true);
    }
  );
  
  // Log successful load
  useEffect(() => {
    if (scene) {
      console.log('Model loaded successfully:', scene);
    }
  }, [scene]);
  
  // Set up positioning and animation for video call style
  React.useEffect(() => {
    if (scene) {
      console.log('Setting up model position for character:', character?.id);
      // Position the character for a video call framing (head and upper body visible)
      scene.position.y = -1.0; // Lower the model significantly to center it
      
      // Character-specific adjustments
      if (character?.id === 'voldemort') {
        scene.position.z = -2; // Move Voldemort slightly back for better framing
      } else if (character?.id === 'harry') { // Changed from 'harrypotter' to match the ID in CharacterSelection.jsx
        scene.position.z = -1.0; // Move Harry closer to the camera
        scene.position.y = -0.01; // Adjust height to bring face to center
        scene.rotation.x = 0; // No tilt
        scene.rotation.y = Math.PI * 1.5; // Rotate 270 degrees (180 + 90) to face the camera
      } else if (character?.id === 'doraemon') {
        scene.position.z = -1;
      }
    }
  }, [scene, character]);
  
  // Subtle idle animation
  useEffect(() => {
    if (!modelRef.current) return;
    
    const baseRotationY = character?.id === 'harry' ? Math.PI * 1.5 : 0; // Base rotation for Harry is 270 degrees to face camera
    
    const animate = () => {
      if (modelRef.current) {
        // Subtle breathing movement - just rotate slightly while maintaining base rotation
        modelRef.current.rotation.y = baseRotationY + Math.sin(Date.now() * 0.0005) * 0.05;
        // Removed vertical movement to keep the face centered
      }
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [character]);
  
  // Return nothing if we had an error loading the model
  if (hasError || !scene) {
    console.log('Model error or scene not loaded');
    return null;
  }
  
  // Return the 3D primitive with video call positioning
  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={character?.id === 'harry' ? 3.5 : 3} // Larger scale for Harry Potter
      position={character?.id === 'harry' ? [0, -2.5, -1.5] : [0, -2.5, -2]} // Adjusted position for Harry Potter
      rotation={character?.id === 'harry' ? [0, Math.PI * 1.5, 0] : [0, 0, 0]} // Rotate Harry 270 degrees to face camera
    />
  );
}

const CharacterRoom = ({ character, userData, onEndCall, onChangeCharacter }) => {
  const navigate = useNavigate();
  const modelContainerRef = useRef(null);
  const videoRef = useRef(null);
  
  // State declarations - moved to the top before any useEffect hooks
  const [currentMessage, setCurrentMessage] = useState('');
  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [facialExpression, setFacialExpression] = useState('neutral');
  const [isCallEnded, setIsCallEnded] = useState(false); // Track if call has ended
  
  // Redirect to appropriate screen if prerequisites are missing
  useEffect(() => {
    if (!character) {
      navigate('/characters');
    } else if (!userData) {
      navigate('/user-info');
    }
  }, [character, userData, navigate]);

  // User camera and microphone handling
  useEffect(() => {
    let mediaStream = null;
    
    const setupMedia = async () => {
      try {
        // Stop any existing tracks
        if (videoRef.current && videoRef.current.srcObject) {
          const existingTracks = videoRef.current.srcObject.getTracks();
          existingTracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        
        // Only get media if camera or mic is on
        if (isCameraOn || isMicOn) {
          mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: isCameraOn,
            audio: isMicOn
          });
          
          if (videoRef.current && isCameraOn) {
            videoRef.current.srcObject = mediaStream;
          }
          
          // If only mic is on but camera is off
          if (!isCameraOn && isMicOn) {
            // Keep the audio tracks only
            const audioTracks = mediaStream.getAudioTracks();
            if (audioTracks.length > 0) {
              audioTracks[0].enabled = true;
            }
          }
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };
    
    setupMedia();
    
    return () => {
      // Cleanup all media tracks on unmount
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn, isMicOn]);

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

  // Handle end call function
  const handleEndCall = () => {
    // Stop all media tracks before ending the call
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // Show call ended screen instead of immediately ending call
    setIsCallEnded(true);
    setCurrentMessage("Call ended. Thank you for the conversation!");
  };
  
  // Handle navigation after call ends
  const handleNavigation = (destination) => {
    // First, call the parent component's end call handler
    if (onEndCall) onEndCall();
    
    // Then navigate to the selected destination
    if (destination === 'home') {
      navigate('/');
    } else if (destination === 'characters') {
      navigate('/characters');
    }
  };

  const getThemeStyles = () => {
    // Default theme if no character is selected
    if (!character) return {
      '--theme-primary': '#f0f4f8',
      '--theme-secondary': '#dbe4ff',
      '--theme-accent': '#4263eb',
      '--theme-glow': 'rgba(66, 99, 235, 0.3)'
    };
    
    // Character-specific themes - all made lighter with character-appropriate accents
    const themes = {
      voldemort: {
        primary: '#f5f5f5', // Light background
        secondary: '#e0e0e0', // Light secondary
        accent: '#9c0000', // Dark red accent
        glow: 'rgba(156, 0, 0, 0.3)', // Red glow
        textColor: '#1f1f1f', // Dark text with light hints of black
        borderColor: '#3d0a1f' // Darker border
      },
      harry: {
        primary: '#fafafa', // Light background
        secondary: '#e8eaf6', // Light blue-ish secondary
        accent: '#b71c1c', // Gryffindor red
        glow: 'rgba(255, 197, 0, 0.4)', // Gold glow
        textColor: '#212121', // Dark text with light hints of black
        borderColor: '#0e1a40' // Darker border
      },
      doraemon: {
        primary: '#e3f2fd', // Very light blue
        secondary: '#ffffff', // Bright white
        accent: '#0091ea', // Doraemon blue
        glow: 'rgba(0, 145, 234, 0.4)', // Blue sparkle
        textColor: '#0277bd', // Blue text
        borderColor: '#4fc3f7' // Light blue border
      },
      nobita: {
        primary: '#fff9c4', // Very light yellow
        secondary: '#ffffff', // Bright white
        accent: '#ffab00', // Yellow accent
        glow: 'rgba(255, 171, 0, 0.4)', // Yellow sparkle
        textColor: '#ff6f00', // Orange-ish text
        borderColor: '#ffcc80' // Light orange border
      }
    };
    
    // Use character theme if available, otherwise fall back to predefined themes
    // If the character ID is 'nobita' but it's not in our themes, use the nobita theme
    let themeToUse;
    if (character.id === 'nobita') {
      themeToUse = themes.nobita;
    } else {
      themeToUse = character.theme || themes[character.id] || themes.voldemort;
    }
    
    return {
      '--theme-primary': themeToUse.primary,
      '--theme-secondary': themeToUse.secondary,
      '--theme-accent': themeToUse.accent,
      '--theme-glow': themeToUse.glow,
      '--theme-text-color': themeToUse.textColor || '#212121',
      '--theme-border-color': themeToUse.borderColor || themeToUse.accent
    };
  };

  // Determine which model to load based on character
  const getModelPath = () => {
    switch(character?.id) {
      case 'voldemort':
        return '/assets/voldemort.glb'; // Path to your voldemort.glb file in the public/assets folder
      case 'harry': // Changed from 'harrypotter' to match the ID in CharacterSelection.jsx
        return '/assets/harrypotter.glb'; // Path to Harry Potter model in the public/assets folder
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
          {/* 3D Model Container - Video Call Style */}
          <div className="model-container" ref={modelContainerRef}>
            {/* Use 3D model if available for this character */}
            {getModelPath() ? (
              <div className={`model-3d-container character-${character?.id}`}>
                {/* Character name banner */}
                <div className="character-name-banner">
                  {character?.name || character?.id || 'Character'}
                </div>
                
                {/* Add error boundary for 3D rendering */}
                <ErrorBoundary
                  fallback={
                    <div className="model-error-fallback">
                      <img 
                        src={`/assets/${character?.id || 'character'}.jpg`} 
                        alt={character?.name || 'Character'} 
                        onError={(e) => { e.target.src = "/assets/character-1.jpg" }}
                      />
                      <div className="error-message">
                        Using 2D fallback image
                      </div>
                    </div>
                  }
                >
                  <Canvas
                  gl={{ antialias: true, alpha: true }}
                  style={{ width: '100%', height: '100%' }}
                  shadows
                  dpr={[1, 2]} // Dynamic pixel ratio for better performance
                  performance={{ min: 0.5 }} // Performance optimizations
                  onCreated={state => console.log('Canvas created:', state)}
                  onError={error => console.error('Canvas error:', error)}
                >
                  {/* Camera setup for video call style */}
                  <PerspectiveCamera 
                    makeDefault 
                    position={character?.id === 'harry' ? [0, -1.5, 3] : [0, -2.0, 3]} 
                    fov={character?.id === 'harry' ? 35 : 40} 
                  />
                  
                  {/* Ambient light for general illumination */}
                  <ambientLight intensity={0.6} />
                  
                  {/* Main key light for video call style lighting */}
                  <directionalLight 
                    position={[3, 3, 2]} 
                    intensity={1.2} 
                    castShadow 
                    shadow-mapSize={1024}
                  />
                  
                  {/* Fill light for softer shadows */}
                  <directionalLight 
                    position={[-3, 2, 2]} 
                    intensity={0.5} 
                  />
                  
                  {/* Character-specific lighting for video call */}
                  {character?.id === 'voldemort' && (
                    <>
                      <spotLight 
                        position={[0, 2, 3]} 
                        intensity={1.2} 
                        color="#ff0000" 
                        angle={Math.PI / 5} 
                        penumbra={0.5} 
                      />
                      <fog attach="fog" args={['#000', 8, 20]} />
                      <Environment preset="night" />
                    </>
                  )}
                  
                  {character?.id === 'harry' && (
                    <>
                      {/* Key light from the front to highlight the face */}
                      <spotLight 
                        position={[0, 0, 4]} 
                        intensity={1.8} 
                        color="#ffc500" 
                        angle={Math.PI / 4}
                        penumbra={0.5} 
                      />
                      {/* Rim light from behind to create depth */}
                      <spotLight 
                        position={[1, 2, -2]} 
                        intensity={1.0} 
                        color="#ffffff" 
                        angle={Math.PI / 6}
                        penumbra={0.7} 
                      />
                      <fog attach="fog" args={['#0e1a40', 15, 30]} />
                      <Environment preset="sunset" />
                    </>
                  )}
                  
                  {character?.id === 'doraemon' && (
                    <>
                      <spotLight 
                        position={[0, 2, 3]} 
                        intensity={1.8} 
                        color="#00a8ff" 
                        angle={Math.PI / 4}
                        penumbra={0.4} 
                      />
                      <hemisphereLight 
                        intensity={1.0}
                        color="#ffffff"
                        groundColor="#005bea"
                      />
                      <fog attach="fog" args={['#e6f7ff', 12, 30]} />
                      <Environment preset="dawn" />
                    </>
                  )}
                  
                  {/* Fall back to a loading indicator while the model loads */}
                  <Suspense fallback={
                    <mesh position={[0, 0, 0]}>
                      <sphereGeometry args={[1, 32, 32]} />
                      <meshStandardMaterial color="#ffffff" wireframe />
                    </mesh>
                  }>
                    <Model modelPath={getModelPath()} character={character} />
                  </Suspense>
                  
                  {/* Limited OrbitControls for subtle user interaction */}
                  <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 1.8}
                    minAzimuthAngle={-Math.PI / 8}
                    maxAzimuthAngle={Math.PI / 8}
                    rotateSpeed={0.2}
                  />
                </Canvas>
                </ErrorBoundary>
                
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
                
                {character?.id === 'harry' && (
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
                
                {/* User camera preview - visibility based on camera state */}
                {isCameraOn && (
                  <div className="user-camera-preview">
                    {/* This would be a real camera in a full implementation */}
                  </div>
                )}
                
                {/* Speaking indicator */}
                <div className="speaking-indicator">
                  {isCharacterSpeaking ? (
                    <>
                      <span>Speaking</span>
                      <div className="wave">
                        <div className="wave-bar" style={{ height: '6px' }}></div>
                        <div className="wave-bar" style={{ height: '12px' }}></div>
                        <div className="wave-bar" style={{ height: '8px' }}></div>
                        <div className="wave-bar" style={{ height: '10px' }}></div>
                      </div>
                    </>
                  ) : (
                    <span>Listening...</span>
                  )}
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
      </div>

      {/* Video Call Message Display */}
      {currentMessage && (
        <div className="video-call-message">
          <div className="message-bubble">
            <div className="message-content">
              {currentMessage}
            </div>
          </div>
        </div>
      )}
      
      {/* Character name banner */}
      <div className="character-name-banner">
        {character?.name || 'Character'}
      </div>
      
      {/* Video call UI buttons - ONLY THREE BUTTONS: Camera, Mic, End Call */}
      <div className="video-call-ui">
        <button 
          className={`video-call-button ${!isCameraOn ? 'disabled' : ''}`}
          onClick={() => setIsCameraOn(!isCameraOn)}
          aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
        >
          <i className={`fa-solid ${isCameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
        </button>
        
        <button 
          className={`video-call-button ${!isMicOn ? 'disabled' : ''}`}
          onClick={() => setIsMicOn(!isMicOn)}
          aria-label={isMicOn ? "Turn off microphone" : "Turn on microphone"}
        >
          <i className={`fa-solid ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
        </button>
        
        <button 
          className="video-call-button end-call"
          onClick={handleEndCall}
          aria-label="End call"
        >
          <i className="fa-solid fa-phone-slash"></i>
        </button>
      </div>
      
      {/* User camera preview */}
      {isCameraOn && (
        <div className="user-camera-preview">
          <video ref={videoRef} autoPlay playsInline muted />
        </div>
      )}
      
      {/* Call Ended Overlay */}
      {isCallEnded && (
        <div className="call-ended-overlay">
          <div className="call-ended-content">
            <div className="call-ended-animation">
              <i className="fa-solid fa-phone-slash"></i>
              <div className="call-ended-ripple"></div>
            </div>
            <h2>Call Ended</h2>
            <p>Thank you for chatting with {character?.name || 'the character'}!</p>
            <div className="navigation-options">
              <button 
                className="navigation-button home-button"
                onClick={() => handleNavigation('home')}
              >
                <i className="fa-solid fa-house"></i>
                Return to Homepage
              </button>
              <button 
                className="navigation-button characters-button"
                onClick={() => handleNavigation('characters')}
              >
                <i className="fa-solid fa-users"></i>
                Choose Another Character
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Preload models for better performance
useGLTF.preload('/assets/voldemort.glb');
useGLTF.preload('/assets/harrypotter.glb'); // This still uses the file name harrypotter.glb
// Uncomment this when the model is available
// useGLTF.preload('/assets/doraemon.glb');

// Add character-specific message and animation logic for new characters
export default CharacterRoom;