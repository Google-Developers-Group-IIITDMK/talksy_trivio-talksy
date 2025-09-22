import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen/SplashScreen';
import UserInfoForm from './components/UserInfoForm/UserInfoForm';
import CharacterSelection from './components/CharacterSelection/CharacterSelection';
import CharacterRoom from './components/CharacterRoom/CharacterRoom';

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userData, setUserData] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Screen navigation handlers
  const handleLoadingComplete = () => {
    setCurrentScreen('userInfo');
  };

  const handleUserFormSubmit = (data) => {
    setUserData(data);
    setCurrentScreen('characterSelection');
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setCurrentScreen('characterRoom');
  };

  const handleEndCall = () => {
    setSelectedCharacter(null);
    setCurrentScreen('characterSelection');
  };

  const handleChangeCharacter = () => {
    setSelectedCharacter(null);
    setCurrentScreen('characterSelection');
  };

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onLoadingComplete={handleLoadingComplete} />;
      
      case 'userInfo':
        return <UserInfoForm onFormSubmit={handleUserFormSubmit} />;
      
      case 'characterSelection':
        return (
          <CharacterSelection 
            onCharacterSelect={handleCharacterSelect}
            userData={userData}
          />
        );
      
      case 'characterRoom':
        return (
          <CharacterRoom 
            character={selectedCharacter}
            userData={userData}
            onEndCall={handleEndCall}
            onChangeCharacter={handleChangeCharacter}
          />
        );
      
      default:
        return <SplashScreen onLoadingComplete={handleLoadingComplete} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;