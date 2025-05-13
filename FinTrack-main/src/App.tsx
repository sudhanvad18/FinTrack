import { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import ChatInput from './components/chatinput'
import MessageBubble from './components/MessageBubble'
import './styles/App.css'

type Message = { role: 'user' | 'bot'; text: string }
type Session = { id: number; title: string; messages: Message[] }

function App() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showPrompt, setShowPrompt] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, title: 'Session 1', messages: [] }
  ])
  const [activeSessionId, setActiveSessionId] = useState(1)
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0]
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleSend = async (text: string) => {
    const userMessage: Message = { role: 'user', text }
    setSessions(prev =>
      prev.map(session =>
        session.id === activeSessionId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      )
    )
    setShowPrompt(false)

    try {
      const res = await fetch('https://fintrack-backend-8dji.onrender.com/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: text })
      });

      const data = await res.json()
      const botText = data.strategy_code || data.error || 'Error: Empty response.'

      const botMessage: Message = { role: 'bot', text: botText }
      setSessions(prev =>
        prev.map(session =>
          session.id === activeSessionId
            ? { ...session, messages: [...session.messages, botMessage] }
            : session
        )
      )
    } catch (err) {
      const errorMessage: Message = { role: 'bot', text: '⚠️ Error: Failed to connect to server.' }
      setSessions(prev =>
        prev.map(session =>
          session.id === activeSessionId
            ? { ...session, messages: [...session.messages, errorMessage] }
            : session
        )
      )
    }
  }

  const handleNewChat = () => {
    const newId = sessions.length + 1
    const newSession: Session = { id: newId, title: `Session ${newId}`, messages: [] }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newId)
    setShowPrompt(true)
  }

  const suggestions = [
    'Enter a stock trading strategy...',
    'Backtest a moving average crossover...',
    'Analyze S&P 500 signals...',
    'Try a momentum-based portfolio...',
    'Run a mean reversion strategy...',
    'Backtest Bollinger Band breakouts...'
  ]
  const [currentSuggestion, setCurrentSuggestion] = useState(suggestions[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion(prev => {
        let next = prev
        while (next === prev) {
          next = suggestions[Math.floor(Math.random() * suggestions.length)]
        }
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      if (videoRef.current) {
        if (document.visibilityState === 'visible') {
          videoRef.current.play().catch(() => {})
        } else {
          videoRef.current.pause()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        src="https://i.imgur.com/RCoLmZ9.mp4"
      />

      <div className="app-container">
        {sidebarOpen && (
          <aside className="sidebar">
            <div className="sidebar-header">
              <img
                src="/image.png"
                alt="Collapse Sidebar"
                className="sidebar-icon"
                onClick={() => setSidebarOpen(false)}
              />
              <h1 className="site-title">FinTrack</h1>
              <img
                src="/newchat.png"
                alt="New Chat"
                className="sidebar-icon"
                onClick={handleNewChat}
              />
            </div>

            <div className="history-list">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`history-item ${session.id === activeSessionId ? 'active' : ''}`}
                  onClick={() => setActiveSessionId(session.id)}
                >
                  {session.title}
                </div>
              ))}
            </div>
          </aside>
        )}

        {!sidebarOpen && (
          <img
            src="/opensidebar.png"
            alt="Open Sidebar"
            className="open-sidebar-button"
            onClick={() => setSidebarOpen(true)}
          />
        )}

        <main className="main-panel">
          <div className="top-ui-wrapper">
            <div className="top-navbar">
              <img
                src="/Cropped_Image.png"
                className="nav-logo"
                alt="Logo"
                onClick={() => navigate('/')}
              />
              <span className="nav-link" onClick={() => navigate('/about')}>About</span>
              <span className="nav-link" onClick={() => navigate('/about#founders')}>Founders</span>
            </div>

            <div className="auth-buttons">
              {!isAuthenticated ? (
                <>
                  <span className="auth-link" onClick={() => loginWithRedirect()}>Login</span>
                  <span
                    className="auth-link"
                    onClick={() =>
                      loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
                    }
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <span className="auth-link" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                  Log Out
                </span>
              )}
            </div>
          </div>

          {showPrompt && (
            <div className="prompt-banner">
              <h2 className="prompt-text fade-in">How can I help you?</h2>
              <p className="suggestion-text">{currentSuggestion}</p>
            </div>
          )}

          <div className="chat-area">
            {activeSession.messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} text={msg.text} />
            ))}
          </div>

          <div className="chat-box-wrapper">
            <ChatInput onSend={handleSend} />
          </div>
        </main>
      </div>
    </>
  )
}

export default App
