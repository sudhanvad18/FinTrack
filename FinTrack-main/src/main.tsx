import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import './styles/index.css'
import App from './App'
import AboutPage from './components/AboutPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain="fintrack-dev.us.auth0.com"
      clientId="tM4JJsEXpaSaYU84C7aXxlp0bWhXcwyM"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
)
