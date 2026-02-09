# Firebase Authentication Setup Guide for NutriCare
## Complete Implementation Steps

---

## 📋 OVERVIEW

This guide will help you replace the current localStorage-based authentication with Firebase Authentication, maintaining your role-based system (Doctor/Patient) while adding production-ready security.

**Current State:** localStorage mock authentication
**Target State:** Firebase Authentication with custom claims for roles

---

## STEP 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `nutricare-production`
4. Disable Google Analytics (optional for MVP)
5. Click "Create project"

### 1.2 Register Web App

1. In Firebase Console, click "Web" icon (</>) to add web app
2. Enter app nickname: `NutriCare Web`
3. ✅ Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **SAVE THE CONFIG** - You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "nutricare-production.firebaseapp.com",
  projectId: "nutricare-production",
  storageBucket: "nutricare-production.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

### 1.3 Enable Authentication Methods

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable:
   - ✅ **Email/Password** (primary method)
   - ✅ **Google** (optional - for social login)
3. Click "Save"

---

## STEP 2: Install Firebase SDK

### 2.1 Install Dependencies

Open PowerShell in your project directory and run:

```powershell
npm install firebase
```

### 2.2 Verify Installation

Check that `firebase` appears in your `package.json`:

```json
"dependencies": {
  "firebase": "^10.x.x",
  // ... other dependencies
}
```

---

## STEP 3: Firebase Configuration

### 3.1 Create Environment Variables

Create `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=nutricare-production.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nutricare-production
VITE_FIREBASE_STORAGE_BUCKET=nutricare-production.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
```

**Note:** Replace with YOUR actual Firebase config values!

### 3.2 Add .env to .gitignore

Ensure `.env` is in `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
```

### 3.3 Create Firebase Config File

Create `src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

---

## STEP 4: Create Authentication Context

### 4.1 Create Auth Context

Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'PATIENT' | 'DOCTOR';
  createdAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, name: string, role: 'PATIENT' | 'DOCTOR') => Promise<void>;
  login: (email: string, password: string) => Promise<UserData>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Signup function
  const signup = async (email: string, password: string, name: string, role: 'PATIENT' | 'DOCTOR') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Store user data in Firestore
    const userDocData: UserData = {
      uid: user.uid,
      email: user.email!,
      name,
      role,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userDocData);
    setUserData(userDocData);
  };

  // Login function
  const login = async (email: string, password: string): Promise<UserData> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const data = userDoc.data() as UserData;
    setUserData(data);
    return data;
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

---

## STEP 5: Update App.tsx

### 5.1 Wrap App with AuthProvider

Update `src/App.tsx`:

```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import MealPlans from "./pages/MealPlans";
import Progress from "./pages/Progress";
import NutritionTips from "./pages/NutritionTips";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import MyInsights from "./pages/MyInsights";
import TrackWorkout from "./pages/TrackWorkout";
import WellnessCrew from "./pages/WellnessCrew";
// Auth pages
import ChooseRole from "./pages/auth/ChooseRole";
import PatientSignup from "./pages/auth/PatientSignup";
import DoctorSignup from "./pages/auth/DoctorSignup";
import PatientLogin from "./pages/auth/PatientLogin";
import DoctorLogin from "./pages/auth/DoctorLogin";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Authentication Routes */}
              <Route path="/" element={<ChooseRole />} />
              <Route path="/signup/patient" element={<PatientSignup />} />
              <Route path="/signup/doctor" element={<DoctorSignup />} />
              <Route path="/login/patient" element={<PatientLogin />} />
              <Route path="/login/doctor" element={<DoctorLogin />} />
              <Route path="/signin" element={<SignIn />} />
              
              {/* App Routes */}
              <Route path="/dashboard" element={<Index />} />
              <Route path="/meal-plans" element={<MealPlans />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/nutrition-tips" element={<NutritionTips />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/my-insights" element={<MyInsights />} />
              <Route path="/track-workout" element={<TrackWorkout />} />
              <Route path="/wellness-crew" element={<WellnessCrew />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
```

---

## STEP 6: Update Authentication Pages

### 6.1 Update PatientSignup.tsx

Replace the handleSubmit function in `src/pages/auth/PatientSignup.tsx`:

```typescript
import { useAuth } from '@/contexts/AuthContext';

const PatientSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      await signup(formData.email, formData.password, formData.name, 'PATIENT');
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### 6.2 Update PatientLogin.tsx

Replace the handleSubmit function in `src/pages/auth/PatientLogin.tsx`:

```typescript
import { useAuth } from '@/contexts/AuthContext';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const userData = await login(formData.email, formData.password);
      
      // Check if user is a patient
      if (userData.role !== 'PATIENT') {
        toast.error('This account is not registered as a patient');
        return;
      }
      
      toast.success(`Welcome back, ${userData.name}!`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### 6.3 Update DoctorSignup.tsx and DoctorLogin.tsx

Apply similar changes as above, but:
- Use `'DOCTOR'` role in signup
- Check `userData.role !== 'DOCTOR'` in login

---

## STEP 7: Protected Routes

### 7.1 Create ProtectedRoute Component

Create `src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('PATIENT' | 'DOCTOR')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
```

### 7.2 Use ProtectedRoute in App.tsx

```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Index />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/meal-plans" 
  element={
    <ProtectedRoute>
      <MealPlans />
    </ProtectedRoute>
  } 
/>
// Repeat for all protected routes
```

---

## STEP 8: Firestore Security Rules

### 8.1 Set Up Firestore Database

1. In Firebase Console → **Firestore Database**
2. Click "Create database"
3. Choose "Start in production mode"
4. Select location (closest to your users)

### 8.2 Configure Security Rules

Go to Firestore → **Rules** tab and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can create their own document during signup
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Users can update their own data
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Doctors can read patient data (for assigned patients)
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'DOCTOR';
    }
    
    // Workouts collection (patient data)
    match /workouts/{workoutId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## STEP 9: Update Navbar with Logout

### 9.1 Add Logout Button

Update your Navbar component:

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav>
      {/* ... existing nav items */}
      
      {currentUser && (
        <div className="flex items-center gap-4">
          <span>Welcome, {userData?.name} ({userData?.role})</span>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};
```

---

## STEP 10: Testing Checklist

### 10.1 Test Patient Flow

- [ ] Go to `/signup/patient`
- [ ] Enter name, email, password
- [ ] Click "Sign Up as Patient"
- [ ] Should redirect to `/dashboard`
- [ ] Check Firebase Console → Authentication → Users (user should appear)
- [ ] Check Firestore → users collection (user document should exist with role: PATIENT)
- [ ] Logout
- [ ] Login at `/login/patient` with same credentials
- [ ] Should redirect to `/dashboard`

### 10.2 Test Doctor Flow

- [ ] Go to `/signup/doctor`
- [ ] Enter name, email, password
- [ ] Click "Sign Up as Doctor"
- [ ] Should redirect to `/dashboard`
- [ ] Check Firestore (user document should have role: DOCTOR)
- [ ] Logout and login at `/login/doctor`

### 10.3 Test Role Protection

- [ ] Create patient account
- [ ] Try to login at `/login/doctor` with patient credentials
- [ ] Should show error: "This account is not registered as a doctor"

### 10.4 Test Protected Routes

- [ ] Logout
- [ ] Try to access `/dashboard` directly
- [ ] Should redirect to `/` (landing page)

---

## STEP 11: Common Issues & Solutions

### Issue 1: "Firebase not initialized"
**Solution:** Ensure `.env` file exists and all VITE_ variables are set correctly. Restart dev server after creating `.env`.

### Issue 2: "Permission denied" in Firestore
**Solution:** Check Firestore Security Rules. During development, you can temporarily use:
```javascript
allow read, write: if true; // WARNING: Only for testing!
```

### Issue 3: "Email already in use"
**Solution:** Go to Firebase Console → Authentication → Users → Delete test user, or use a different email.

### Issue 4: CORS errors
**Solution:** Firebase Authentication should work from localhost. If issues persist, add your domain to Firebase Console → Authentication → Settings → Authorized domains.

---

## STEP 12: Production Deployment

### 12.1 Environment Variables

For production (e.g., Vercel, Netlify):

1. Add environment variables in hosting platform:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - etc.

2. Build command: `npm run build`
3. Output directory: `dist`

### 12.2 Firebase Hosting (Optional)

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
npm run build
firebase deploy
```

---

## 📊 MIGRATION SUMMARY

| Feature | Before (localStorage) | After (Firebase) |
|---------|----------------------|------------------|
| Authentication | Mock tokens | Real Firebase Auth |
| User Data | localStorage | Firestore Database |
| Security | None | Email/Password + Rules |
| Role Management | Manual flag | Firestore custom field |
| Session | Manual check | Auto-managed by Firebase |
| Password Reset | Not available | Firebase built-in |
| Multi-device | No sync | Auto-synced |

---

## 🎯 NEXT STEPS

After Firebase Auth is working:

1. **Add Password Reset:** Use `sendPasswordResetEmail()`
2. **Add Email Verification:** Use `sendEmailVerification()`
3. **Add Social Login:** Enable Google/Facebook auth
4. **Store Workout Data:** Move workout tracking to Firestore
5. **Add Doctor-Patient Assignment:** Create `assignments` collection
6. **Real-time Updates:** Use Firestore listeners for live data

---

## 🔒 SECURITY BEST PRACTICES

1. ✅ **Never commit `.env` file** to Git
2. ✅ **Use strong password requirements** (min 8 chars, uppercase, numbers)
3. ✅ **Implement rate limiting** (Firebase has built-in protection)
4. ✅ **Enable 2FA for Firebase Console** (protect your project)
5. ✅ **Regularly review Firestore rules** (principle of least privilege)
6. ✅ **Monitor Firebase Console → Authentication → Users** for suspicious activity

---

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React + Firebase Tutorial](https://firebase.google.com/docs/auth/web/start)
- [Firebase Pricing](https://firebase.google.com/pricing) - Free tier: 50K reads/day, 20K writes/day

---

**Estimated Implementation Time:** 2-4 hours

**Testing Time:** 1-2 hours

**Total:** Half day to full day of work

Good luck with your Firebase integration! 🚀🔥
