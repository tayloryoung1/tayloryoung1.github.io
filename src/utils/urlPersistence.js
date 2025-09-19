// URL-based persistence utilities
// Allows sharing and persisting champion data via URL parameters

/**
 * Encode champion data into URL parameters
 * @param {Object} data - Champion data to encode
 * @returns {string} Encoded URL parameters
 */
export const encodeDataToURL = (data) => {
  try {
    const compressed = JSON.stringify(data);
    const encoded = btoa(compressed);
    return `?data=${encodeURIComponent(encoded)}`;
  } catch (error) {
    console.error('Error encoding data to URL:', error);
    return '';
  }
};

/**
 * Decode champion data from URL parameters
 * @returns {Object|null} Decoded champion data or null if none found
 */
export const decodeDataFromURL = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    if (!encodedData) return null;
    
    const decoded = atob(decodeURIComponent(encodedData));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding data from URL:', error);
    return null;
  }
};

/**
 * Update URL with current champion data (without page reload)
 * @param {Object} data - Champion data to encode in URL
 */
export const updateURLWithData = (data) => {
  try {
    const urlParams = encodeDataToURL(data);
    const newURL = `${window.location.pathname}${urlParams}`;
    window.history.replaceState({}, '', newURL);
  } catch (error) {
    console.error('Error updating URL with data:', error);
  }
};

/**
 * Generate shareable link with current data
 * @param {Object} data - Champion data to share
 * @returns {string} Full shareable URL
 */
export const generateShareableLink = (data) => {
  try {
    const urlParams = encodeDataToURL(data);
    return `${window.location.origin}${window.location.pathname}${urlParams}`;
  } catch (error) {
    console.error('Error generating shareable link:', error);
    return window.location.href;
  }
};