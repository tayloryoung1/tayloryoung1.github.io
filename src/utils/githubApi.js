// GitHub API utilities for persisting champion data
// This allows automatic saving to GitHub repository

const GITHUB_CONFIG = {
  owner: 'tayloryoung1',
  repo: 'tayloryoung1.github.io',
  branch: 'main'
};

/**
 * Save champion data to GitHub repository
 * Requires GitHub Personal Access Token
 * @param {string} filename - The JSON filename (e.g., 'Taylor.json')
 * @param {Object} data - Champion data to save
 * @param {string} token - GitHub Personal Access Token
 */
export const saveToGitHub = async (filename, data, token) => {
  try {
    const path = `src/assets/${filename}`;
    const content = JSON.stringify(data, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    console.log(`🔄 GitHub API: Saving ${filename} to ${path}`);
    
    // Get current file SHA (required for updates)
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    let sha = null;
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
      console.log(`📄 Found existing file with SHA: ${sha.substring(0, 8)}...`);
    } else if (getFileResponse.status === 404) {
      console.log(`📄 File ${filename} does not exist yet, will create new file`);
    } else {
      throw new Error(`Failed to get file info: ${getFileResponse.status} ${getFileResponse.statusText}`);
    }
    
    // Update or create file
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update ${filename} champion data`,
          content: encodedContent,
          sha: sha,
          branch: GITHUB_CONFIG.branch
        })
      }
    );
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`GitHub API error: ${updateResponse.status} ${updateResponse.statusText} - ${errorText}`);
    }
    
    const result = await updateResponse.json();
    console.log(`✅ Successfully saved ${filename} to GitHub`);
    return result;
  } catch (error) {
    console.error('Error saving to GitHub:', error);
    throw error;
  }
};

/**
 * Check if GitHub token is valid
 * @param {string} token - GitHub Personal Access Token
 */
export const validateGitHubToken = async (token) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Get rate limit information
 * @param {string} token - GitHub Personal Access Token
 */
export const getGitHubRateLimit = async (token) => {
  try {
    const response = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    return null;
  }
};