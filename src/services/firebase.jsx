import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, deleteDoc, collection } from "firebase/firestore";

// Firebase configuration, using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app, authentication, and Firestore
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Sign in with Google using a popup
export const signInWithGooglePopup = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // Return the signed-in user object
  } catch (error) {
    console.error('Error during sign-in: ', error);
    throw error; // Throw error to be handled by the caller
  }
};

// Save meeting data to Firestore
export const saveMeetingData = async (userId, date, data) => {
  try {
    const meetingRef = doc(db, `users/${userId}/meetings`, date); // Reference to the specific meeting document
    await setDoc(meetingRef, data); // Set the document data
    console.log('Meeting data saved successfully.');
  } catch (error) {
    console.error('Error saving meeting data:', error);
  }
};

// Load all meeting data for a user from Firestore
export const loadMeetingData = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/meetings`)); // Get all documents in the user's meetings collection
    const meetings = {};
    querySnapshot.forEach((doc) => {
      meetings[doc.id] = doc.data(); // Map the meeting data by date
    });
    return meetings;
  } catch (error) {
    console.error('Error loading meeting data:', error);
    return {};
  }
};

// Delete specific meeting data from Firestore
export const deleteMeetingData = async (userId, date) => {
  try {
    const meetingRef = doc(db, `users/${userId}/meetings`, date); // Reference to the specific meeting document
    await deleteDoc(meetingRef); // Delete the document
    console.log(`Meeting data for ${date} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting meeting data:', error);
  }
};

// Save goals data to Firestore
export const saveGoalsData = async (userId, goals) => {
  try {
    const goalsRef = doc(db, `users/${userId}/goals/defaultGoals`); // Reference to the default goals document
    await setDoc(goalsRef, goals); // Set the document data
    console.log('Goals data saved successfully.');
  } catch (error) {
    console.error('Error saving goals data:', error);
  }
};

// Load goals data from Firestore
export const loadGoalsData = async (userId) => {
  try {
    const goalsRef = doc(db, `users/${userId}/goals/defaultGoals`); // Reference to the default goals document
    const goalsDoc = await getDoc(goalsRef);
    if (goalsDoc.exists()) {
      return goalsDoc.data(); // Return the document data if it exists
    } else {
      return { longTermGoals: '', shortTermGoals: '' }; // Return default values if the document does not exist
    }
  } catch (error) {
    console.error('Error loading goals data:', error);
    return { longTermGoals: '', shortTermGoals: '' }; // Return default values in case of an error
  }
};
