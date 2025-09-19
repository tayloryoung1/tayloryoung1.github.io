// Champion utility functions for League Challenge Tracker

/**
 * Get all champion names from the assets folder
 * @retu  // Sort the groups by attempt count (descending order)
  const sortedGrouped = {};
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    if (a === 'No Attempts') return 1; // Put 'No Attempts' at the end
    if (b === 'No Attempts') return -1;
    
    const aNum = parseInt(a.split(' ')[0]);
    const bNum = parseInt(b.split(' ')[0]);
    return bNum - aNum; // Descending order (highest first)
  });} Array of champion names extracted from filenames
 */
export const getAllChampionNames = () => {
  // Since we can't dynamically import from file system in React,
  // we'll need to maintain a list or use require.context
  const championContext = require.context('../assets/champion_icons', false, /\.png$/);
  return championContext.keys().map(key => {
    // Remove './' and '.png' from the filename
    return key.replace('./', '').replace('.png', '');
  }).sort();
};

/**
 * Sort champions alphabetically with letter groupings
 * @param {Array} champions - Array of champion names
 * @returns {Object} Object with letters as keys and champion arrays as values
 */
export const sortChampionsAlphabetically = (champions) => {
  const grouped = {};
  
  champions.forEach(champion => {
    const firstLetter = champion.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(champion);
  });
  
  // Sort each group and return sorted letters
  Object.keys(grouped).forEach(letter => {
    grouped[letter].sort();
  });
  
  return grouped;
};

/**
 * Sort champions by tier (S, A, B, C, D, F, None)
 * @param {Array} champions - Array of champion names
 * @param {Object} flags - Champion flags object
 * @returns {Object} Object with tiers as keys and champion arrays as values
 */
export const sortChampionsByTier = (champions, flags) => {
  const tierOrder = ['S', 'A', 'B', 'C', 'D', 'F', 'None'];
  const grouped = {};
  
  // Initialize all tier groups (including empty ones)
  tierOrder.forEach(tier => {
    grouped[tier] = [];
  });
  
  champions.forEach(champion => {
    const tier = flags[champion]?.tier || 'None';
    if (grouped[tier]) {
      grouped[tier].push(champion);
    } else {
      // If tier doesn't exist in our order, add to None
      grouped['None'].push(champion);
    }
  });
  
  // Sort champions within each tier alphabetically
  Object.keys(grouped).forEach(tier => {
    grouped[tier].sort();
  });
  
  return grouped;
};

/**
 * Sort champions by difficulty
 * @param {Array} champions - Array of champion names
 * @param {Object} flags - Champion flags object
 * @returns {Object} Object with difficulties as keys and champion arrays as values
 */
export const sortChampionsByDifficulty = (champions, flags) => {
  const difficultyOrder = ['Baby Mode', 'Easy', 'Medium', 'Challenging', 'Very Complicated', 'None'];
  const grouped = {};
  
  // Initialize all difficulty groups
  difficultyOrder.forEach(difficulty => {
    grouped[difficulty] = [];
  });
  
  champions.forEach(champion => {
    const difficulty = flags[champion]?.difficulty || 'None';
    grouped[difficulty].push(champion);
  });
  
  // Sort champions within each difficulty alphabetically
  Object.keys(grouped).forEach(difficulty => {
    grouped[difficulty].sort();
  });
  
  return grouped;
};

/**
 * Sort champions by number of attempts
 * @param {Array} champions - Array of champion names
 * @param {Object} flags - Champion flags object
 * @returns {Object} Object with attempt counts as keys and champion arrays as values
 */
export const sortChampionsByAttempts = (champions, flags) => {
  const grouped = {};
  
  champions.forEach(champion => {
    const attempts = flags[champion]?.attempts || 0;
    const key = attempts === 0 ? 'No Attempts' : `${attempts} Attempt${attempts === 1 ? '' : 's'}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(champion);
  });
  
  // Sort champions within each group alphabetically
  Object.keys(grouped).forEach(key => {
    grouped[key].sort();
  });
  
  // Sort the groups by attempt count
  const sortedGrouped = {};
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    if (a === 'No Attempts') return -1;
    if (b === 'No Attempts') return 1;
    
    const aNum = parseInt(a.split(' ')[0]);
    const bNum = parseInt(b.split(' ')[0]);
    return aNum - bNum;
  });
  
  sortedKeys.forEach(key => {
    sortedGrouped[key] = grouped[key];
  });
  
  return sortedGrouped;
};

/**
 * Get the path to a champion icon
 * @param {string} championName - Name of the champion
 * @returns {string} Path to the champion icon
 */
export const getChampionIconPath = (championName) => {
  try {
    return require(`../assets/champion_icons/${championName}.png`);
  } catch (error) {
    console.warn(`Icon not found for champion: ${championName}`);
    return null;
  }
};

/**
 * Update champion flags in the data structure
 * @param {Object} currentFlags - Current flags object
 * @param {string} championName - Name of the champion
 * @param {string} flagType - Type of flag (tier, difficulty, attempts)
 * @param {any} value - New value for the flag
 * @returns {Object} Updated flags object
 */
export const updateChampionFlag = (currentFlags, championName, flagType, value) => {
  const newFlags = { ...currentFlags };
  
  if (!newFlags[championName]) {
    newFlags[championName] = {};
  }
  
  newFlags[championName] = {
    ...newFlags[championName],
    [flagType]: value
  };
  
  return newFlags;
};

/**
 * Get default flag values for a champion
 * @returns {Object} Default flag object
 */
export const getDefaultFlags = () => ({
  tier: '',
  difficulty: '',
  attempts: 0
});

/**
 * Validate and clean champion data
 * @param {Object} data - Champion data object
 * @returns {Object} Cleaned champion data
 */
export const validateChampionData = (data) => {
  const cleaned = {
    selected: Array.isArray(data.selected) ? data.selected : [],
    flags: typeof data.flags === 'object' ? data.flags : {}
  };
  
  // Ensure all selected champions have flag entries
  cleaned.selected.forEach(champion => {
    if (!cleaned.flags[champion]) {
      cleaned.flags[champion] = getDefaultFlags();
    }
  });
  
  return cleaned;
};