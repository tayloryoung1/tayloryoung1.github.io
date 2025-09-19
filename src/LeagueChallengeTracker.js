import React from 'react';
import { Link } from 'react-router-dom';
import { useChampionData } from './hooks/useChampionData';
import SortingControls from './components/SortingControls';
import ChampionGrid from './components/ChampionGrid';
import './App.css';

function LeagueChallengeTracker() {
  const {
    // Data
    allChampions,
    championData,
    sortedChampions,
    sortingMethod,
    
    // State
    isLoading,
    error,
    supportsDragDrop,
    
    // Actions
    toggleChampionSelection,
    updateFlag,
    moveChampionToSection,
    setSortingMethod,
    resetChampionData,
    getChampionStatus,
    getSortingOptions
  } = useChampionData();

  /**
   * Handle confirmation before resetting data
   */
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all champion data? This action cannot be undone.')) {
      resetChampionData();
    }
  };

  if (isLoading) {
    return (
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Back to Portfolio</Link></li>
          </ul>
        </nav>
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading champions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Back to Portfolio</Link></li>
          </ul>
        </nav>
        
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App league-challenge-tracker">
      <nav>
        <ul>
          <li><Link to="/">Back to Portfolio</Link></li>
        </ul>
      </nav>
      
      <main className="tracker-main">
        <SortingControls
          currentSortingMethod={sortingMethod}
          onSortingMethodChange={setSortingMethod}
          sortingOptions={getSortingOptions()}
          supportsDragDrop={supportsDragDrop}
          onResetData={handleResetData}
          selectedCount={championData.selected.length}
          totalCount={allChampions.length}
        />
        
        <ChampionGrid
          sortedChampions={sortedChampions}
          sortingMethod={sortingMethod}
          championData={championData}
          getChampionStatus={getChampionStatus}
          onToggleSelection={toggleChampionSelection}
          onUpdateFlag={updateFlag}
          onMoveChampion={moveChampionToSection}
          supportsDragDrop={supportsDragDrop}
        />
      </main>
    </div>
  );
}

export default LeagueChallengeTracker;