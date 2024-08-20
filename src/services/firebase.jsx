import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, deleteDoc, collection } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Sign-in with Google using a popup
export const signInWithGooglePopup = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error during sign-in: ', error);
    throw error;
  }
};

// Save meeting data
export const saveMeetingData = async (userId, date, data) => {
  try {
    const meetingRef = doc(db, `users/${userId}/meetings`, date);
    await setDoc(meetingRef, data);
    console.log('Meeting data saved successfully.');
  } catch (error) {
    console.error('Error saving meeting data:', error);
  }
};

// Load meeting data
export const loadMeetingData = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/meetings`));
    const meetings = {};
    querySnapshot.forEach((doc) => {
      meetings[doc.id] = doc.data();
    });
    return meetings;
  } catch (error) {
    console.error('Error loading meeting data:', error);
    return {};
  }
};

// Delete meeting data
export const deleteMeetingData = async (userId, date) => {
  try {
    const meetingRef = doc(db, `users/${userId}/meetings`, date);
    await deleteDoc(meetingRef);
    console.log(`Meeting data for ${date} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting meeting data:', error);
  }
};

// Save goals data
export const saveGoalsData = async (userId, goals) => {
  try {
    const goalsRef = doc(db, `users/${userId}/goals/defaultGoals`);
    await setDoc(goalsRef, goals);
    console.log('Goals data saved successfully.');
  } catch (error) {
    console.error('Error saving goals data:', error);
  }
};

// Load goals data
export const loadGoalsData = async (userId) => {
  try {
    const goalsRef = doc(db, `users/${userId}/goals/defaultGoals`);
    const goalsDoc = await getDoc(goalsRef);
    if (goalsDoc.exists()) {
      return goalsDoc.data();
    } else {
      return { longTermGoals: '', shortTermGoals: '' };
    }
  } catch (error) {
    console.error('Error loading goals data:', error);
    return { longTermGoals: '', shortTermGoals: '' };
  }
};
