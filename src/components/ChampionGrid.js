import React, { useState } from 'react';
import ChampionIcon from './ChampionIcon';

/**
 * Main grid component for displaying champions
 * Handles alphabetical dividers, drag & drop, and section-based rendering
 */
const ChampionGrid = ({
  sortedChampions,
  sortingMethod,
  championData,
  getChampionStatus,
  onToggleSelection,
  onUpdateFlag,
  onMoveChampion,
  supportsDragDrop
}) => {
  const [draggedChampion, setDraggedChampion] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);

  /**
   * Handle drag start
   */
  const handleDragStart = (championName) => {
    setDraggedChampion(championName);
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = () => {
    setDraggedChampion(null);
    setDragOverSection(null);
  };

  /**
   * Handle drag over section
   */
  const handleDragOver = (e, sectionName) => {
    if (!supportsDragDrop || !draggedChampion) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(sectionName);
  };

  /**
   * Handle drag leave section
   */
  const handleDragLeave = (e) => {
    // Only clear if we're leaving the section entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverSection(null);
    }
  };

  /**
   * Handle drop on section
   */
  const handleDrop = (e, sectionName) => {
    e.preventDefault();
    
    if (!supportsDragDrop || !draggedChampion) return;
    
    // Determine the flag type based on sorting method
    let flagType = '';
    switch (sortingMethod) {
      case 'tier':
        flagType = 'tier';
        break;
      case 'difficulty':
        flagType = 'difficulty';
        break;
      case 'attempts':
        flagType = 'attempts';
        break;
      default:
        return;
    }
    
    onMoveChampion(draggedChampion, sectionName, flagType);
    setDragOverSection(null);
    setDraggedChampion(null);
  };

  /**
   * Get section display name
   */
  const getSectionDisplayName = (sectionName) => {
    if (sortingMethod === 'attempts' && sectionName.includes('Attempt')) {
      return sectionName;
    }
    return sectionName;
  };

  /**
   * Get section classes
   */
  const getSectionClasses = (sectionName) => {
    const classes = ['champion-section'];
    
    if (dragOverSection === sectionName) {
      classes.push('drag-over');
    }
    
    if (sortingMethod === 'tier') {
      classes.push(`tier-section-${sectionName.toLowerCase()}`);
    }
    
    return classes.join(' ');
  };

  /**
   * Render a section of champions
   */
  const renderSection = (sectionName, champions) => {
    if (!champions || champions.length === 0) {
      return null;
    }

    return (
      <div
        key={sectionName}
        className={getSectionClasses(sectionName)}
        onDragOver={(e) => handleDragOver(e, sectionName)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, sectionName)}
      >
        <div className="section-header">
          <h3 className="section-title">{getSectionDisplayName(sectionName)}</h3>
          <span className="section-count">({champions.length})</span>
        </div>
        
        <div className="champions-grid">
          {champions.map(championName => {
            const status = getChampionStatus(championName);
            
            return (
              <ChampionIcon
                key={championName}
                championName={championName}
                isSelected={status.isSelected}
                flags={{
                  tier: status.tier,
                  difficulty: status.difficulty,
                  attempts: status.attempts
                }}
                onToggleSelection={onToggleSelection}
                onUpdateFlag={onUpdateFlag}
                isDraggable={supportsDragDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            );
          })}
        </div>
        
        {supportsDragDrop && (
          <div className="drop-zone">
            Drop champions here to move them to {getSectionDisplayName(sectionName)}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render sections based on sorting method
   */
  const renderSections = () => {
    const sections = Object.keys(sortedChampions);
    
    if (sortingMethod === 'alphabetical') {
      // Sort alphabetically for letter sections
      return sections.sort().map(letter => 
        renderSection(letter, sortedChampions[letter])
      );
    }
    
    if (sortingMethod === 'tier') {
      // Specific order for tiers
      const tierOrder = ['S', 'A', 'B', 'C', 'D', 'F', 'None'];
      return tierOrder
        .filter(tier => sections.includes(tier))
        .map(tier => renderSection(tier, sortedChampions[tier]));
    }
    
    if (sortingMethod === 'difficulty') {
      // Specific order for difficulties
      const difficultyOrder = ['Baby Mode', 'Easy', 'Medium', 'Challenging', 'Very Complicated', 'None'];
      return difficultyOrder
        .filter(difficulty => sections.includes(difficulty))
        .map(difficulty => renderSection(difficulty, sortedChampions[difficulty]));
    }
    
    if (sortingMethod === 'attempts') {
      // Sort by attempt count
      return sections
        .sort((a, b) => {
          if (a === 'No Attempts') return -1;
          if (b === 'No Attempts') return 1;
          
          const aNum = parseInt(a.split(' ')[0]) || 0;
          const bNum = parseInt(b.split(' ')[0]) || 0;
          return aNum - bNum;
        })
        .map(attempts => renderSection(attempts, sortedChampions[attempts]));
    }
    
    return sections.map(section => 
      renderSection(section, sortedChampions[section])
    );
  };

  return (
    <div className="champion-grid-container">
      {supportsDragDrop && (
        <div className="drag-drop-instructions">
          <p>💡 Drag champions between sections to update their {sortingMethod}</p>
        </div>
      )}
      
      <div className="champion-grid">
        {renderSections()}
      </div>
      
      {Object.keys(sortedChampions).length === 0 && (
        <div className="no-champions">
          <p>No champions found</p>
        </div>
      )}
    </div>
  );
};

export default ChampionGrid;