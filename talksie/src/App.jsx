import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen/SplashScreen';
import UserInfoForm from './components/UserInfoForm/UserInfoForm';
import CharacterSelection from './components/CharacterSelection/CharacterSelection';
import CharacterRoom from './components/CharacterRoom/CharacterRoom';
import LandingPage from './components/LandingPage/LandingPage'; // ✅ add landing page

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [userData, setUserData] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Screen navigation handlers
  const handleLoadingComplete = () => {
    setShowSplash(false);
  };

  const handleUserFormSubmit = (data) => {
    setUserData(data);
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleEndCall = () => {
    setSelectedCharacter(null);
  };

  const handleChangeCharacter = () => {
    setSelectedCharacter(null);
  };

  // If splash screen is showing, render it first
  if (showSplash) {
    return <SplashScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-info" element={<UserInfoForm onFormSubmit={handleUserFormSubmit} />} />
          <Route 
            path="/characters" 
            element={
              <CharacterSelection 
                onCharacterSelect={handleCharacterSelect}
                userData={userData}
              />
            } 
          />
          <Route 
            path="/character-room" 
            element={
              <CharacterRoom 
                character={selectedCharacter}
                userData={userData}
                onEndCall={handleEndCall}
                onChangeCharacter={handleChangeCharacter}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
