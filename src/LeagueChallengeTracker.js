import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function LeagueChallengeTracker() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Back to Portfolio</Link></li>
        </ul>
      </nav>
      
      <section style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>League Challenge Tracker</h1>
        <h2>WIP</h2>
        <p>This project is currently under development.</p>
      </section>
    </div>
  );
}

export default LeagueChallengeTracker;