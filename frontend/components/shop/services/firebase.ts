import { auth, db } from "../../../services/firebase";
import { 
  signOut,
  RecaptchaVerifier,
  PhoneAuthProvider,
  multiFactor,
  PhoneMultiFactorGenerator
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export { 
  RecaptchaVerifier, 
  PhoneAuthProvider, 
  multiFactor, 
  PhoneMultiFactorGenerator 
};

export { auth };

export const logout = () => signOut(auth);

export const getUserData = async (uid: string) => {
  if (!db) return null;
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};
