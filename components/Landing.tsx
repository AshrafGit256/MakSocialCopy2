import React from 'react';

interface LandingProps { onStart: () => void; }

const LandingV1: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="landing-root">

      {/* Navbar */}
      <header className="nav-section">
        <div className="logo">MakSocial</div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#community">Community</a>
          <a href="#testimonials">Testimonials</a>
        </nav>
        <button onClick={onStart}>Get Started</button>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Connect. Share. Belong.</h1>
          <p>The official social platform for Makerere University students, lecturers, alumni and friends.</p>
          <button onClick={onStart}>Join MakSocial</button>
        </div>
        <div className="hero-image">
          <img src="https://source.unsplash.com/1600x900/?university,campus,students" alt="Makerere University Campus" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <h2>What You Can Do</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="https://source.unsplash.com/400x400/?students,group" alt="Connect" />
            <h3>Connect With Community</h3>
            <p>Chat with classmates, form study groups, and engage instantly.</p>
          </div>
          <div className="feature-card">
            <img src="https://source.unsplash.com/400x400/?lecture,classroom" alt="Learn" />
            <h3>Academic Updates</h3>
            <p>Receive announcements and share notes with your class.</p>
          </div>
          <div className="feature-card">
            <img src="https://source.unsplash.com/400x400/?career,jobfair" alt="Opportunities" />
            <h3>Opportunities Board</h3>
            <p>Find internships, events, and career resources.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="community" className="stats-section">
        <div className="stat">
          <h3>50k+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat">
          <h3>120+</h3>
          <p>Clubs & Communities</p>
        </div>
        <div className="stat">
          <h3>500+</h3>
          <p>Events Shared</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section">
        <h2>How It Works</h2>
        <ol>
          <li>Create your profile</li>
          <li>Follow your interests</li>
          <li>Start engaging</li>
        </ol>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <h2>What Students Are Saying</h2>
        <div className="testimonials-grid">
          <blockquote>
            <p>"MakSocial keeps me updated with class announcements and connects me with my study group."</p>
            <cite>— Student</cite>
          </blockquote>
          <blockquote>
            <p>"I found my internship through the opportunities board here."</p>
            <cite>— Alumni</cite>
          </blockquote>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Start Your MakSocial Journey</h2>
        <button onClick={onStart}>Create Your Account</button>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        © 2026 MakSocial • Makerere University
      </footer>

    </div>
  );
};

export default LandingV1;
