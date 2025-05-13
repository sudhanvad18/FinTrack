import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AboutPage.css'

function AboutPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#founders') {
      const el = document.getElementById('founders-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    }

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
        className="about-video"
        autoPlay
        loop
        muted
        playsInline
        src="https://i.imgur.com/RCoLmZ9.mp4"
      />

      {/* 🔼 Top navbar centered like on home screen */}
      <div className="about-navbar-wrapper">
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
      </div>

      <div className="about-page-scroll">
        <section className="about-section" id="about-section">
          <h1>About <span className="highlight">FinTrack</span></h1>
          <p>
            FinTrack is an intuitive, natural-language–powered stock strategy builder.
            Just describe your idea — whether it’s backtesting a moving average crossover,
            analyzing tech stocks, or deploying a momentum strategy — and our AI handles the rest.
          </p>
        </section>

        <section className="founders-section" id="founders-section">
          <h2>Founders</h2>
          <p>Meet the team behind FinTrack:</p>
          <ul>
            <li><a href="https://www.linkedin.com/in/vishruthg/" target="_blank" rel="noopener noreferrer"><strong>Vishruth</strong></a> – Frontend</li>
            <li><a href="https://www.linkedin.com/in/ronilmitra/" target="_blank" rel="noopener noreferrer"><strong>Ronil</strong></a> – Frontend</li>
            <li><a href="https://www.linkedin.com/in/kalyan-archakam/" target="_blank" rel="noopener noreferrer"><strong>Kalyan</strong></a> – Backend</li>
            <li><a href="https://www.linkedin.com/in/sudhanva-deshpande-81a94a280/" target="_blank" rel="noopener noreferrer"><strong>Sudhanva</strong></a> – Backend</li>
            <li><a href="https://www.linkedin.com/in/navan-dendukuri-64a03b360/" target="_blank" rel="noopener noreferrer"><strong>Navan</strong></a> – Backend</li>
          </ul>
        </section>
      </div>
    </>
  )
}

export default AboutPage
