# NutriCare Authentication System

## Overview
Role-based authentication system with separate flows for **Doctors** and **Patients**.

## Features

### 🎯 Role Assignment
- Automatic role assignment during signup
- Two distinct user types: **DOCTOR** and **PATIENT**
- No manual role selection needed

### 📱 Authentication Pages

#### 1. Landing Page (`/`)
- **ChooseRole Component**
- Two-card layout for easy role selection
- Quick links to signup/login for both roles
- Features list for each role

#### 2. Patient Flow
- **Signup**: `/signup/patient` → Auto-assigns `PATIENT` role
- **Login**: `/login/patient` → Validates patient credentials
- Redirects to `/dashboard` after successful login

#### 3. Doctor Flow
- **Signup**: `/signup/doctor` → Auto-assigns `DOCTOR` role
- **Login**: `/login/doctor` → Validates doctor credentials
- Redirects to `/dashboard` after successful login

## Implementation Details

### Current Storage (Phase 1)
```typescript
// User data stored in localStorage
{
  name: string,
  email: string,
  role: 'PATIENT' | 'DOCTOR',
  createdAt: string
}

// Auth token
localStorage.setItem('nutricare_auth_token', 'mock_token_...');
localStorage.setItem('nutricare_is_authenticated', 'true');
```

### Design System

#### Patient Theme
- **Primary Color**: `#FF6B00` (Orange)
- **Icon**: UserPlus
- **Border**: `border-fitness-primary/20`
- **Button**: `bg-fitness-primary`

#### Doctor Theme
- **Accent Color**: `#3ABFF8` (Blue)
- **Icon**: Stethoscope
- **Border**: `border-fitness-accent/20`
- **Button**: `bg-fitness-accent`

### Form Validation
✅ All fields required
✅ Password minimum 6 characters
✅ Password confirmation match
✅ Email format validation
✅ Role-specific account checking

## File Structure
```
src/pages/auth/
├── ChooseRole.tsx          # Landing page with role selection
├── PatientSignup.tsx       # Patient registration
├── DoctorSignup.tsx        # Doctor registration
├── PatientLogin.tsx        # Patient authentication
└── DoctorLogin.tsx         # Doctor authentication
```

## Routes Configuration
```typescript
// App.tsx routes
<Route path="/" element={<ChooseRole />} />
<Route path="/signup/patient" element={<PatientSignup />} />
<Route path="/signup/doctor" element={<DoctorSignup />} />
<Route path="/login/patient" element={<PatientLogin />} />
<Route path="/login/doctor" element={<DoctorLogin />} />
```

## Future Enhancements (Phase 2+)

### Backend Integration
- [ ] FastAPI authentication endpoints
- [ ] JWT token generation and validation
- [ ] User database (SQLite/PostgreSQL)
- [ ] Password hashing with bcrypt
- [ ] Refresh token mechanism

### Role-Based Access Control
- [ ] Protected routes based on user role
- [ ] Separate dashboards for doctors and patients
- [ ] Doctor-specific features (patient management)
- [ ] Patient-specific features (view own data only)

### Doctor-Patient Relationship
- [ ] Doctor can assign patients
- [ ] Patients can view their assigned doctor
- [ ] Doctor can create custom diet plans
- [ ] Patient can view doctor's recommendations

### Additional Features
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Profile management
- [ ] Multi-factor authentication
- [ ] Session timeout
- [ ] Remember me functionality

## Current Limitations
⚠️ **Phase 1 - UI Only**
- No backend validation
- No password encryption
- No email verification
- All users see the same dashboard
- No role-based feature restrictions
- Simple localStorage persistence

## Testing the Authentication

### As a Patient:
1. Visit `http://localhost:8080`
2. Click "Sign Up as Patient"
3. Fill form → Auto-assigned `PATIENT` role
4. Login at `/login/patient`
5. Redirected to `/dashboard`

### As a Doctor:
1. Visit `http://localhost:8080`
2. Click "Sign Up as Doctor"
3. Fill form → Auto-assigned `DOCTOR` role
4. Login at `/login/doctor`
5. Redirected to `/dashboard`

## Design Highlights

### Visual Features
- 🎨 Dark theme with fitness colors
- 🌊 Animated gradient backgrounds
- 📱 Responsive design (mobile-friendly)
- ✨ Hover effects and transitions
- 🎯 Icon-based visual hierarchy
- 🔒 Secure password input fields

### UX Features
- Clear role separation (orange vs blue)
- Inline form validation
- Loading states during submission
- Toast notifications for feedback
- Quick navigation between auth pages
- Cross-linking (patient ↔ doctor)

## Next Steps
1. ✅ **Phase 1: UI Complete** (Current)
2. 🔄 **Phase 2: Backend Setup** (FastAPI + Database)
3. 🔄 **Phase 3: JWT Authentication** (Token-based auth)
4. 🔄 **Phase 4: Role-Based Access** (Different dashboards)
5. 🔄 **Phase 5: Doctor-Patient System** (Assignment & Plans)

---

**Note**: This is a foundation for a complete authentication system. The backend integration and advanced features will be implemented in subsequent phases.
