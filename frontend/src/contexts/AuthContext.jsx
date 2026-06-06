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
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadUserProfile(uid) {
    const profileRef = doc(db, 'users', uid)
    const profileSnap = await getDoc(profileRef)
    const profileData = profileSnap.exists() ? profileSnap.data() : null
    setUserProfile(profileData)
    return profileData
  }

  async function ensureUserDocument(firebaseUser, providerName) {
    const profileRef = doc(db, 'users', firebaseUser.uid)
    const profileSnap = await getDoc(profileRef)

    if (!profileSnap.exists()) {
      const displayName =
        firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Usuario'

      await setDoc(profileRef, {
        email: firebaseUser.email ?? '',
        displayName,
        authProvider: providerName,
        createdAt: serverTimestamp(),
        prefs: {
          genres: [],
          authors: [],
          directors: [],
          cold_start_done: false,
        },
      })
    }

    return loadUserProfile(firebaseUser.uid)
  }

  function inferProvider(firebaseUser) {
    const providerId = firebaseUser?.providerData?.[0]?.providerId
    return providerId === 'google.com' ? 'google' : 'email'
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)

      if (!firebaseUser) {
        setCurrentUser(null)
        setUserProfile(null)
        setLoading(false)
        return
      }

      setCurrentUser(firebaseUser)

      try {
        await ensureUserDocument(firebaseUser, inferProvider(firebaseUser))
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [])

  async function loginWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await ensureUserDocument(result.user, 'email')
    return result.user
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    await ensureUserDocument(result.user, 'google')
    return result.user
  }

  async function register(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    if (displayName) {
      await updateProfile(result.user, { displayName })
    }

    await ensureUserDocument(result.user, 'email')
    return result.user
  }

  async function logout() {
    await signOut(auth)
  }

  function refreshUserProfile(uid) {
    const targetUid = uid ?? currentUser?.uid
    return targetUid ? loadUserProfile(targetUid) : Promise.resolve(null)
  }

  const value = useMemo(
    () => ({
      currentUser,
      userProfile,
      loading,
      loginWithEmail,
      loginWithGoogle,
      register,
      logout,
      refreshUserProfile,
      setUserProfile,
    }),
    [currentUser, userProfile, loading],
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
