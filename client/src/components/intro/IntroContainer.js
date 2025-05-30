// IntroContainer.js
// A container component that manages the intro state and transitions to the welcome page

import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';

const IntroContainer = ({ children }) => {
  const [showIntro, setShowIntro] = useState(true);
  
  // Check if intro was already shown in this session
  useEffect(() => {
    const introShown = sessionStorage.getItem('introShown');
    if (introShown) {
      setShowIntro(false);
    }
  }, []);
  
  const handleIntroComplete = () => {
    setShowIntro(false);
    // Remember that intro was shown in this session
    sessionStorage.setItem('introShown', 'true');
  };
  
  // If intro is active, show the splash screen
  if (showIntro) {
    return React.createElement(SplashScreen, { onComplete: handleIntroComplete });
  }
  
  // Otherwise, show the children (welcome page)
  return children;
};

export default IntroContainer;
