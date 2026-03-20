# SCSS Research Archive - Full Stack MERN Application

A Service-Oriented Architecture (SOA) based web application for managing and accessing university research papers.

## Project Structure

```
SOA_PROJECT/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── facultyController.js
│   │   └── paperController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Faculty.js
│   │   └── Paper.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── faculty.js
│   │   └── paper.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PaperCard.jsx
│   │   │   └── FacultyCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Faculty.jsx
│   │   │   ├── FacultyProfile.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddPaper.jsx
│   │   │   └── AddFaculty.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - CSS framework

### Design Theme
- **Colors**: Dark Green (#1B3A2F), Beige (#F5F0E6), Gold (#C2A878)
- **Typography**: Playfair Display, Georgia (serif fonts)
- **Style**: Academic, elegant, "old money" aesthetic

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas connection)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/scss_research_archive
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```
The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Faculty
- `GET /api/faculty` - Get all faculty
- `GET /api/faculty/:id` - Get faculty by ID
- `POST /api/faculty` - Create new faculty (Admin only)
- `PUT /api/faculty/:id` - Update faculty (Admin only)
- `DELETE /api/faculty/:id` - Delete faculty (Admin only)

### Papers
- `GET /api/papers` - Get all papers
- `GET /api/papers/:id` - Get paper by ID
- `GET /api/papers/search?q=keyword` - Search papers
- `GET /api/papers/analytics` - Get analytics
- `POST /api/papers` - Create new paper (Admin only)
- `PUT /api/papers/:id` - Update paper (Admin only)
- `DELETE /api/papers/:id` - Delete paper (Admin only)

## Features

### Public Features
- Browse all research papers
- Search papers by title, author, or abstract
- Filter papers by research area and year
- View faculty profiles
- View faculty publications

### Admin Features
- Admin login/logout
- Add new papers
- Edit existing papers
- Delete papers
- Add new faculty
- Edit faculty information
- Delete faculty
- View dashboard with statistics
- Access analytics

## Default Admin Credentials

For testing purposes, use the following credentials:
- **Username**: admin
- **Password**: admin123

⚠️ **Note**: Change these credentials in production!

## Database Models

### User Schema
```javascript
{
  username: String,
  password: String (hashed),
  role: String (admin/user),
  timestamps: true
}
```

### Faculty Schema
```javascript
{
  name: String,
  designation: String,
  email: String,
  researchArea: String,
  bio: String,
  photo: String,
  timestamps: true
}
```

### Paper Schema
```javascript
{
  title: String,
  author: String,
  year: Number,
  journal: String,
  doi: String,
  link: String,
  abstract: String,
  researchArea: String,
  facultyId: ObjectId (ref: Faculty),
  timestamps: true
}
```

## Key Features Implementation

### Authentication & Authorization
- JWT token-based authentication
- Protected routes for admin operations
- Password hashing with bcryptjs

### SOA Architecture
- Separate models, controllers, and routes
- Middleware for authentication and error handling
- Clean MVC structure

### Error Handling
- Global error handler middleware
- Try-catch blocks in all controllers
- Meaningful error messages

### Responsive Design
- Mobile-friendly UI using Tailwind CSS
- Grid layouts for different screen sizes
- Accessible components

## Installation Quick Start

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Future Enhancements

- Email notifications
- Advanced search with filters
- Paper recommendations
- User comments and ratings
- Export papers to BibTeX
- Bulk upload functionality
- PDF preview
- User profiles for non-admin users
- Multi-language support

## Contributing

This is a demo project. Feel free to fork and modify for your needs.

## License

MIT License

## Contact

For questions or support, please reach out to the department.

---

**Note**: Remember to update the `.env` file with your actual MongoDB connection string and JWT secret before deploying to production.
