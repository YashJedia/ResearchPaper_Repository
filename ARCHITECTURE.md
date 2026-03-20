# SCSS Research Archive - Architecture & Development Guide

## System Architecture

This project follows a **Service-Oriented Architecture (SOA)** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                 │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │   Pages      │ Components   │    Services (API)        │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└────────────────────────────────────────────────────────────┐
                              │
                    HTTP/REST (Axios)
                              │
┌────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                    │
│  ┌──────────┬──────────────┬───────────┬──────────────────┐ │
│  │ Routes   │ Controllers  │Middleware │ Models           │ │
│  └──────────┴──────────────┴───────────┴──────────────────┘ │
└────────────────────────────────────────────────────────────┐
                              │
                         MongoDB
```

## Backend Architecture

### 1. **Routes** (`/routes`)
- Defines API endpoints
- Maps HTTP methods to controller functions
- Applies middleware (authentication, authorization)

**Files**:
- `auth.js` - Authentication endpoints
- `faculty.js` - Faculty CRUD operations
- `paper.js` - Paper CRUD and search operations

### 2. **Controllers** (`/controllers`)
- Business logic for each service
- Handles requests and responses
- Communicates with database models

**Files**:
- `authController.js` - User login/registration
- `facultyController.js` - Faculty operations
- `paperController.js` - Paper operations and analytics

### 3. **Models** (`/models`)
- Database schemas using Mongoose
- Data validation rules
- Pre/post hooks for operations

**Files**:
- `User.js` - User authentication model with password hashing
- `Faculty.js` - Faculty information model
- `Paper.js` - Research paper metadata model

### 4. **Middleware** (`/middleware`)
- Authentication and authorization checks
- Error handling
- Request/response processing

**Files**:
- `auth.js` - JWT verification, role checking
- `errorHandler.js` - Global error handling

### 5. **Configuration** (`/config`)
- Database connection setup
- Environment configuration

**Files**:
- `db.js` - MongoDB connection

## Frontend Architecture

### 1. **Pages** (`/src/pages`)
Full-page components that manage routes and complex state:
- `Home.jsx` - Main papers listing with search/filters
- `Faculty.jsx` - Faculty listing
- `FacultyProfile.jsx` - Individual faculty details
- `Login.jsx` - Admin authentication
- `Dashboard.jsx` - Admin management interface
- `AddPaper.jsx` - Add/edit paper form
- `AddFaculty.jsx` - Add/edit faculty form

### 2. **Components** (`/src/components`)
Reusable UI components:
- `Header.jsx` - Navigation bar
- `Footer.jsx` - Page footer
- `PaperCard.jsx` - Paper display card
- `FacultyCard.jsx` - Faculty display card

### 3. **Services** (`/src/services`)
API integration layer:
- `api.js` - Axios instance with interceptors and all API endpoints

### 4. **Styling**
- **Tailwind CSS** for utility classes
- **Custom CSS** for global styles
- **Color Theme**: Dark Green, Beige, Gold

## Data Flow

### User Registration/Login Flow
```
Frontend (Login.jsx)
    ↓
Axios POST /api/auth/login
    ↓
Backend authController.login()
    ↓
User.findOne() & password verification
    ↓
JWT token generated
    ↓
Token stored in localStorage
    ↓
User redirected to Dashboard
```

### Paper Retrieval Flow
```
Frontend (Home.jsx)
    ↓
paperAPI.getAll() called on mount
    ↓
Axios GET /api/papers
    ↓
Backend paperController.getAllPapers()
    ↓
Paper.find().populate('facultyId')
    ↓
Returns papers with faculty info
    ↓
Component renders PaperCard for each paper
```

### Protected Route Flow
```
User clicks protected route
    ↓
App.jsx checks localStorage for token
    ↓
If no token → Redirect to /login
    ↓
If token exists → Render protected component
    ↓
API requests include token in Authorization header
    ↓
Backend verifyToken middleware checks JWT
    ↓
Request proceeds or returns 401 Unauthorized
```

## Authentication & Authorization

### JWT Implementation
1. User logs in with credentials
2. Backend verifies password and creates JWT token
3. Token stored in browser's localStorage
4. Token sent in Authorization header for protected requests
5. Middleware verifies token validity

### Role-Based Access Control
- **User Role**: Can view papers and faculty
- **Admin Role**: Can create/edit/delete papers and faculty

**Protection**:
```javascript
// Route with admin protection
router.post('/papers', verifyToken, isAdmin, createPaper);
```

## Database Relationships

### User Model
- Stores admin credentials
- Password hashed with bcryptjs
- Timestamps for creation/update

### Faculty Model
- Independent entity
- Contains biographical information
- Referenced by papers (one-to-many)

### Paper Model
- References Faculty via `facultyId`
- Stores paper metadata
- Searchable fields: title, author, abstract

```
Faculty (1) ──→ (Many) Papers
```

## API Response Structure

All endpoints return consistent JSON structure:

**Success Response**:
```javascript
{
  data: {...},
  message: "Operation successful"
}
```

**Error Response**:
```javascript
{
  message: "Error description",
  error: {...} // Only in development
}
```

## Search & Filter Implementation

### Advanced Search
```javascript
// Search query with multiple fields
GET /api/papers/search?q=keyword&researchArea=ML&year=2023

Controller logic:
- Regex search on title, author, abstract
- Filter by research area and year
- Returns matching papers populated with faculty info
```

## Analytics Feature

```javascript
GET /api/papers/analytics

Returns:
{
  totalPapers: number,
  papersByArea: [{_id: area, count: number}],
  latestPapers: [papers array]
}
```

## Error Handling Strategy

### Backend Error Handling
```javascript
// Try-catch in all controllers
try {
  // Database operation
} catch (error) {
  res.status(500).json({message: 'Error', error: error.message})
}

// Global error handler middleware catches uncaught errors
```

### Frontend Error Handling
```javascript
// Try-catch with user feedback
try {
  const response = await paperAPI.getAll();
} catch (err) {
  setError('Failed to load papers');
  // Display error to user
}
```

## Security Measures

1. **Password Security**
   - Bcryptjs hashing with salt rounds
   - Never store plain passwords

2. **Authentication**
   - JWT tokens with expiration
   - Token validation on protected routes

3. **CORS**
   - Configured to only allow requests from frontend origin
   - Prevents unauthorized cross-origin requests

4. **Input Validation**
   - Required field checking
   - Email format validation
   - Mongoose schema validation

5. **Environment Variables**
   - Sensitive data not in code
   - JWT secrets managed securely

## Performance Optimizations

### Database
- Indexes on frequently searched fields
- Population of faculty info reduces queries
- Aggregation for analytics

### Frontend
- Component lazy loading possible
- Tailwind CSS tree-shaking
- Vite's code splitting

## Development Workflow

### Adding a New Feature

1. **Backend**:
   - Create/modify model if needed
   - Add controller logic
   - Create/modify route
   - Test with Postman/curl

2. **Frontend**:
   - Add API method in `services/api.js`
   - Create page or update component
   - Add route in `App.jsx`
   - Implement UI with Tailwind CSS

## Testing Endpoints

### Using curl or Postman

**Login**:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Create Paper** (with token):
```bash
POST http://localhost:5000/api/papers
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Paper Title",
  "author": "Author Name",
  "year": 2024,
  "journal": "Journal Name",
  "link": "https://...",
  "researchArea": "ML",
  "facultyId": "<faculty_id>"
}
```

## Scaling Considerations

To scale this application:

1. **Database**: Use MongoDB Atlas with connection pooling
2. **Caching**: Implement Redis for frequently accessed papers
3. **Search**: Use Elasticsearch for advanced search
4. **Storage**: Use AWS S3 or similar for paper PDFs
5. **Deployment**: Use Docker containerization
6. **API Gateway**: Implement rate limiting and request throttling

## Common Modifications

### Add New Field to Paper
1. Update Paper.js schema
2. Add field to form in AddPaper.jsx
3. Include in API request payload

### Add New Admin Function
1. Create controller method
2. Add route with middleware protection
3. Create frontend page/component
4. Add navigation link

### Change Color Scheme
1. Update `tailwind.config.js` theme
2. Modify component styling
3. Update CSS variables if any

## Best Practices Used

✅ ES6 modules (import/export)
✅ Async/await for asynchronous operations
✅ Error handling with try-catch
✅ MVC pattern separation
✅ Reusable components
✅ Environment variables for configuration
✅ Middleware for cross-cutting concerns
✅ DRY (Don't Repeat Yourself) principle
✅ Meaningful variable and function names
✅ Comments for complex logic

## Troubleshooting Guide

### Issue: CORS Error
**Solution**: Ensure backend CORS is configured correctly and frontend uses correct API URL

### Issue: Authentication Fails
**Solution**: Check token in localStorage, verify JWT_SECRET matches

### Issue: Data Not Saving
**Solution**: Check MongoDB connection, verify schema fields match request data

### Issue: Page Blank
**Solution**: Check browser console for errors, verify routing configuration

## Resources for Learning

- **Pattern**: [MVC Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- **Architecture**: [SOA Guide](https://en.wikipedia.org/wiki/Service-oriented_architecture)
- **Security**: [OWASP Guidelines](https://owasp.org/)
- **REST API**: [REST Best Practices](https://restfulapi.net/)

---

**Version**: 1.0.0
**Last Updated**: March 2024
