import React, { useRef } from 'react';

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
  onExportData,
  onImportData
}) => {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await onImportData(file);
        alert('Data imported successfully!');
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
      // Reset the file input
      event.target.value = '';
    }
  };
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
            onClick={onExportData}
            className="export-button"
            title="Download current champion data as JSON file"
          >
            📥 Export
          </button>
          
          <button
            onClick={handleImportClick}
            className="import-button"
            title="Import champion data from JSON file"
          >
            📤 Import
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <button
            onClick={onResetData}
            className="reset-button"
            title="Reset all champion data"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="sorting-controls-info">
        {currentSortingMethod === 'alphabetical' && (
          <div className="sorting-info">
            Champions are grouped by first letter and sorted alphabetically.
          </div>
        )}
        
        {currentSortingMethod === 'tier' && (
          <div className="sorting-info">
            Champions are grouped by tier (S, A, B, C, D, F, None). 
            {supportsDragDrop && ' Drag champions between tiers to update their tier.'}
          </div>
        )}
        
        {currentSortingMethod === 'difficulty' && (
          <div className="sorting-info">
            Champions are grouped by difficulty level. 
            {supportsDragDrop && ' Drag champions between difficulty levels to update their difficulty.'}
          </div>
        )}
        
        {currentSortingMethod === 'attempts' && (
          <div className="sorting-info">
            Champions are grouped by number of attempts. 
            {supportsDragDrop && ' Drag champions between attempt groups to update their attempt count.'}
          </div>
        )}
        
        <div className="persistence-info">
          💾 <strong>Data Persistence:</strong> Changes are saved locally in your browser. 
          Use <strong>Export</strong> to download your data as a file, and <strong>Import</strong> to restore it later or share with others.
        </div>
      </div>

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