import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { 
  getAuth, 
  signInAnonymously, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  deleteUser,
  RecaptchaVerifier,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  getMultiFactorResolver,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signInWithPhoneNumber,
  onAuthStateChanged,
  reload,
  getIdToken
} from 'firebase/auth';
type AuthUser = any;
type AuthConfirmationResult = any;
type AuthRecaptchaVerifier = any;

import { UserProfile } from '../types';

// Firebase Configuration - Using environment variables for security
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("⚠️ Firebase configuration is incomplete! Check your .env file.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize App Check
// Only running if we have a window object (client-side) to avoid errors during build/test if env differs
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  // Use the provided reCAPTCHA key
  // This enables App Check for Firestore and Auth requests
  try {
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider((import.meta as any).env.VITE_RECAPTCHA_SITE_KEY || '6LeEbzQsAAAAAG52lmIle1oVEx8XGTs9XJOVQ1fz'),
      isTokenAutoRefreshEnabled: true
    });
  } catch (e) {
    console.warn("App Check initialization failed:", e);
  }
} else if (typeof window !== 'undefined') {
  console.log("App Check skipped on localhost.");
}

// Check if Firebase is properly configured
const isPlaceholder = !firebaseConfig.apiKey || !firebaseConfig.projectId;

// Helper to wait for auth to settle on reload
const waitForAuthInit = () => {
  return new Promise<AuthUser | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user: any) => {
          unsubscribe();
          resolve(user as AuthUser);
      }, (error: any) => {
          console.error("Auth init error", error);
          resolve(null);
      });
  });
};

// --- AUTHENTICATION FUNCTIONS ---

export const registerWithEmail = async (email: string, pass: string, fullName: string) => {
  if (isPlaceholder) throw new Error("Please configure your own Firebase credentials in services/firebase.ts");
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(userCredential.user, { displayName: fullName });
  return userCredential.user;
};

export const loginWithEmail = async (email: string, pass: string) => {
  if (isPlaceholder) throw new Error("Please configure your own Firebase credentials in services/firebase.ts");
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

export const loginWithGoogle = async (useRedirect = false) => {
  if (isPlaceholder) throw new Error("Please configure credentials.");
  const provider = new GoogleAuthProvider();
  if (useRedirect) {
    return await signInWithRedirect(auth, provider);
  }
  const result = await signInWithPopup(auth, provider);
  return result.user;
};


export const loginWithGithub = async (useRedirect = false) => {
  if (isPlaceholder) throw new Error("Please configure credentials.");
  const provider = new GithubAuthProvider();
  if (useRedirect) {
    return await signInWithRedirect(auth, provider);
  }
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const loginWithMicrosoft = async (useRedirect = false) => {
  if (isPlaceholder) throw new Error("Please configure credentials.");
  const provider = new OAuthProvider('microsoft.com');
  if (useRedirect) {
    return await signInWithRedirect(auth, provider);
  }
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const handleRedirectLogin = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error("Redirect Login Error:", error);
    throw error;
  }
};

export const logoutFirebase = async () => {
  await signOut(auth);
};

export const loginWithPhone = async (phoneNumber: string, recaptchaVerifier: AuthRecaptchaVerifier) => {
  if (isPlaceholder) throw new Error("Please configure credentials.");
  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

export const sendPasswordReset = async (email: string) => {
  if (isPlaceholder) throw new Error("Please configure credentials.");
  
  try {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const baseAppUrl = isLocal ? window.location.origin : 'https://ai.x10minds.com';

    // Simplified settings for better compatibility
    const actionCodeSettings = {
      // The URL to redirect back to. This MUST be added to Authorized Domains in Firebase Console.
      url: `${baseAppUrl}/?p=reset-password`,
      // Setting this to false is usually more reliable for getting the email delivered initially.
      // If false, Firebase handles the reset UI and then redirects to the URL above.
      // If true, the link goes directly to the URL above with the oobCode.
      handleCodeInApp: true,
    };

    console.log("Attempting Firebase password reset for:", email, "with continue URL:", actionCodeSettings.url);
    
    await firebaseSendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log("Firebase reported successfully sending the password reset email.");
  } catch (error: any) {
    console.error("Firebase Password Reset Error:", error.code, error.message);
    throw error;
  }
};

// Verify the password reset code is valid
export const verifyResetCode = async (oobCode: string) => {
  return await verifyPasswordResetCode(auth, oobCode);
};

// Confirm the password reset with new password
export const confirmReset = async (oobCode: string, newPassword: string) => {
  await confirmPasswordReset(auth, oobCode, newPassword);
};

export const sendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  await sendEmailVerification(user);
};

export const reloadUser = async () => {
  if (auth.currentUser) await reload(auth.currentUser);
  return auth.currentUser;
};

export const reauthenticateUser = async (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No user logged in or email missing");
  
  const credential = EmailAuthProvider.credential(user.email, password);
  const result = await reauthenticateWithCredential(user, credential);
  
  // Force a token refresh to ensure MFA session is fresh
  await getIdToken(result.user, true);
  return result;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (e) {
    console.error("Error fetching user profile:", e);
    return null;
  }
};

// --- DATA FUNCTIONS ---

const ensureAuth = async () => {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.warn("Anonymous auth failed:", error);
    }
  }
};

export const reportBugToFirebase = async (description: string, email: string) => {
  if (isPlaceholder) {
    console.log("Bug report simulation:", { description, email });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "mock-bug-id-123";
  }

  try {
    if (!auth.currentUser) await ensureAuth();
    const docRef = await addDoc(collection(db, "bug_reports"), {
      description,
      email,
      userId: auth.currentUser?.uid,
      createdAt: Date.now(), // Rules check keys().hasAll(['description', 'userId', 'createdAt'])
      status: 'new',
      platform: navigator.userAgent
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding bug report: ", e);
    throw e;
  }
};

export const syncUserToFirebase = async (user: UserProfile) => {
  if (!user || !user.email) return;

  if (isPlaceholder) {
    console.log("Firebase sync skipped (Placeholder Config).");
    return;
  }

  try {
    // Use the Auth UID if logged in.
    let currentUser = auth.currentUser;
    
    // If called during page load, auth.currentUser might be null temporarily.
    // Wait for the auth state to initialize.
    if (!currentUser) {
       currentUser = await waitForAuthInit();
    }
    
    if (!currentUser) {
       console.warn("No authenticated user found for sync.");
       return;
    }
    
    // Store user data under their UID
    await setDoc(doc(db, "users", currentUser.uid), {
      fullName: user.fullName,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
      isNew: user.isNew || false,
      lastActive: Date.now(),
      tokensUsed: user.tokensUsed,
      tokenLimit: user.tokenLimit,
      dateOfBirth: user.dateOfBirth,
      age: user.age,
      hobby: user.hobby || null,
      archerLevel: user.archerLevel || null,
      bowType: user.bowType || null,
      phoneNumber: user.phoneNumber || null,
      avatarUrl: user.avatarUrl || null,
      socialLinks: user.socialLinks || null,
      stats: user.stats || {
        avgScore: 0,
        highestScore: 0,
        rankProgress: 0,
        podiumFinishes: 0
      }
    }, { merge: true });

    console.log("User synced to Firebase:", currentUser.uid);
  } catch (e: any) {
    console.error("Error syncing user to Firebase:", e);
  }
};

export const deleteUserAccount = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    // Delete Firestore data
    await deleteDoc(doc(db, "users", currentUser.uid));
    
    // Delete Auth account
    await deleteUser(currentUser);
    console.log("User account deleted permanently.");
  } catch (e) {
    console.error("Error deleting account:", e);
    throw e;
  }
};

// --- MFA FUNCTIONS ---

export const getRecaptchaVerifier = (containerId: string, size: 'invisible' | 'normal' = 'invisible') => {
  return new RecaptchaVerifier(auth, containerId, {
    size: size,
  });
};

export const startMfaEnrollment = async (phoneNumber: string, recaptchaVerifier: AuthRecaptchaVerifier) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  await reload(user);
  const session = await multiFactor(user).getSession();
  const phoneOptions = {
    phoneNumber,
    session
  };
  const phoneAuthProvider = new PhoneAuthProvider(auth);
  return await phoneAuthProvider.verifyPhoneNumber(phoneOptions, recaptchaVerifier);
};

export const finishMfaEnrollment = async (verificationId: string, verificationCode: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
  await multiFactor(user).enroll(multiFactorAssertion, "Phone Number");
};

export const unenrollMfa = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  const mfaUser = multiFactor(user);
  const factors = mfaUser.enrolledFactors;
  
  if (factors.length === 0) {
    console.warn("No enrolled factors found to unenroll.");
    return;
  }

  for (const factor of factors) {
    try {
      await mfaUser.unenroll(factor);
    } catch (err) {
      console.error("Failed to unenroll factor:", factor, err);
      // We continue to try others
    }
  }
};

// Re-export for components
export {
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
    RecaptchaVerifier,
    getMultiFactorResolver,
};
export type { PhoneMultiFactorInfo } from 'firebase/auth';