import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaRobot, FaBullseye, FaEnvelope, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUsers, FaUser, FaArrowRight, FaCheck, FaLightbulb, FaClock, FaLock, FaChevronDown } from "react-icons/fa";
import "./Intro.css";

function NavBar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-logo">Penn Chatbot</div>
      <ul className="nav-links">
        <li>
          <a onClick={() => scrollToSection('hero')}>
            <FaHome className="nav-icon" /> Home
          </a>
        </li>
        <li>
          <a href="/app">
            <FaRobot className="nav-icon" /> Chatbot
          </a>
        </li>
        <li>
          <a onClick={() => scrollToSection('features')}>
            <FaBullseye className="nav-icon" /> Features
          </a>
        </li>
        <li>
          <a href="/contact">
            <FaEnvelope className="nav-icon" /> Contact
          </a>
        </li>
        <li>
          <a href="/signup">
            <FaUserPlus className="nav-icon" /> Register
          </a>
        </li>
        <li>
          <a href="/login">
            <FaSignInAlt className="nav-icon" /> Login
          </a>
        </li>
      </ul>
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

  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);

  return (
    <div className="loader">
      <span className="loader-prefix">Chatbot is</span>
      <div className="words" style={{ 
        minWidth: `${longestWord.length * 0.6}em`,
        display: 'inline-block',
        textAlign: 'left'
      }}>
        <span 
          className={`word ${isVisible ? 'word-visible' : 'word-hidden'}`}
        >
          {words[currentIndex]}
        </span>
      </div>
    </div>
  );
}

function AnimatedCounter({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationId;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
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
  }, [isVisible, target, duration]);

  return (
    <span ref={counterRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function MatrixAnimation() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 25 }, (_, index) => ({
        id: index,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 4,
        left: (index * 4) + Math.random() * 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="matrix-pattern">
      {particles.map((particle) => (
        <div 
          key={particle.id} 
          className="matrix-column"
          style={{
            left: `${particle.left}%`,
            animationDelay: `-${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className={`feature-card ${isVisible ? 'feature-card-visible' : ''}`}
    >
      <div className="feature-icon-wrapper">
        <Icon className="feature-icon" />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('features');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`scroll-indicator ${isVisible ? 'scroll-indicator-visible' : ''}`}
      onClick={scrollToNext}
    >
      <FaChevronDown className="scroll-arrow" />
      <span>Discover More</span>
    </div>
  );
}

function Intro() {
  const navigate = useNavigate();
  const words = [" Empowering", " Intelligent", " Innovative", " Supportive", " Revolutionary"];

  const handleStart = () => {
    navigate("/signup");
  };

  const scrollToDemo = () => {
    const demoSection = document.getElementById('stats');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="intro-container">
      <NavBar />

      {/* Enhanced Hero Section */}
      <section id="hero" className="intro-hero">
        <div className="split-container">
          <div className="left-panel">
            <div className="content-wrapper">
              <div className="card">
                <WordCarousel words={words} />
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="content-wrapper">
              <h1 className="welcome-title">
                Welcome to the <span className="brand">Penn Chatbot</span>
              </h1>
              <p className="description">
                Your personalized academic assistant from Penn High School. Get instant answers, study help, and academic guidance powered by advanced AI technology.
              </p>
              <div className="hero-buttons">
                <button className="start-button" onClick={handleStart}>
                  Get Started Free
                  <FaArrowRight className="button-icon" />
                </button>
                <button className="demo-button" onClick={scrollToDemo}>
                  View Demo
                </button>
              </div>
              <div className="trust-indicators">
                <div className="trust-item">
                  <FaCheck className="trust-icon" />
                  <span>Trusted by 1,200+ students</span>
                </div>
                <div className="trust-item">
                  <FaLock className="trust-icon" />
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ScrollIndicator />
      </section>

      {/* New Features Section */}
      <section id="features" className="features-section">
        <div className="features-content">
          <div className="section-header">
            <h2 className="section-title">Why Choose Penn Chatbot?</h2>
            <p className="section-subtitle">
              Discover the features that make learning easier and more effective
            </p>
          </div>
          <div className="features-grid">
            <FeatureCard 
              icon={FaLightbulb}
              title="Smart Learning"
              description="Get personalized study recommendations based on your learning patterns and academic goals."
              delay={0}
            />
            <FeatureCard 
              icon={FaClock}
              title="24/7 Availability"
              description="Access academic help anytime, anywhere. Never let a question wait until tomorrow."
              delay={200}
            />
            <FeatureCard 
              icon={FaLock}
              title="Safe & Secure"
              description="Your privacy matters. All conversations are encrypted and your data is protected."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Enhanced First Stat Panel */}
      <section id="stats" className="first-stat-panel">
        <div className="first-stat-split">
          <div className="first-stat-left">
            <div className="first-stat-content">
              <h3 className="first-stat-title">
                <AnimatedCounter target={5000} suffix="+" />
              </h3>
              <p className="first-stat-description">Questions Answered</p>
              <div className="stat-details">
                <p>Helping students succeed every day with instant, accurate responses to academic questions.</p>
              </div>
            </div>
          </div>
          <div className="first-stat-right">
            <MatrixAnimation />
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="stats-section">
        <div className="stats-content">
          <h2>Our Impact in Numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3><AnimatedCounter target={99} suffix="%" /></h3>
              <p>Accuracy Rate</p>
              <span className="stat-detail">Consistently reliable answers</span>
            </div>
            <div className="stat-card">
              <FaUser className="stat-icon" />
              <h3><AnimatedCounter target={1200} suffix="+" /></h3>
              <p>Active Students</p>
              <span className="stat-detail">Growing community</span>
            </div>
            <div className="stat-card">
              <h3>24/7</h3>
              <p>Support Available</p>
              <span className="stat-detail">Always here to help</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-text">
            <h2>Ready to Transform Your Learning?</h2>
            <p>Join thousands of students who are already succeeding with Penn Chatbot</p>
          </div>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={handleStart}>
              Start Learning Today
              <FaArrowRight className="button-icon" />
            </button>
            <a href="/app" className="cta-secondary">
              Try Demo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Intro;