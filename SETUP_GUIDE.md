# SCSS Research Archive - Setup & Installation Guide

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local MongoDB server running on `mongodb://localhost:27017`
  - MongoDB Atlas cloud database (update connection string in `.env`)
- **npm** or **yarn** package manager

## Installation Steps

### Step 1: Install MongoDB (if not already installed)

#### Option A: Local MongoDB
1. Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install following the installer instructions
3. Verify installation:
   ```bash
   mongod --version
   ```
4. Start MongoDB:
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   brew services start mongodb-community
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update the `MONGODB_URI` in `backend/.env` with your Atlas connection string

### Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create/update the `.env` file with your MongoDB connection:
   ```
   MONGODB_URI=mongodb://localhost:27017/scss_research_archive
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   ```

4. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```
   This will create:
   - Admin user (username: `admin`, password: `admin123`)
   - 3 sample faculty members
   - 5 sample research papers

5. Start the backend server:
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   Server running on port 5000
   MongoDB connected successfully
   ```

### Step 3: Frontend Setup

Open a **new terminal** window and navigate to the frontend:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The `.env` file is already configured with:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   No changes needed unless you run backend on a different port.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   VITE v4.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```

### Step 4: Verify Everything Works

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the SCSS Research Archive homepage
3. Click **Login** (top right)
4. Use default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
5. Access the Dashboard and try:
   - Adding a new paper
   - Adding new faculty
   - Editing/deleting papers

## Troubleshooting

### MongoDB Connection Issues
**Error**: `MongoDB connection error: connect ECONNREFUSED`

**Solutions**:
- Ensure MongoDB is running:
  ```bash
  # Windows - Open PowerShell as Admin and run:
  net start MongoDB
  
  # macOS
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongod
  ```
- Check your `MONGODB_URI` in `.env`
- If using MongoDB Atlas, ensure:
  - Connection string is correct
  - IP address is whitelisted
  - Network access is enabled

### Port Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change PORT in backend/.env to a different port (e.g., 5001)
```

### Frontend Can't Connect to Backend
**Error**: Network request fails or CORS error

**Solutions**:
- Ensure backend is running on `http://localhost:5000`
- Check backend is printing "Server running on port 5000"
- Verify `VITE_API_BASE_URL` in `frontend/.env`
- Check browser console for exact error

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

## Project Commands

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## File Structure Reference

```
SOA_PROJECT/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth & error handling
│   ├── models/                # Database schemas
│   ├── routes/                # API endpoints
│   ├── .env                   # Environment variables
│   ├── server.js              # Main server file
│   └── seed.js                # Database seeding
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API calls
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── index.html             # HTML template
│   ├── .env                   # Frontend config
│   └── vite.config.js         # Vite configuration
│
├── README.md                  # Project documentation
└── SETUP_GUIDE.md            # This file
```

## API Documentation

### Authentication
```
POST /api/auth/login
Body: { username: string, password: string }
Returns: { token: string, user: object }
```

### Faculty Operations
```
GET    /api/faculty              # Get all faculty
GET    /api/faculty/:id          # Get specific faculty
POST   /api/faculty              # Create (Admin only)
PUT    /api/faculty/:id          # Update (Admin only)
DELETE /api/faculty/:id          # Delete (Admin only)
```

### Paper Operations
```
GET    /api/papers               # Get all papers
GET    /api/papers/:id           # Get specific paper
GET    /api/papers/search?q=...  # Search papers
GET    /api/papers/analytics     # Get statistics
POST   /api/papers               # Create (Admin only)
PUT    /api/papers/:id           # Update (Admin only)
DELETE /api/papers/:id           # Delete (Admin only)
```

## Default Test Data

After running `npm run seed`, the database contains:

### Admin User
- **Username**: admin
- **Password**: admin123

### Faculty Members
1. Dr. Sarah Johnson - Professor (Machine Learning)
2. Dr. Michael Chen - Associate Professor (Data Science)
3. Dr. Emily Rodriguez - Assistant Professor (Cybersecurity)

### Sample Papers
- 5 research papers across different research areas

## Development Tips

1. **Hot Module Replacement (HMR)**: Frontend automatically reloads on file changes
2. **Nodemon**: Backend automatically restarts on file changes
3. **Environment Variables**: Never commit `.env` files with secrets
4. **CORS**: Backend is configured to accept requests from `localhost:3000`

## Performance Optimization

For production deployment:

### Backend
1. Update `NODE_ENV` to `production`
2. Change `JWT_SECRET` to a strong random string
3. Use environment-specific MongoDB connection
4. Enable compression middleware
5. Set up proper logging

### Frontend
1. Run `npm run build`
2. Deploy the `dist` folder to a static hosting service
3. Update `VITE_API_BASE_URL` to production backend URL

## Next Steps

After successful installation:
1. Explore the application interface
2. Try adding new research papers
3. Create faculty profiles
4. Test search and filter functionality
5. Review the code structure for learning purposes

## Support & Learning

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## License

This project is open source and available under the MIT License.

---

**Last Updated**: March 2024
**Version**: 1.0.0
