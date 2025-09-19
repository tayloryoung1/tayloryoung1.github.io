import React from 'react';
import './App.css';

function App() {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li><a href="#welcome" onClick={(e) => handleNavClick(e, '#welcome')}>Home</a></li>
          <li><a href="#experience" onClick={(e) => handleNavClick(e, '#experience')}>Experience</a></li>
          <li><a href="#projects" onClick={(e) => handleNavClick(e, '#projects')}>Projects</a></li>
          <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a></li>
        </ul>
      </nav>

      <section id="welcome">
        <h1>Welcome to My Portfolio</h1>
        <p>Hi, I'm Taylor - Software Developer</p>
      </section>

      <section id="experience">
        <div className="container">
          <h2>Work Experience</h2>
          <div className="experience-item">
            <h3>Software Developer - Allyant</h3>
            <p>3/10/2025 - Present</p>
            <ul>
              <li>Responsibility/Achievement 1</li>
              <li>Responsibility/Achievement 2</li>
              <li>Responsibility/Achievement 3</li>
            </ul>
          </div>
          <div className="experience-item">
            <h3>Delphi Developer Jr. - Oxley Enterprises</h3>
            <p>2/20/2024 - 3/7/2025</p>
            <ul>
              <li>Responsibility/Achievement 1</li>
              <li>Responsibility/Achievement 2</li>
              <li>Responsibility/Achievement 3</li>
            </ul>
          </div>
          <div className="experience-item">
            <h3>Jr. Software Developer - Construction Monitor</h3>
            <p>4/20/2022 - 2/16/2024</p>
            <ul>
              <li>Responsibility/Achievement 1</li>
              <li>Responsibility/Achievement 2</li>
              <li>Responsibility/Achievement 3</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="container">
          <h2>Projects</h2>
          <div className="project-item">
            <h3>Full Stack Maze API</h3>
            <p>Brief description of the project and technologies used</p>
            <a href="#">Link to project</a>
          </div>
          <div className="project-item">
            <h3>Regex Speed Tester</h3>
            <p>Brief description of the project and technologies used</p>
            <a href="#">Link to project</a>
          </div>
          <div className="project-item">
            <h3>Python APIs</h3>
            <p>Brief description of the project and technologies used</p>
            <a href="#">Link to project</a>
          </div>
        </div>
      </section>

      <section id="about">
        <div className="container">
          <h2>About Me</h2>
          <p>I'm Taylor Young, I love development pls hire</p>
        </div>
      </section>
    </div>
  );
}

export default App;
