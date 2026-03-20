# SCSS Research Archive - API Testing Guide

## Testing the API

You can test the API endpoints using:
- **Postman** (GUI)
- **curl** (Command line)
- **VS Code REST Client** extension
- **Thunder Client** (VS Code)
- Browser console with Fetch API

---

## 🔐 Authentication Endpoints

### 1. Login (Get JWT Token)

**Request**:
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**curl**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "ObjectId...",
    "username": "admin",
    "role": "admin"
  }
}
```

### 2. Register New User

**Request**:
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "ObjectId...",
    "username": "newuser"
  }
}
```

---

## 👥 Faculty Endpoints

### 1. Get All Faculty

**Request**:
```http
GET http://localhost:5000/api/faculty
```

**curl**:
```bash
curl http://localhost:5000/api/faculty
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "_id": "ObjectId...",
      "name": "Dr. Sarah Johnson",
      "designation": "Professor",
      "email": "sarah@university.edu",
      "researchArea": "Machine Learning",
      "bio": "...",
      "photo": "https://...",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Get Faculty by ID

**Request**:
```http
GET http://localhost:5000/api/faculty/65a1b2c3d4e5f6g7h8i9j0k1
```

**Response** (200 OK):
```json
{
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Dr. Sarah Johnson",
    ...
  }
}
```

### 3. Create Faculty (Admin Only)

**Request**:
```http
POST http://localhost:5000/api/faculty
Content-Type: application/json
Authorization: Bearer <YOUR_JWT_TOKEN>

{
  "name": "Dr. John Doe",
  "designation": "Assistant Professor",
  "email": "john.doe@university.edu",
  "researchArea": "Data Science",
  "bio": "Expert in big data analytics",
  "photo": "https://via.placeholder.com/300"
}
```

**curl**:
```bash
curl -X POST http://localhost:5000/api/faculty \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Dr. John Doe",
    "designation": "Assistant Professor",
    "email": "john.doe@university.edu",
    "researchArea": "Data Science",
    "bio": "Expert in big data analytics",
    "photo": "https://via.placeholder.com/300"
  }'
```

**Response** (201 Created):
```json
{
  "message": "Faculty created successfully",
  "data": {
    "_id": "new_id...",
    "name": "Dr. John Doe",
    ...
  }
}
```

### 4. Update Faculty (Admin Only)

**Request**:
```http
PUT http://localhost:5000/api/faculty/65a1b2c3d4e5f6g7h8i9j0k1
Content-Type: application/json
Authorization: Bearer <YOUR_JWT_TOKEN>

{
  "name": "Dr. John Doe",
  "designation": "Associate Professor",
  "bio": "Updated bio..."
}
```

**Response** (200 OK):
```json
{
  "message": "Faculty updated successfully",
  "data": { ... }
}
```

### 5. Delete Faculty (Admin Only)

**Request**:
```http
DELETE http://localhost:5000/api/faculty/65a1b2c3d4e5f6g7h8i9j0k1
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "message": "Faculty deleted successfully"
}
```

---

## 📄 Paper Endpoints

### 1. Get All Papers

**Request**:
```http
GET http://localhost:5000/api/papers
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "_id": "ObjectId...",
      "title": "Deep Learning in NLP",
      "author": "Johnson, S.",
      "year": 2023,
      "journal": "IEEE Transactions",
      "doi": "10.1109/2023.12345",
      "link": "https://example.com/paper",
      "abstract": "This paper explores...",
      "researchArea": "Machine Learning",
      "facultyId": {
        "_id": "ObjectId...",
        "name": "Dr. Sarah Johnson",
        ...
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Get Paper by ID

**Request**:
```http
GET http://localhost:5000/api/papers/65a1b2c3d4e5f6g7h8i9j0k1
```

**Response** (200 OK):
```json
{
  "data": { ... }
}
```

### 3. Search Papers

**Request with keyword**:
```http
GET http://localhost:5000/api/papers/search?q=machine+learning
```

**Request with multiple filters**:
```http
GET http://localhost:5000/api/papers/search?q=deep+learning&researchArea=Machine+Learning&year=2023
```

**Query Parameters**:
- `q` - Search keyword (searches title, author, abstract)
- `researchArea` - Filter by research area
- `year` - Filter by publication year

**curl**:
```bash
curl "http://localhost:5000/api/papers/search?q=machine+learning&researchArea=ML&year=2023"
```

**Response** (200 OK):
```json
{
  "data": [
    { ... papers matching criteria ... }
  ]
}
```

### 4. Get Analytics

**Request**:
```http
GET http://localhost:5000/api/papers/analytics
```

**Response** (200 OK):
```json
{
  "data": {
    "totalPapers": 25,
    "papersByArea": [
      {
        "_id": "Machine Learning",
        "count": 8
      },
      {
        "_id": "Data Science",
        "count": 7
      },
      {
        "_id": "Cybersecurity",
        "count": 5
      }
    ],
    "latestPapers": [
      { ... 10 most recent papers ... }
    ]
  }
}
```

### 5. Create Paper (Admin Only)

**Request**:
```http
POST http://localhost:5000/api/papers
Content-Type: application/json
Authorization: Bearer <YOUR_JWT_TOKEN>

{
  "title": "Quantum Computing Applications",
  "author": "Dr. Sarah Johnson",
  "year": 2024,
  "journal": "Nature Reviews",
  "doi": "10.1038/2024.xxxxx",
  "link": "https://example.com/quantum-paper",
  "abstract": "A comprehensive review of quantum computing applications in cryptography and optimization...",
  "researchArea": "Machine Learning",
  "facultyId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

**curl**:
```bash
curl -X POST http://localhost:5000/api/papers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "title": "Quantum Computing Applications",
    "author": "Dr. Sarah Johnson",
    "year": 2024,
    "journal": "Nature Reviews",
    "doi": "10.1038/2024.xxxxx",
    "link": "https://example.com/quantum-paper",
    "abstract": "A comprehensive review...",
    "researchArea": "Machine Learning",
    "facultyId": "65a1b2c3d4e5f6g7h8i9j0k1"
  }'
```

**Response** (201 Created):
```json
{
  "message": "Paper created successfully",
  "data": {
    "_id": "new_paper_id...",
    "title": "Quantum Computing Applications",
    ...
  }
}
```

### 6. Update Paper (Admin Only)

**Request**:
```http
PUT http://localhost:5000/api/papers/65a1b2c3d4e5f6g7h8i9j0k1
Content-Type: application/json
Authorization: Bearer <YOUR_JWT_TOKEN>

{
  "title": "Updated Paper Title",
  "abstract": "Updated abstract..."
}
```

**Response** (200 OK):
```json
{
  "message": "Paper updated successfully",
  "data": { ... }
}
```

### 7. Delete Paper (Admin Only)

**Request**:
```http
DELETE http://localhost:5000/api/papers/65a1b2c3d4e5f6g7h8i9j0k1
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "message": "Paper deleted successfully"
}
```

---

## 🧪 Complete Testing Workflow

### Step 1: Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Save the returned token
```

### Step 2: Get All Faculty
```bash
curl http://localhost:5000/api/faculty
# Note down a faculty ID from the response
```

### Step 3: Create a Paper (Replace token and facultyId)
```bash
curl -X POST http://localhost:5000/api/papers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Paper",
    "author": "Test Author",
    "year": 2024,
    "journal": "Test Journal",
    "link": "https://example.com",
    "researchArea": "Testing",
    "facultyId": "FACULTY_ID_HERE"
  }'
```

### Step 4: Search Papers
```bash
curl "http://localhost:5000/api/papers/search?q=test"
```

### Step 5: Get Analytics
```bash
curl http://localhost:5000/api/papers/analytics
```

---

## ⚡ Using Postman

1. **Create new request** for each endpoint
2. **Select HTTP method** (GET, POST, PUT, DELETE)
3. **Enter URL**:
   - GET /api/faculty → `http://localhost:5000/api/faculty`
   - POST /api/papers → `http://localhost:5000/api/papers`

4. **For protected endpoints**:
   - Go to "Authorization" tab
   - Select "Bearer Token"
   - Paste your JWT token

5. **For POST/PUT requests**:
   - Go to "Body" tab
   - Select "raw" and "JSON"
   - Paste JSON data

6. **Click "Send"** to execute request

---

## 🔴 Common Error Responses

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```
**Solution**: Login again and get a new token

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```
**Solution**: Perform operation with admin account

### 404 Not Found
```json
{
  "message": "Route not found"
}
```
**Solution**: Check URL spelling and method

### 400 Bad Request
```json
{
  "message": "Required fields are missing"
}
```
**Solution**: Include all required fields in request body

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```
**Solution**: Check backend console for error details

---

## 📝 REST Client Extension (VS Code)

Create a file `test.rest`:

```rest
### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

### Get All Faculty
GET http://localhost:5000/api/faculty

### Get All Papers
GET http://localhost:5000/api/papers

### Search Papers
GET http://localhost:5000/api/papers/search?q=machine&researchArea=ML&year=2023

### Get Analytics
GET http://localhost:5000/api/papers/analytics

### Create Paper (Replace token and facultyId)
POST http://localhost:5000/api/papers
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Sample Paper",
  "author": "Author Name",
  "year": 2024,
  "journal": "Journal Name",
  "link": "https://example.com",
  "researchArea": "ML",
  "facultyId": "65a1b2c3d4e5f6g7"
}
```

Then click the "Send Request" button above each request!

---

## 🔗 HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## 💾 Sample Data Objects

### Faculty Object
```json
{
  "_id": "ObjectId",
  "name": "Dr. Name",
  "designation": "Professor",
  "email": "name@university.edu",
  "researchArea": "Field",
  "bio": "Biography...",
  "photo": "https://url.to.image",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Paper Object
```json
{
  "_id": "ObjectId",
  "title": "Paper Title",
  "author": "Author Name",
  "year": 2024,
  "journal": "Journal Name",
  "doi": "10.xxxx/xxxxx",
  "link": "https://paper.url",
  "abstract": "Paper abstract...",
  "researchArea": "Field",
  "facultyId": {
    "_id": "ObjectId",
    "name": "Faculty Name"
  },
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

---

**Pro Tips**:
- Save frequently used requests
- Use environment variables for token in Postman
- Test all CRUD operations (Create, Read, Update, Delete)
- Verify error responses match expected output
- Always send token for admin-only endpoints

---

**Last Updated**: March 2024
**Version**: 1.0.0
