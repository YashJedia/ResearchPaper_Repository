# Faculty Registration & Login System - Implementation Guide

## 📋 Overview

I've successfully created a **complete Faculty Registration & Login System** where professors can:
- ✅ Register independently with their information
- ✅ Login with email/password  
- ✅ View and edit their own profile
- ✅ Manage their published papers
- ✅ Change password securely

Admins can:
- ✅ Review pending faculty registrations
- ✅ Approve or reject registrations
- ✅ Manage all faculty and papers

---

## 🔧 Backend Changes

### 1. **Updated Faculty Model** (`/backend/models/Faculty.js`)
Added authentication fields to Faculty model:
```javascript
- password (hashed with bcryptjs)
- isAuthEnabled (boolean, default: false)
- registrationStatus (enum: pending, approved, rejected)
- registrationDate (timestamp)
- approvedBy (reference to admin user)
```

### 2. **New Faculty Auth Controller** (`/backend/controllers/facultyAuthController.js`)
Handles:
- `registerFaculty()` - Faculty self-registration (status: pending)
- `loginFaculty()` - Faculty login (only if approved)
- `getFacultyProfile()` - Get current faculty profile
- `updateFacultyProfile()` - Update own profile & password
- `getFacultyPapers()` - Get faculty's published papers

### 3. **New Admin Faculty Controller** (`/backend/controllers/adminFacultyController.js`)
Handles:
- `getPendingRegistrations()` - Get pending approvals
- `getAllFacultyRegistrations()` - Get all faculty registrations
- `approveFacultyRegistration()` - Approve registration
- `rejectFacultyRegistration()` - Reject with reason

### 4. **Faculty Auth Middleware** (`/backend/middleware/facultyAuth.js`)
- `verifyFacultyToken()` - JWT verification for faculty
- `isOwnProfile()` - Ensure faculty can only update their own profile

### 5. **New Routes** 

**Faculty Auth Routes** (`/backend/routes/facultyAuth.js`):
```
POST /api/faculty-auth/register          - Faculty registration
POST /api/faculty-auth/login             - Faculty login
GET  /api/faculty-auth/profile           - Get profile (protected)
PUT  /api/faculty-auth/profile           - Update profile (protected)
GET  /api/faculty-auth/my-papers         - Get own papers (protected)
```

**Admin Faculty Routes** (`/backend/routes/adminFaculty.js`):
```
GET  /api/admin/faculty/registrations/pending         - Pending approvals
GET  /api/admin/faculty/registrations                 - All registrations
PUT  /api/admin/faculty/registrations/:id/approve     - Approve faculty
PUT  /api/admin/faculty/registrations/:id/reject      - Reject faculty
```

### 6. **Updated Server** (`/backend/server.js`)
Added new routes:
```javascript
app.use('/api/faculty-auth', facultyAuthRoutes);
app.use('/api/admin/faculty', adminFacultyRoutes);
```

---

## 🎨 Frontend Changes

### 1. **Updated API Service** (`/frontend/src/services/api.js`)
Added new API endpoints:
```javascript
// Faculty Auth
export const facultyAuthAPI = {
  register: (data) => api.post('/faculty-auth/register', data),
  login: (email, password) => api.post('/faculty-auth/login', { email, password }),
  getProfile: () => api.get('/faculty-auth/profile'),
  updateProfile: (data) => api.put('/faculty-auth/profile', data),
  getMyPapers: () => api.get('/faculty-auth/my-papers'),
};

// Admin Faculty Management
export const adminFacultyAPI = {
  getPendingRegistrations: () => api.get('/admin/faculty/registrations/pending'),
  getAllRegistrations: () => api.get('/admin/faculty/registrations'),
  approveFaculty: (id) => api.put(`/admin/faculty/registrations/${id}/approve`),
  rejectFaculty: (id, reason) => api.put(`/admin/faculty/registrations/${id}/reject`, { reason }),
};
```

### 2. **New Pages**

#### **FacultyRegister.jsx**
Faculty registration page with fields:
- Full Name
- Email
- Password (with confirmation)
- Designation (dropdown)
- Research Area
- Bio (optional)
- Photo URL (optional)

Features:
- Form validation
- Password matching check
- Success/error messages
- Automatic redirect to login after registration
- Note about admin approval

#### **FacultyLogin.jsx**
Faculty login page with:
- Email input
- Password input
- Login button
- Link to registration
- Link to admin login
- Status messages for pending approval

#### **FacultyDashboard.jsx**
Faculty personal dashboard with 3 tabs:

**Profile Tab:**
- View complete profile
- Edit mode for: name, designation, research area, bio, photo
- Current registration status display

**Papers Tab:**
- View all published papers
- Paper details: title, author, year, journal, DOI, link
- Delete paper functionality
- Count of published papers

**Change Password Tab:**
- Current password verification
- New password entry (minimum 6 characters)
- Confirm new password
- Password change functionality

#### **AdminFacultyApproval.jsx** (Embedded in Dashboard)
Admin faculty management with 2 tabs:

**Pending Approvals:**
- List of registrations waiting for approval
- Faculty details: name, email, designation, research area, bio, photo
- Approve button
- Reject button with reason input
- Registration date

**All Faculty Registrations:**
- View all faculty (approved, rejected, pending)
- Status indicators
- Full details for each faculty member

### 3. **Updated App.jsx** 
Added new routes and authentication states:
```javascript
// Faculty routes
<Route path="/faculty-register" element={<FacultyRegister />} />
<Route path="/faculty-login" element={<FacultyLogin />} />
<Route path="/faculty-dashboard" element={<FacultyProtectedRoute element={<FacultyDashboard />} />} />

// Protected route for faculty
FacultyProtectedRoute checks for facultyUser in localStorage
```

### 4. **Updated Dashboard.jsx**
Added "Faculty Registrations" tab showing:
- Pending registrations count
- Faculty details in cards
- Approve/Reject buttons
- Rejection reason form
- Status notifications

---

## 🔐 Authentication Flow

### Faculty Registration Flow
```
1. Faculty fills registration form
2. Submit to POST /api/faculty-auth/register
3. Backend creates faculty with status: "pending"
4. Email stored for login verification
5. Password hashed with bcryptjs
6. Success message shown
7. Redirect to login with message about approval
```

### Faculty Login Flow
```
1. Faculty enters email & password
2. POST /api/faculty-auth/login
3. Backend checks:
   - Email exists
   - Registration status == "approved"
   - Password matches
4. If approved: Generate JWT token
5. Store token & faculty info in localStorage
6. Redirect to /faculty-dashboard
```

### Admin Approval Flow
```
1. Admin sees pending registrations in dashboard
2. Reviews faculty details
3. Clicks "Approve" → Faculty status changes to "approved"
4. Faculty can now login
5. OR clicks "Reject" → Faculty status changes to "rejected"
6. Faculty gets rejection message on login attempt
```

---

## 📍 New Routes Accessible

### For Faculty Users:
```
/faculty-register              - Registration page
/faculty-login                 - Login page
/faculty-dashboard             - Dashboard (protected)
  - Profile management
  - Paper management
  - Password change
```

### For Admin Users (Dashboard):
```
/dashboard                     - Admin dashboard
  - Papers tab (existing)
  - Faculty tab (existing)
  - Faculty Registrations tab (NEW)
```

---

## 🗄️ Database Structure Updates

### Faculty Model Changes:
```javascript
{
  name: String,
  designation: String,
  email: String (unique, lowercase),
  password: String (hashed), NEW
  researchArea: String,
  bio: String,
  photo: String,
  isAuthEnabled: Boolean (default: false), NEW
  registrationStatus: String (pending/approved/rejected), NEW
  registrationDate: Date, NEW
  approvedBy: ObjectId (ref: User), NEW
  timestamps: true
}
```

### Token Structure (Faculty JWT):
```javascript
{
  id: faculty._id,
  email: faculty.email,
  role: 'faculty',
  name: faculty.name,
  expiresIn: 7 days
}
```

---

## 🧪 Testing the System

### Test Faculty Registration:
1. Navigate to `http://localhost:3000/faculty-register`
2. Fill in form:
   - Name: "Dr. Sarah Adams"
   - Email: "sarah@university.edu"
   - Designation: "Professor"
   - Research Area: "Artificial Intelligence"
   - Password: "password123"
3. Submit
4. See success message

### Test Admin Approval:
1. Login as admin (username: admin, password: admin123)
2. Go to Dashboard → "Faculty Registrations" tab
3. See pending registrations
4. Click "Approve" or "Reject"
5. Faculty status updates

### Test Faculty Login:
1. Navigate to `http://localhost:3000/faculty-login`
2. Use registered email & password (if approved)
3. Access dashboard
4. View/edit profile
5. Manage papers
6. Change password

---

## 🔒 Security Features

✅ **Password Security:**
- Hashed with bcryptjs (salt rounds: 10)
- Never stored in plain text
- Password comparison on login

✅ **JWT Authentication:**
- Token-based (7-day expiration)
- Stored in localStorage
- Included in Authorization header

✅ **Authorization:**
- Faculty can only access own profile
- Faculty cannot approve/reject registrations
- Admin-only endpoints protected

✅ **Validation:**
- Email format validation
- Required field checking
- Password minimum length (6 characters)
- Unique email per faculty

✅ **Approval Workflow:**
- Registration pending by default
- Only approved faculty can login
- Rejection with reason feedback

---

## 📊 File Structure Summary

### Backend Files Created:
```
✓ /backend/controllers/facultyAuthController.js (NEW)
✓ /backend/controllers/adminFacultyController.js (NEW)
✓ /backend/middleware/facultyAuth.js (NEW)
✓ /backend/routes/facultyAuth.js (NEW)
✓ /backend/routes/adminFaculty.js (NEW)
✓ /backend/models/Faculty.js (UPDATED)
✓ /backend/server.js (UPDATED)
```

### Frontend Files Created:
```
✓ /frontend/src/pages/FacultyRegister.jsx (NEW)
✓ /frontend/src/pages/FacultyLogin.jsx (NEW)
✓ /frontend/src/pages/FacultyDashboard.jsx (NEW)
✓ /frontend/src/pages/AdminFacultyApproval.jsx (NEW - for reference)
✓ /frontend/src/App.jsx (UPDATED)
✓ /frontend/src/pages/Dashboard.jsx (UPDATED)
✓ /frontend/src/services/api.js (UPDATED)
```

---

## 🚀 Next Steps to Run

1. **Start Backend:**
```bash
cd backend
npm run dev
```

2. **Start Frontend (new terminal):**
```bash
cd frontend
npm run dev
```

3. **Access the application:**
- Public site: http://localhost:3000
- Faculty register: http://localhost:3000/faculty-register
- Faculty login: http://localhost:3000/faculty-login
- Admin login: http://localhost:3000/login

---

## 📝 API Examples

### Faculty Registration:
```bash
curl -X POST http://localhost:5000/api/faculty-auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sarah Adams",
    "email": "sarah@university.edu",
    "password": "password123",
    "designation": "Professor",
    "researchArea": "AI",
    "bio": "AI researcher",
    "photo": "https://..."
  }'
```

### Faculty Login:
```bash
curl -X POST http://localhost:5000/api/faculty-auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@university.edu",
    "password": "password123"
  }'
```

### Approve Faculty (Admin):
```bash
curl -X PUT http://localhost:5000/api/admin/faculty/registrations/{id}/approve \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json"
```

---

## ✨ Key Features Implemented

✅ Self-registration for faculty
✅ Admin approval workflow
✅ Separate faculty login system
✅ Faculty profile management
✅ Faculty can view their papers
✅ Faculty can delete their papers
✅ Secure password management
✅ JWT token authentication
✅ Protected routes (frontend & backend)
✅ Role-based access control
✅ Status tracking (pending/approved/rejected)
✅ Error handling & validation
✅ Success/error notifications
✅ Responsive design with Tailwind CSS

---

## 🎯 Administrative Controls

Admins can:
- View all pending faculty registrations
- Approve faculty with one click
- Reject with custom reason
- View all faculty registrations (approved/rejected/pending)
- Manage papers and faculty as before

The system maintains two separate authentication systems:
- **Admin System**: Username/Password
- **Faculty System**: Email/Password

Both use JWT tokens with role-based authorization!

