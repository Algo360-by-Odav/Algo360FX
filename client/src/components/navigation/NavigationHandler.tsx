import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NavigationHandler listens for custom navigation events
 * and uses React Router's navigate function to handle them
 */
const NavigationHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Event listener for custom navigation events
    const handleNavigation = (event: CustomEvent) => {
      const path = event.detail?.path;
      if (path) {
        console.log(`NavigationHandler: Navigating to ${path}`);
        navigate(path);
      }
    };

    // Add event listener
    window.addEventListener('navigate', handleNavigation as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener);
    };
  }, [navigate]);

  // This component doesn't render anything
  return null;
};

export default NavigationHandler;
