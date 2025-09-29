import React, { useState, useEffect } from "react";
import { 
  FaHome, 
  FaRobot, 
  FaBullseye, 
  FaEnvelope, 
  FaUserPlus, 
  FaSignInAlt, 
  FaArrowRight, 
  FaLightbulb, 
  FaClock, 
  FaLock,
  FaBars,
  FaTimes
} from "react-icons/fa";
import "./Intro.css";

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    // Replace with your navigation logic
    window.location.href = path;
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/intro" className="nav-logo">Penn Chatbot</a>
        
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="/intro" onClick={() => setMobileMenuOpen(false)}>
              <FaHome className="nav-icon" /> Home
            </a>
          </li>
          <li>
            <a href="/app" onClick={() => setMobileMenuOpen(false)}>
              <FaRobot className="nav-icon" /> Chatbot
            </a>
          </li>
          <li>
            <a href="/about" onClick={() => setMobileMenuOpen(false)}>
              <FaBullseye className="nav-icon" /> About
            </a>
          </li>
          <li>
            <a href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <FaEnvelope className="nav-icon" /> Contact
            </a>
          </li>
          <li>
            <a href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <FaUserPlus className="nav-icon" /> Sign Up
            </a>
          </li>
          <li>
            <a href="/login" onClick={() => setMobileMenuOpen(false)}>
              <FaSignInAlt className="nav-icon" /> Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function WordCarousel({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="word-carousel">
      <span className={`word-carousel-word ${isVisible ? 'word-visible' : 'word-hidden'}`}>
        {words[currentIndex]}
      </span>
    </span>
  );
}

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationId;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / 2000, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * target);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [target]);

  return <>{count.toLocaleString()}{suffix}</>;
}

function Intro() {
  const words = ["Smart", "Fast", "Helpful", "Available 24/7", "Reliable"];

  const handleGetStarted = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="intro-container">
      <NavBar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <FaLightbulb />
            <span>AI-Powered Assistant for Penn Students</span>
          </div>
          
          <h1 className="hero-title">
            Your <span className="hero-title-highlight">Penn High School</span> Assistant
          </h1>
          
          <p className="hero-subtitle">
            <WordCarousel words={words} />
          </p>
          
          <p className="hero-description">
            Get instant answers to all your school questions. From schedule changes to event updates, 
            Penn Chatbot has you covered 24/7.
          </p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleGetStarted}>
              Get Started Free
              <FaArrowRight />
            </button>
            <a href="/app" className="btn btn-secondary">
              Try Demo
            </a>
          </div>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">
                <AnimatedCounter target={1200} suffix="+" />
              </span>
              <span className="hero-stat-label">Active Students</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">
                <AnimatedCounter target={5000} suffix="+" />
              </span>
              <span className="hero-stat-label">Questions Answered</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">24/7</span>
              <span className="hero-stat-label">Always Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Students Love Penn Chatbot</h2>
            <p className="section-subtitle">
              Everything you need to stay informed and succeed at Penn High School
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaLightbulb />
              </div>
              <h3 className="feature-title">Instant Answers</h3>
              <p className="feature-description">
                Get immediate responses to your questions about schedules, events, policies, and more.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3 className="feature-title">24/7 Availability</h3>
              <p className="feature-description">
                Access help anytime, anywhere. No more waiting until school hours for answers.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaLock />
              </div>
              <h3 className="feature-title">Safe & Secure</h3>
              <p className="feature-description">
                Your privacy matters. All conversations are encrypted and your data is protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What Can You Ask?</h2>
            <p className="section-subtitle">
              Real questions from Penn students, answered instantly
            </p>
          </div>
          
          <div className="use-cases-grid">
            <div className="use-case-card">
              <div className="use-case-icon">📅</div>
              <h4 className="use-case-title">Schedule Changes</h4>
              <p className="use-case-example">
                "The soccer game got cancelled today, when is it going to be rescheduled?"
              </p>
            </div>
            
            <div className="use-case-card">
              <div className="use-case-icon">🏫</div>
              <h4 className="use-case-title">School Events</h4>
              <p className="use-case-example">
                "What time does the homecoming dance start this Friday?"
              </p>
            </div>
            
            <div className="use-case-card">
              <div className="use-case-icon">📚</div>
              <h4 className="use-case-title">Academic Info</h4>
              <p className="use-case-example">
                "When is the last day to drop a class this semester?"
              </p>
            </div>
            
            <div className="use-case-card">
              <div className="use-case-icon">🚌</div>
              <h4 className="use-case-title">Transportation</h4>
              <p className="use-case-example">
                "Is bus route 5 running on a delay this morning?"
              </p>
            </div>
            
            <div className="use-case-card">
              <div className="use-case-icon">🎭</div>
              <h4 className="use-case-title">Clubs & Activities</h4>
              <p className="use-case-example">
                "Where does drama club meet after school?"
              </p>
            </div>
            
            <div className="use-case-card">
              <div className="use-case-icon">📢</div>
              <h4 className="use-case-title">Announcements</h4>
              <p className="use-case-example">
                "Are there any important announcements for today?"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title" style={{ color: 'white' }}>Our Impact</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Helping Penn students stay connected and informed
            </p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">
                <AnimatedCounter target={99} suffix="%" />
              </span>
              <span className="stat-label">Accuracy Rate</span>
              <span className="stat-description">Consistently reliable answers</span>
            </div>
            
            <div className="stat-card">
              <span className="stat-number">
                <AnimatedCounter target={1200} suffix="+" />
              </span>
              <span className="stat-label">Active Students</span>
              <span className="stat-description">Growing every day</span>
            </div>
            
            <div className="stat-card">
              <span className="stat-number">&lt;30s</span>
              <span className="stat-label">Avg Response Time</span>
              <span className="stat-description">Lightning fast answers</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join over 1,200 Penn students using the chatbot every day
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleGetStarted}>
              Sign Up Free
              <FaArrowRight />
            </button>
            <a href="/app" className="btn btn-secondary">
              Try Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            © 2025 Penn Chatbot. Made for Penn High School students.
          </p>
          <ul className="footer-links">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Intro;