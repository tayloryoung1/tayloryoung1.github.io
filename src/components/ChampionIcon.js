import React, { useState, useRef, useEffect } from 'react';
import { getChampionIconPath } from '../utils/championUtils';

/**
 * Individual champion icon component
 * Handles click highlighting, right-click context menu, and visual states
 */
const ChampionIcon = ({
  championName,
  isSelected,
  flags,
  onToggleSelection,
  onUpdateFlag,
  isDraggable = false,
  onDragStart,
  onDragEnd
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const iconRef = useRef(null);
  const contextMenuRef = useRef(null);

  const iconPath = getChampionIconPath(championName);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

  /**
   * Handle left click - toggle selection
   */
  const handleClick = (e) => {
    e.preventDefault();
    if (!isDragging) {
      onToggleSelection(championName);
    }
  };

  /**
   * Handle right click - show context menu
   */
  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  /**
   * Handle drag start
   */
  const handleDragStart = (e) => {
    if (!isDraggable) return;
    
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', championName);
    e.dataTransfer.effectAllowed = 'move';
    
    if (onDragStart) {
      onDragStart(championName);
    }
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = (e) => {
    setIsDragging(false);
    
    if (onDragEnd) {
      onDragEnd(championName);
    }
  };

  /**
   * Handle flag update from context menu
   */
  const handleFlagUpdate = (flagType, value) => {
    onUpdateFlag(championName, flagType, value);
    setShowContextMenu(false);
  };

  /**
   * Get display classes based on state
   */
  const getDisplayClasses = () => {
    const classes = ['champion-icon'];
    
    if (isSelected) classes.push('selected');
    if (isDragging) classes.push('dragging');
    if (isDraggable) classes.push('draggable');
    
    // Add tier class for visual indication
    if (flags.tier) {
      classes.push(`tier-${flags.tier.toLowerCase()}`);
    }
    
    return classes.join(' ');
  };

  /**
   * Context menu options
   */
  const tierOptions = ['S', 'A', 'B', 'C', 'D', 'F', ''];
  const difficultyOptions = ['Baby Mode', 'Easy', 'Medium', 'Challenging', 'Very Complicated', ''];
  const attemptOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (!iconPath) {
    return (
      <div className="champion-icon missing">
        <div className="champion-name">{championName}</div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={iconRef}
        className={getDisplayClasses()}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        draggable={isDraggable}
        title={`${championName}${flags.tier ? ` (${flags.tier})` : ''}${flags.difficulty ? ` - ${flags.difficulty}` : ''}${flags.attempts ? ` - ${flags.attempts} attempts` : ''}`}
      >
        <img
          src={iconPath}
          alt={championName}
          className="champion-image"
          draggable={false}
        />
        <div className="champion-name">{championName}</div>
        
        {/* Visual indicators */}
        <div className="champion-indicators">
          {flags.tier && (
            <span className={`tier-badge tier-${flags.tier.toLowerCase()}`}>
              {flags.tier}
            </span>
          )}
          {flags.attempts > 0 && (
            <span className="attempts-badge">
              {flags.attempts}
            </span>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            zIndex: 1000
          }}
        >
          <div className="context-menu-section">
            <div className="context-menu-title">Tier</div>
            <div className="context-menu-options">
              {tierOptions.map(tier => (
                <button
                  key={tier || 'none'}
                  className={`context-menu-option ${flags.tier === tier ? 'active' : ''}`}
                  onClick={() => handleFlagUpdate('tier', tier)}
                >
                  {tier || 'None'}
                </button>
              ))}
            </div>
          </div>

          <div className="context-menu-section">
            <div className="context-menu-title">Difficulty</div>
            <div className="context-menu-options">
              {difficultyOptions.map(difficulty => (
                <button
                  key={difficulty || 'none'}
                  className={`context-menu-option ${flags.difficulty === difficulty ? 'active' : ''}`}
                  onClick={() => handleFlagUpdate('difficulty', difficulty)}
                >
                  {difficulty || 'None'}
                </button>
              ))}
            </div>
          </div>

          <div className="context-menu-section">
            <div className="context-menu-title">Attempts</div>
            <div className="context-menu-options attempts-grid">
              {attemptOptions.map(attempts => (
                <button
                  key={attempts}
                  className={`context-menu-option ${flags.attempts === attempts ? 'active' : ''}`}
                  onClick={() => handleFlagUpdate('attempts', attempts)}
                >
                  {attempts}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChampionIcon;