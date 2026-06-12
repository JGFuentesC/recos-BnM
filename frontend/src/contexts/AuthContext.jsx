import {
  useCallback,
  createContext,
  useContext,
  useEffect,
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
import { usePushNotifications } from '../hooks/usePushNotifications'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { requestPermission } = usePushNotifications(currentUser)

  const loadUserProfile = useCallback(async (uid) => {
    const profileRef = doc(db, 'users', uid)
    const profileSnap = await getDoc(profileRef)
    const profileData = profileSnap.exists() ? profileSnap.data() : null
    setUserProfile(profileData)
    return profileData
  }, [])

  const ensureUserDocument = useCallback(async (firebaseUser, providerName) => {
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
  }, [loadUserProfile])

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
  }, [ensureUserDocument])

  const loginWithEmail = useCallback(async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await ensureUserDocument(result.user, 'email')
    await requestPermission(result.user)
    return result.user
  }, [ensureUserDocument, requestPermission])

  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider)
    await ensureUserDocument(result.user, 'google')
    await requestPermission(result.user)
    return result.user
  }, [ensureUserDocument, requestPermission])

  const register = useCallback(async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    if (displayName) {
      await updateProfile(result.user, { displayName })
    }

    await ensureUserDocument(result.user, 'email')
    await requestPermission(result.user)
    return result.user
  }, [ensureUserDocument, requestPermission])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const refreshUserProfile = useCallback((uid) => {
    const targetUid = uid ?? currentUser?.uid
    return targetUid ? loadUserProfile(targetUid) : Promise.resolve(null)
  }, [currentUser, loadUserProfile])

  const value = {
    currentUser,
    userProfile,
    loading,
    loginWithEmail,
    loginWithGoogle,
    register,
    logout,
    refreshUserProfile,
    setUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
