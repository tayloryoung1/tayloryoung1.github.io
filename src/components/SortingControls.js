import React, { useState, useEffect } from 'react';

/**
 * Sorting controls component
 * Provides UI for selecting different sorting methods and datasets
 */
const SortingControls = ({
  currentSortingMethod,
  onSortingMethodChange,
  sortingOptions,
  supportsDragDrop,
  onResetData,
  selectedCount,
  totalCount,
  currentDataset,
  onDatasetChange,
  datasetOptions,
  onOpenGitHubSettings
}) => {
  const [autoSyncStatus, setAutoSyncStatus] = useState({
    enabled: false,
    hasToken: false,
    lastSync: null
  });

  // Check auto-sync status
  useEffect(() => {
    const checkAutoSyncStatus = () => {
      const githubToken = localStorage.getItem('githubToken');
      const autoSync = localStorage.getItem('githubAutoSync') === 'true';
      const lastSync = localStorage.getItem('githubLastSync');
      
      setAutoSyncStatus({
        enabled: autoSync,
        hasToken: !!githubToken,
        lastSync: lastSync
      });
    };

    checkAutoSyncStatus();
    
    // Check periodically for changes
    const interval = setInterval(checkAutoSyncStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sorting-controls">
      <div className="sorting-controls-header">
        <h2>League Challenge Tracker</h2>
        <div className="champion-progress">
          <div className="champion-count">
            {selectedCount} of {totalCount} champions selected
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(selectedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="sorting-controls-main">
        <div className="sorting-method-selection">
          <label htmlFor="sorting-method">Sort by:</label>
          <select
            id="sorting-method"
            value={currentSortingMethod}
            onChange={(e) => onSortingMethodChange(e.target.value)}
            className="sorting-dropdown"
          >
            {sortingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="dataset-selection">
          <label htmlFor="dataset">Dataset:</label>
          <select
            id="dataset"
            value={currentDataset}
            onChange={(e) => onDatasetChange(e.target.value)}
            className="sorting-dropdown"
          >
            {datasetOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sorting-controls-buttons">
          {supportsDragDrop && (
            <div className="drag-drop-info">
              <span className="drag-drop-icon">↕️</span>
              <span>Drag & drop enabled</span>
            </div>
          )}
          
          <button
            onClick={onOpenGitHubSettings}
            className="github-button"
            title="GitHub Integration Settings"
          >
            🔗 GitHub
          </button>
          
          <button
            onClick={onResetData}
            className="reset-button"
            title="Reset all champion data"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Auto-sync status indicator */}
      {autoSyncStatus.hasToken && (
        <div className="persistence-info">
          {autoSyncStatus.enabled ? (
            <>
              <span>🔄 Auto-sync enabled</span>
              {autoSyncStatus.lastSync && (
                <span> - Last sync: {new Date(autoSyncStatus.lastSync).toLocaleTimeString()}</span>
              )}
            </>
          ) : (
            <span>⏸️ Auto-sync disabled (changes saved locally only)</span>
          )}
        </div>
      )}

      <div className="legend">
        <div className="legend-section">
          <h4>Tier Colors:</h4>
          <div className="legend-items">
            <span className="legend-item tier-s">S</span>
            <span className="legend-item tier-a">A</span>
            <span className="legend-item tier-b">B</span>
            <span className="legend-item tier-c">C</span>
            <span className="legend-item tier-d">D</span>
            <span className="legend-item tier-f">F</span>
          </div>
        </div>
        
        <div className="legend-section">
          <h4>Controls:</h4>
          <div className="legend-controls">
            <div>• Left click to select/deselect</div>
            <div>• Right click to set tier/difficulty/attempts</div>
            {supportsDragDrop && <div>• Drag & drop to move between sections</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingControls;