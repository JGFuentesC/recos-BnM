import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  async function ensureUserDocument(firebaseUser, providerName) {
    await setDoc(
      doc(db, 'users', firebaseUser.uid),
      {
        email: firebaseUser.email ?? '',
        displayName:
          firebaseUser.displayName ??
          firebaseUser.email?.split('@')[0] ??
          'Usuario',
        authProvider: providerName,
        createdAt: serverTimestamp(),
        prefs: {
          genres: [],
          authors: [],
          directors: [],
          cold_start_done: false,
        },
      },
      { merge: true },
    )
  }

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    await ensureUserDocument(result.user, 'google')
    return result.user
  }

  async function signUpWithEmail(name, email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    if (name) {
      await updateProfile(result.user, { displayName: name })
    }

    await ensureUserDocument(result.user, 'email')
    return result.user
  }

  async function logout() {
    await signOut(auth)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle,
      signUpWithEmail,
      logout,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
