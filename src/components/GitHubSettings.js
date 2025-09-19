import React, { useState, useEffect } from 'react';
import { validateGitHubToken, saveToGitHub, getGitHubRateLimit } from '../utils/githubApi';

/**
 * GitHub Settings component for managing auto-sync
 */
const GitHubSettings = ({ onClose, currentDataset, championData }) => {
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [rateLimit, setRateLimit] = useState(null);

  // Load saved settings
  useEffect(() => {
    const savedToken = localStorage.getItem('githubToken');
    const savedAutoSync = localStorage.getItem('githubAutoSync') === 'true';
    const savedLastSync = localStorage.getItem('githubLastSync');
    
    if (savedToken) {
      setToken(savedToken);
      validateToken(savedToken);
    }
    setAutoSync(savedAutoSync);
    setLastSync(savedLastSync);
  }, []);

  const validateToken = async (tokenToValidate) => {
    setIsValidating(true);
    try {
      const isValid = await validateGitHubToken(tokenToValidate);
      setIsValidToken(isValid);
      
      if (isValid) {
        const rateLimitInfo = await getGitHubRateLimit(tokenToValidate);
        setRateLimit(rateLimitInfo);
      }
    } catch (error) {
      setIsValidToken(false);
    }
    setIsValidating(false);
  };

  const handleTokenChange = (e) => {
    const newToken = e.target.value;
    setToken(newToken);
    if (newToken) {
      validateToken(newToken);
    } else {
      setIsValidToken(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('githubToken', token);
    localStorage.setItem('githubAutoSync', autoSync.toString());
    alert('Settings saved!');
  };

  const manualSync = async () => {
    if (!isValidToken || !token) {
      alert('Please enter a valid GitHub token first');
      return;
    }

    setIsSyncing(true);
    try {
      const filename = `${currentDataset.charAt(0).toUpperCase() + currentDataset.slice(1)}.json`;
      await saveToGitHub(filename, championData, token);
      
      const now = new Date().toISOString();
      setLastSync(now);
      localStorage.setItem('githubLastSync', now);
      
      alert('Successfully synced to GitHub!');
    } catch (error) {
      alert(`Sync failed: ${error.message}`);
    }
    setIsSyncing(false);
  };

  const clearSettings = () => {
    if (confirm('Clear all GitHub settings?')) {
      localStorage.removeItem('githubToken');
      localStorage.removeItem('githubAutoSync');
      localStorage.removeItem('githubLastSync');
      setToken('');
      setIsValidToken(false);
      setAutoSync(false);
      setLastSync(null);
    }
  };

  return (
    <div className="github-settings-overlay">
      <div className="github-settings-modal">
        <div className="github-settings-header">
          <h3>🔗 GitHub Integration Settings</h3>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        <div className="github-settings-content">
          <div className="setting-section">
            <label htmlFor="github-token">GitHub Personal Access Token:</label>
            <div className="token-input-group">
              <input
                id="github-token"
                type="password"
                value={token}
                onChange={handleTokenChange}
                placeholder="ghp_xxxxxxxxxxxxxxxx"
                className="token-input"
              />
              <div className="token-status">
                {isValidating && <span className="validating">⏳ Validating...</span>}
                {!isValidating && isValidToken && <span className="valid">✅ Valid</span>}
                {!isValidating && token && !isValidToken && <span className="invalid">❌ Invalid</span>}
              </div>
            </div>
            <div className="token-help">
              <p>📋 <strong>How to get your token:</strong></p>
              <ol>
                <li>Go to GitHub.com → Settings → Developer settings</li>
                <li>Click "Personal access tokens" → "Tokens (classic)"</li>
                <li>Generate new token with <strong>repo</strong> scope only</li>
                <li>Copy and paste the token above</li>
              </ol>
            </div>
          </div>

          <div className="setting-section">
            <label>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                disabled={!isValidToken}
              />
              Enable auto-sync (saves to GitHub automatically)
            </label>
          </div>

          {rateLimit && (
            <div className="setting-section">
              <div className="rate-limit-info">
                <h4>GitHub API Rate Limit:</h4>
                <p>Remaining: {rateLimit.rate.remaining} / {rateLimit.rate.limit}</p>
                <p>Resets: {new Date(rateLimit.rate.reset * 1000).toLocaleTimeString()}</p>
              </div>
            </div>
          )}

          {lastSync && (
            <div className="setting-section">
              <p><strong>Last sync:</strong> {new Date(lastSync).toLocaleString()}</p>
            </div>
          )}

          <div className="github-settings-actions">
            <button 
              onClick={manualSync} 
              disabled={!isValidToken || isSyncing}
              className="sync-button"
            >
              {isSyncing ? '⏳ Syncing...' : '🔄 Sync Now'}
            </button>
            
            <button 
              onClick={saveSettings}
              disabled={!token}
              className="save-button"
            >
              💾 Save Settings
            </button>
            
            <button 
              onClick={clearSettings}
              className="clear-button"
            >
              🗑️ Clear Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubSettings;