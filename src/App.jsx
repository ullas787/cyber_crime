
import './App.css'

const threats = [
  {
    icon: '🎣',
    title: 'Phishing Attacks',
    description: 'Learn how fake emails, messages and websites trick people into sharing personal information.',
  },
  {
    icon: '💳',
    title: 'Online Payment Scams',
    description: 'Understand UPI fraud, fake payment requests and common financial scams.',
  },
  {
    icon: '🔐',
    title: 'Identity Theft',
    description: 'Discover how criminals misuse personal information and how to protect your identity.',
  },
]

function App() {
  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <a href="#" className="brand">
          🛡️ Cyber<span>Shield</span>
        </a>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#threats">Learn</a>
          <a href="#safety">Safety Tips</a>
          <a href="#about">About</a>
        </div>

        <a href="#learn" className="nav-button">
          Get Started ↗
        </a>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="hero">
          <div className="hero-content">

            <div className="eyebrow">
              <span className="live-dot"></span>
              YOUR DIGITAL SAFETY STARTS HERE
            </div>

            <h1>
              Stay Safe in a
              <br />
              <span>Connected World.</span>
            </h1>

            <p>
              The internet is full of opportunities, but also hidden threats.
              Learn to identify digital fraud, protect your information
              and stay one step ahead of cybercriminals.
            </p>

            <div className="hero-buttons">
              <a href="#threats" className="primary-button">
                Explore Cyber Threats →
              </a>

              <a href="#safety" className="secondary-button">
                Learn Safety Tips
              </a>
            </div>

            <div className="hero-note">
              ✓ Learn • Identify • Protect
            </div>
          </div>

          <div className="shield-visual">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="shield-glow">
              <div className="shield-symbol">🛡️</div>
            </div>

            <div className="floating-tag tag-one">
              🔒 Secure
            </div>

            <div className="floating-tag tag-two">
              🛡️ Protected
            </div>
          </div>
        </section>

        {/* Project Steps */}
        <section className="stats">
          <div>
            <h2>01</h2>
            <p>Understand threats</p>
          </div>

          <div>
            <h2>02</h2>
            <p>Recognize fraud</p>
          </div>

          <div>
            <h2>03</h2>
            <p>Protect yourself</p>
          </div>

          <div>
            <h2>04</h2>
            <p>Stay informed</p>
          </div>
        </section>

        {/* Cyber Threats */}
        <section className="threats section" id="threats">
          <div className="section-heading">
            <span className="section-label">KNOW THE RISKS</span>
            <h2>Common Cyber Threats</h2>
            <p>
              Understanding common online threats is the first step
              towards protecting yourself.
            </p>
          </div>

          <div className="threat-grid">
            {threats.map((threat) => (
              <article className="threat-card" key={threat.title}>
                <div className="threat-icon">
                  {threat.icon}
                </div>

                <h3>{threat.title}</h3>
                <p>{threat.description}</p>

                <a href="#learn">Learn more ↗</a>
              </article>
            ))}
          </div>
        </section>

        {/* Safety Tips */}
        <section className="safety section" id="safety">
          <div className="section-heading">
            <span className="section-label">STAY PROTECTED</span>
            <h2>Simple Steps. Stronger Security.</h2>
            <p>
              Build safer digital habits with these essential practices.
            </p>
          </div>

          <div className="safety-grid">
            <div className="safety-item">
              <span>🔑</span>
              <div>
                <h3>Use Strong Passwords</h3>
                <p>Create unique passwords and never share them with anyone.</p>
              </div>
            </div>

            <div className="safety-item">
              <span>🔗</span>
              <div>
                <h3>Verify Before Clicking</h3>
                <p>Check website addresses before opening suspicious links.</p>
              </div>
            </div>

            <div className="safety-item">
              <span>📱</span>
              <div>
                <h3>Enable Two-Factor Authentication</h3>
                <p>Add another layer of protection to your important accounts.</p>
              </div>
            </div>

            <div className="safety-item">
              <span>🚨</span>
              <div>
                <h3>Report Suspicious Activity</h3>
                <p>Report suspected digital fraud through appropriate channels.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta" id="learn">
          <span className="section-label">TAKE CONTROL</span>

          <h2>Your Safety. Your Responsibility.</h2>

          <p>
            Knowledge is your strongest defence against digital fraud.
            Start learning how to protect yourself today.
          </p>

          <a href="#threats" className="primary-button">
            Start Learning →
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" id="about">
        <a href="#" className="brand">
          🛡️ Cyber<span>Shield</span>
        </a>

        <p>Building awareness. Preventing digital fraud.</p>

        <span>© 2026 CyberShield. All rights reserved.</span>
      </footer>

    </div>
  )
}

export default App
