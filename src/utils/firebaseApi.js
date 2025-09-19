// Firebase integration for champion data persistence
// This provides a free cloud database solution

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Firebase configuration (you would need to set up a Firebase project)
const firebaseConfig = {
  // You would add your Firebase config here
  // This is just an example structure
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Save champion data to Firebase
 * @param {string} userId - User identifier (could be username or generated ID)
 * @param {string} dataset - Dataset name (e.g., 'taylor', 'seth')
 * @param {Object} data - Champion data to save
 */
export const saveToFirebase = async (userId, dataset, data) => {
  try {
    const docRef = doc(db, 'championData', `${userId}_${dataset}`);
    await setDoc(docRef, {
      ...data,
      lastUpdated: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    throw error;
  }
};

/**
 * Load champion data from Firebase
 * @param {string} userId - User identifier
 * @param {string} dataset - Dataset name
 */
export const loadFromFirebase = async (userId, dataset) => {
  try {
    const docRef = doc(db, 'championData', `${userId}_${dataset}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove the lastUpdated field before returning
      const { lastUpdated, ...championData } = data;
      return championData;
    }
    return null;
  } catch (error) {
    console.error('Error loading from Firebase:', error);
    throw error;
  }
};