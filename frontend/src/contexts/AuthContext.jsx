import { createContext, useContext, useState, useEffect, useCallback } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../firebase/config"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid)
        const snap = await getDoc(userRef)
        if (!snap.exists()) {
          const provider = user.providerData?.[0]?.providerId === "google.com" ? "Google" : "email"
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName || user.email?.split("@")[0] || "Usuario",
            photoUrl: user.photoURL || "",
            authProvider: provider,
            preferences: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
      }
      setCurrentUser(user)
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithEmail = useCallback((email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }, [])

  const register = useCallback(async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    const userRef = doc(db, "users", cred.user.uid)
    await setDoc(userRef, {
      email: cred.user.email,
      displayName: displayName || cred.user.email?.split("@")[0] || "Usuario",
      photoUrl: "",
      authProvider: "email",
      preferences: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return cred
  }, [])

  const logout = useCallback(() => {
    return signOut(auth)
  }, [])

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, loginWithEmail, loginWithGoogle, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
