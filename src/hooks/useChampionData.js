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
import taylorData from '../assets/Taylor.json';
import sethData from '../assets/Seth.json';

// Available datasets
const DATASETS = {
  'taylor': { data: taylorData, label: 'Taylor' },
  'seth': { data: sethData, label: 'Seth' }
};

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
  
  // State for current dataset
  const [currentDataset, setCurrentDataset] = useState('taylor');
  
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
      
      // Load and validate champion data from current dataset
      const currentDatasetData = DATASETS[currentDataset]?.data || taylorData;
      let validatedData = validateChampionData(currentDatasetData);
      
      // Try to load saved data for this dataset (overrides default data)
      const dataKey = `championData_${currentDataset}`;
      const savedData = localStorage.getItem(dataKey);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          validatedData = validateChampionData(parsed);
          console.log(`Loaded saved data for ${currentDataset}`);
        } catch (err) {
          console.warn('Error loading saved data, using default:', err);
        }
      }
      
      setChampionData(validatedData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading champion data:', err);
      setError('Failed to load champion data');
      setIsLoading(false);
    }
  }, [currentDataset]);

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
   * For GitHub Pages, we save to localStorage and provide export functionality
   * @param {Object} data - Champion data to save
   */
  const saveChampionData = useCallback((data) => {
    try {
      const dataKey = `championData_${currentDataset}`;
      localStorage.setItem(dataKey, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving champion data:', err);
    }
  }, [currentDataset]);

  /**
   * Load champion data from localStorage if available
   */
  const loadSavedData = useCallback(() => {
    try {
      const dataKey = `championData_${currentDataset}`;
      const savedData = localStorage.getItem(dataKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const validated = validateChampionData(parsed);
        setChampionData(validated);
      }
    } catch (err) {
      console.error('Error loading saved data:', err);
    }
  }, [currentDataset]);

  /**
   * Export current champion data as JSON file
   */
  const exportChampionData = useCallback(() => {
    try {
      const dataToExport = JSON.stringify(championData, null, 2);
      const blob = new Blob([dataToExport], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentDataset}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting champion data:', err);
    }
  }, [championData, currentDataset]);

  /**
   * Import champion data from JSON file
   */
  const importChampionData = useCallback((file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            const validated = validateChampionData(importedData);
            setChampionData(validated);
            saveChampionData(validated);
            resolve(validated);
          } catch (parseErr) {
            reject(new Error('Invalid JSON file format'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      } catch (err) {
        reject(err);
      }
    });
  }, [saveChampionData]);

  /**
   * Reset all champion data to defaults
   */
  const resetChampionData = useCallback(() => {
    const defaultData = {
      selected: [],
      flags: {}
    };
    setChampionData(defaultData);
    const dataKey = `championData_${currentDataset}`;
    localStorage.removeItem(dataKey);
  }, [currentDataset]);

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
   * Get dataset options
   */
  const getDatasetOptions = () => Object.keys(DATASETS).map(key => ({
    value: key,
    label: DATASETS[key].label
  }));

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
    currentDataset,
    
    // State
    isLoading,
    error,
    supportsDragDrop,
    
    // Actions
    toggleChampionSelection,
    updateFlag,
    moveChampionToSection,
    setSortingMethod,
    setCurrentDataset,
    loadSavedData,
    resetChampionData,
    getChampionStatus,
    getSortingOptions,
    getDatasetOptions,
    exportChampionData,
    importChampionData
  };
};