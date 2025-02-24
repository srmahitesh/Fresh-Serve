import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import App from './App.jsx';
import ItemsList from './Components/ItemsList.jsx';
import SlideShow from './Components/SlideShow.jsx';
import Product_Detailed from './Components/Product_Detailed.jsx';
import LoginPage from './Components/LoginPage.jsx';
import SignUpPage from './Components/SignUpPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <SlideShow /> }, // Corrected for home path
      {
        path: 'shop',
        element: <ItemsList />, 
        children: [
          { path: ':pageId', element: <ItemsList /> },
        ]
      },
      {path: 'product/:productId', element: <Product_Detailed/>},
      {path: 'login', element: <LoginPage/>},
      {path: 'signup', element: <SignUpPage/>}
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
