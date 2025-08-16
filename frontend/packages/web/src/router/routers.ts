import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Páginas
import { Home } from '../pages/client/Home';
import ClientLayout from '../Layout/ClientLayout';
import LandingPage from '../pages/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: React.createElement(LandingPage),
  },
  {
    path: '/client',
    element: React.createElement(ClientLayout),
    children: [
      {
        index: true,
        element: React.createElement(Home),
      },
      // Catch all - redirect to home
      {
        path: '*',
        element: React.createElement(Navigate, { to: "/client", replace: true }),
      },
    ],
  },
]);

export default router;
