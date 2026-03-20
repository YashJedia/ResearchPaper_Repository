# SCSS Research Archive - FAQs & Troubleshooting

## ❓ Frequently Asked Questions

### General Questions

**Q: What is SOA (Service-Oriented Architecture)?**
A: SOA is an architectural style that breaks down the application into small, independent services. Each service (Auth, Faculty, Paper) handles specific functionality and can be developed, tested, and deployed independently.

**Q: Do I need to install MongoDB separately?**
A: Yes, you can either:
- Install MongoDB locally from mongodb.com
- Use MongoDB Atlas cloud (free tier available)
- Use Docker with MongoDB image

**Q: How long does it take to set up?**
A: About 10-15 minutes if you have Node.js and MongoDB ready.

**Q: Can I run this on my laptop?**
A: Yes! It's designed for development. For production, use proper hosting services.

**Q: Is this production-ready?**
A: It's a solid foundation. For production, add:
- Comprehensive testing
- Security hardening
- Database backups
- Monitoring and logging
- Rate limiting
- Input sanitization

### Technical Questions

**Q: What's the difference between frontend and backend?**
A: 
- **Frontend**: React app running in browser (port 3000)
- **Backend**: Node.js server managing data & logic (port 5000)

**Q: Why use JWT tokens?**
A: JWT (JSON Web Tokens) are:
- Stateless (no server-side storage needed)
- Secure if token is kept private
- Easy to transmit in HTTP headers
- Standard for modern APIs

**Q: What are Mongoose schemas?**
A: Schemas define the structure of data in MongoDB:
- Field names and types
- Required fields
- Validation rules
- Default values

**Q: How is data protected?**
A: Multiple layers:
- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Role-based access control
- CORS for cross-origin protection
- Input validation

### Database Questions

**Q: Where is MongoDB expecting data?**
A: At the URI defined in `backend/.env` (default: `mongodb://localhost:27017/scss_research_archive`)

**Q: How do I view my database?**
A: Use MongoDB Compass (free GUI tool) or command-line tools

**Q: Can I use PostgreSQL instead of MongoDB?**
A: Yes, but you'd need to:
- Change Mongoose to TypeORM or Sequelize
- Rewrite all models
- Understand relational vs document databases

---

## 🐛 Troubleshooting Guide

### Issue 1: "MongoDB connection error"

**Symptoms**:
```
MongoNetworkError: connect ECONNREFUSED
```

**Solutions**:

1. **Check if MongoDB is running**:
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

2. **Verify connection string in `.env`**:
```
# Correct format:
MONGODB_URI=mongodb://localhost:27017/scss_research_archive

# For Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

3. **Check if port 27017 is available**:
```bash
# Windows
netstat -ano | findstr :27017

# macOS/Linux
lsof -i :27017
```

4. **Test connection manually**:
```bash
# In MongoDB shell
mongo mongodb://localhost:27017/scss_research_archive
```

---

### Issue 2: "Port already in use"

**Error**:
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions**:

1. **Kill process using the port** (Windows):
```bash
# Find PID (Process ID)
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

2. **Or change the port** in `backend/.env`:
```
PORT=5001
```

3. **Or in Vite config** for frontend, change port in `vite.config.js`:
```javascript
server: {
  port: 3001,
}
```

---

### Issue 3: "Cannot find module" errors

**Error**:
```
Cannot find module 'express'
```

**Solutions**:

1. **Install dependencies**:
```bash
npm install
```

2. **If still failing**:
```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -r node_modules package-lock.json

# Reinstall
npm install
```

3. **Check Node version** (must be v14+):
```bash
node --version
```

---

### Issue 4: "CORS error" in browser

**Error**:
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions**:

1. **Ensure backend CORS is enabled**:
Check `server.js` has:
```javascript
app.use(cors());
```

2. **Verify API base URL**:
Frontend's `services/api.js` should point to correct backend:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

3. **Both servers must be running**:
- Backend on port 5000
- Frontend on port 3000

4. **Check firewall/antivirus**:
May be blocking port 5000

---

### Issue 5: "Login fails" or "Invalid credentials"

**Solutions**:

1. **Verify user exists** (after running seed):
```bash
# In backend folder
npm run seed
```

2. **Default credentials**:
- Username: `admin`
- Password: `admin123`

3. **Check backend is running**:
- Terminal should show "Server running on port 5000"

4. **Clear browser storage** and try again:
```javascript
// In browser console
localStorage.clear();
```

5. **Check password is case-sensitive**:
Passwords are case-sensitive!

---

### Issue 6: "Cannot POST /api/papers"

**Error**:
```
404 Cannot POST /api/papers
```

**Solutions**:

1. **Ensure backend routes are loaded**:
Check `server.js` has:
```javascript
app.use('/api/papers', paperRoutes);
```

2. **Verify you're logged in**:
Admin operations require JWT token

3. **Check token in headers**:
Open browser DevTools → Network → Check Authorization header

4. **Backend might have crashed**:
Check backend terminal for errors

---

### Issue 7: "Validation error" when adding paper

**Error**:
```
400 Required fields are missing
```

**Solutions**:

1. **Check all required fields are filled**:
Required: title, author, year, journal, link, researchArea, facultyId

2. **Select a faculty member** from dropdown

3. **Ensure URL link is valid** (starts with http/https)

---

### Issue 8: "Frontend won't load"

**Symptoms**:
- Blank page
- Nothing showing at localhost:3000

**Solutions**:

1. **Check if Vite server is running**:
Terminal should show development server URL

2. **Check browser console** (F12):
Look for error messages

3. **Verify no terminal errors** in frontend folder

4. **Clear browser cache**:
```bash
# Ctrl+Shift+Delete in most browsers
Or Cmd+Shift+Delete on Mac
```

5. **Try different port**:
Edit `vite.config.js` and change port

---

### Issue 9: "Database not seeding"

**Solutions**:

1. **Ensure MongoDB is running**

2. **Check MONGODB_URI is correct**

3. **Run seed script with proper path**:
```bash
cd backend
npm run seed
```

4. **Check for overwriting errors**:
If collections already exist, use MongoDB compass to delete them first

---

### Issue 10: "API responses are slow"

**Solutions**:

1. **Check MongoDB indexing**:
Current setup should be fast for small datasets

2. **Reduce query data**:
Implement pagination for large datasets

3. **Use database monitoring**:
Check if queries are efficient

4. **Check network** in browser DevTools

---

## ✅ Verification Checklist

Run through this to ensure everything works:

- [ ] MongoDB is running
  ```bash
  mongo --version
  ```

- [ ] Node.js is installed
  ```bash
  node --version
  # Should be v14 or higher
  ```

- [ ] Backend dependencies installed
  ```bash
  cd backend && ls node_modules
  ```

- [ ] Backend starts without errors
  ```bash
  npm run dev
  # Should show "Server running on port 5000"
  ```

- [ ] Frontend dependencies installed
  ```bash
  cd frontend && ls node_modules
  ```

- [ ] Frontend starts without errors
  ```bash
  npm run dev
  # Should show "Local: http://localhost:3000/"
  ```

- [ ] Can access frontend
  ```
  http://localhost:3000 loads in browser
  ```

- [ ] Can login with default credentials
  ```
  admin / admin123
  ```

- [ ] Can view papers on home page

- [ ] Can view faculty list

- [ ] Admin can add new paper

---

## 🛠️ Common Configuration Changes

### Change Default Port (Backend)
In `backend/.env`:
```
PORT=5001
```

### Change API Base URL (Frontend)
In `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:5001/api
```

### Change Admin Credentials
After setup, use:
```bash
# Create new admin user
POST /api/auth/register
{
  "username": "newadmin",
  "password": "newpassword"
}
```

### Add Custom MongoDB URI
For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mydb?retryWrites=true&w=majority
```

---

## 📞 Debug Tips

### 1. Enable Verbose Logging
Add to `server.js`:
```javascript
if (process.env.DEBUG) {
  mongoose.set('debug', true);
}
```

### 2. Check API Requests
In browser DevTools:
- Network tab shows all requests
- Look for failing requests (red)
- Check response body for error details

### 3. MongoDB Shell Testing
```bash
# Connect
mongo

# Show databases
show dbs

# Use specific database
use scss_research_archive

# Show collections
show collections

# View documents
db.users.find()
db.papers.find().pretty()
```

### 4. Test Backend API with curl
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get papers
curl http://localhost:5000/api/papers
```

---

## 🆘 Still Having Issues?

1. **Check the Docs**:
   - README.md - Project overview
   - SETUP_GUIDE.md - Installation details
   - ARCHITECTURE.md - Technical design

2. **Review Error Messages**:
   - Read terminal output carefully
   - Check browser console (F12)
   - Look at network requests

3. **Try Minimal Setup**:
   - Just get backend running
   - Then add frontend
   - Don't add features until basics work

4. **Restart Components**:
   - Stop backend (Ctrl+C)
   - Stop frontend
   - Stop MongoDB
   - Start in reverse order

5. **Clean Installation**:
   - Remove node_modules
   - Clear npm cache
   - Reinstall everything
   - Start fresh

---

## 💡 Pro Tips

- Use `npm run dev` for development (auto-reload)
- Use MongoDB Compass to visualize database
- Use VS Code with REST Client extension to test APIs
- Keep terminal windows organized (multiple monitors help!)
- Use different colors for different terminals
- Save API calls in Postman for quick testing

---

**Last Updated**: March 2024
**Version**: 1.0.0

*Remember: Most issues are just configuration or missing services. Check the checklist above first!*
