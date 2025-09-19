import { useState, useEffect, useCallback } from 'react';
import {
  getAllChampionNames,
  sortChampionsAlphabetically,
  sortChampionsByTier,
  sortChampionsByDifficulty,
  sortChampionsByAttempts,
  updateChampionFlag,
  validateChampionData
} from '../utils/championUtils';
import selectedChampionsData from '../assets/selected_champions.json';

/**
 * Custom hook for managing champion data and state
 * Handles loading, sorting, and updating champion information
 */
export const useChampionData = () => {
  // State for all available champions
  const [allChampions, setAllChampions] = useState([]);
  
  // State for champion data (selected and flags)
  const [championData, setChampionData] = useState({
    selected: [],
    flags: {}
  });
  
  // State for current sorting method
  const [sortingMethod, setSortingMethod] = useState('alphabetical');
  
  // State for sorted and grouped champions
  const [sortedChampions, setSortedChampions] = useState({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Error state
  const [error, setError] = useState(null);

  /**
   * Load initial champion data
   */
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Load all champion names
      const champions = getAllChampionNames();
      setAllChampions(champions);
      
      // Load and validate champion data
      const validatedData = validateChampionData(selectedChampionsData);
      setChampionData(validatedData);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading champion data:', err);
      setError('Failed to load champion data');
      setIsLoading(false);
    }
  }, []);

  /**
   * Update sorted champions when data or sorting method changes
   */
  useEffect(() => {
    if (allChampions.length === 0) return;
    
    let sorted = {};
    
    switch (sortingMethod) {
      case 'alphabetical':
        sorted = sortChampionsAlphabetically(allChampions);
        break;
      case 'tier':
        sorted = sortChampionsByTier(allChampions, championData.flags);
        break;
      case 'difficulty':
        sorted = sortChampionsByDifficulty(allChampions, championData.flags);
        break;
      case 'attempts':
        sorted = sortChampionsByAttempts(allChampions, championData.flags);
        break;
      default:
        sorted = sortChampionsAlphabetically(allChampions);
    }
    
    setSortedChampions(sorted);
  }, [allChampions, championData.flags, sortingMethod]);

  /**
   * Toggle champion selection
   * @param {string} championName - Name of the champion to toggle
   */
  const toggleChampionSelection = useCallback((championName) => {
    setChampionData(prevData => {
      const isSelected = prevData.selected.includes(championName);
      
      let newSelected;
      if (isSelected) {
        // Remove from selected
        newSelected = prevData.selected.filter(name => name !== championName);
      } else {
        // Add to selected
        newSelected = [...prevData.selected, championName];
      }
      
      const newData = {
        ...prevData,
        selected: newSelected
      };
      
      // Save to localStorage (in a real app, this would be an API call)
      saveChampionData(newData);
      
      return newData;
    });
  }, []);

  /**
   * Update champion flag
   * @param {string} championName - Name of the champion
   * @param {string} flagType - Type of flag (tier, difficulty, attempts)
   * @param {any} value - New value for the flag
   */
  const updateFlag = useCallback((championName, flagType, value) => {
    setChampionData(prevData => {
      const newFlags = updateChampionFlag(prevData.flags, championName, flagType, value);
      
      const newData = {
        ...prevData,
        flags: newFlags
      };
      
      // Save to localStorage
      saveChampionData(newData);
      
      return newData;
    });
  }, []);

  /**
   * Move champion to different section (for drag & drop)
   * @param {string} championName - Name of the champion
   * @param {string} newSection - New section name
   * @param {string} flagType - Type of flag being updated
   */
  const moveChampionToSection = useCallback((championName, newSection, flagType) => {
    let value = newSection;
    
    // Convert section names back to flag values
    if (flagType === 'attempts') {
      if (newSection === 'No Attempts') {
        value = 0;
      } else {
        value = parseInt(newSection.split(' ')[0]) || 0;
      }
    } else if (flagType === 'tier' && newSection === 'None') {
      value = '';
    } else if (flagType === 'difficulty' && newSection === 'None') {
      value = '';
    }
    
    updateFlag(championName, flagType, value);
  }, [updateFlag]);

  /**
   * Save champion data (in a real app, this would make an API call)
   * For now, we'll just save to localStorage
   * @param {Object} data - Champion data to save
   */
  const saveChampionData = useCallback((data) => {
    try {
      localStorage.setItem('championData', JSON.stringify(data));
    } catch (err) {
      console.error('Error saving champion data:', err);
    }
  }, []);

  /**
   * Load champion data from localStorage if available
   */
  const loadSavedData = useCallback(() => {
    try {
      const savedData = localStorage.getItem('championData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const validated = validateChampionData(parsed);
        setChampionData(validated);
      }
    } catch (err) {
      console.error('Error loading saved data:', err);
    }
  }, []);

  /**
   * Reset all champion data to defaults
   */
  const resetChampionData = useCallback(() => {
    const defaultData = {
      selected: [],
      flags: {}
    };
    setChampionData(defaultData);
    localStorage.removeItem('championData');
  }, []);

  /**
   * Get champion status
   * @param {string} championName - Name of the champion
   * @returns {Object} Champion status information
   */
  const getChampionStatus = useCallback((championName) => {
    const flags = championData.flags[championName] || {};
    return {
      isSelected: championData.selected.includes(championName),
      tier: flags.tier || '',
      difficulty: flags.difficulty || '',
      attempts: flags.attempts || 0
    };
  }, [championData]);

  /**
   * Get sorting method options
   */
  const getSortingOptions = () => [
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'tier', label: 'Tier' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'attempts', label: 'Attempts' }
  ];

  /**
   * Check if current sorting method supports drag & drop
   */
  const supportsDragDrop = sortingMethod !== 'alphabetical';

  return {
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
    loadSavedData,
    resetChampionData,
    getChampionStatus,
    getSortingOptions
  };
};