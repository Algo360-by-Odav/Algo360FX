// StandaloneRoute.js
// A component that renders routes without the main app navigation

import React from 'react';
import { Routes, Route } from 'react-router-dom';

const StandaloneRoute = ({ routes }) => {
  return React.createElement(Routes, {}, 
    routes.map(route => 
      React.createElement(Route, {
        key: route.path,
        path: route.path,
        element: route.element
      })
    )
  );
};

export default StandaloneRoute;
