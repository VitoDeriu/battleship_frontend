import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //Attention j'ai désactiver le strictmode pour la connexion au websocket !
  //<React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
  //</React.StrictMode>
);

reportWebVitals();
