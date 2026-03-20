# SCSS Research Archive - Quick Start Checklist

## 📋 Pre-Setup Checklist

- [ ] Node.js v14+ installed
- [ ] MongoDB installed or Atlas account created
- [ ] VS Code or preferred IDE
- [ ] Terminal/PowerShell ready

## ⚡ Quick Setup (5 minutes)

### Backend Setup
```bash
# Terminal 1
cd backend
npm install
npm run dev
```
✅ You should see: "Server running on port 5000" & "MongoDB connected successfully"

### Frontend Setup
```bash
# Terminal 2
cd frontend
npm install
npm run dev
```
✅ You should see: "Local: http://localhost:3000/"

### Test the Application
```
Browser: http://localhost:3000
Click Login
Username: admin
Password: admin123
```

## 🗄️ Initial Data (Optional)
```bash
# Terminal 1 (while in backend folder)
npm run seed
```
This creates sample faculty and papers automatically.

---

## File/Folder Overview

```
📦 SOA_PROJECT
├── 📁 backend/
│   ├── controllers/     (Business logic)
│   ├── models/          (DB schemas)
│   ├── routes/          (API endpoints)
│   ├── middleware/      (Auth & errors)
│   ├── .env             (Configuration)
│   └── server.js        (Start file)
│
├── 📁 frontend/
│   ├── src/
│   │   ├── pages/       (Full page components)
│   │   ├── components/  (Reusable components)
│   │   ├── services/    (API calls)
│   │   └── App.jsx      (Main component)
│   └── .env             (API URL)
│
├── README.md            (Project info)
├── SETUP_GUIDE.md       (Detailed setup)
└── ARCHITECTURE.md      (Technical details)
```

---

## 🎯 Key Features to Try

1. **Browse Papers** - Home page lists all research papers
2. **Search & Filter** - Try search by title, filter by area
3. **View Faculty** - Faculty page shows all professors
4. **Faculty Profile** - View faculty details and their papers
5. **Admin Login** - Use default credentials above
6. **Add Paper** - Admin can add new papers
7. **Add Faculty** - Admin can add new faculty members
8. **Dashboard** - Manage all papers and faculty

---

## 🔧 If Something Goes Wrong

### Backend won't start
```bash
# Check MongoDB is running
# Windows: mongod
# macOS: brew services start mongodb-community

# Try different port in .env
PORT=5001
```

### Frontend can't connect to backend
```bash
# Check backend is running on port 5000
# Check backend shows "Server running on port 5000"
# Verify VITE_API_BASE_URL in frontend/.env
```

### Port already in use
```bash
# Change port in backend/.env or frontend/vite.config.js
```

### Dependencies won't install
```bash
npm cache clean --force
rm package-lock.json
npm install
```

---

## 📚 Documentation Files

- **README.md** - Project overview and features
- **SETUP_GUIDE.md** - Detailed installation instructions
- **ARCHITECTURE.md** - Technical architecture and design patterns

---

## 🚀 Next Steps

1. ✅ Get backend & frontend running
2. ✅ Login with admin credentials
3. ✅ Add some sample papers/faculty
4. ✅ Test search and filtering
5. ✅ Explore the code structure
6. ✅ Read ARCHITECTURE.md for deeper understanding

---

## 💡 Common Commands

```bash
# Backend
npm run dev      # Start with auto-reload
npm run seed     # Add sample data
npm start        # Production start

# Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview built version
```

---

## 🎨 Customization Tips

### Change Colors
Edit `frontend/tailwind.config.js` theme colors

### Add New Pages
1. Create file in `frontend/src/pages/`
2. Add route in `App.jsx`
3. Create API endpoints if needed

### Change Admin Credentials
After first setup, you can update via database directly

---

## 📞 Support

If stuck on specific issue:
1. Check SETUP_GUIDE.md troubleshooting section
2. Verify MongoDB is running
3. Check terminal error messages
4. Review ARCHITECTURE.md for understanding flow

---

## ✨ You're All Set!

Your SCSS Research Archive application is ready to use.

Happy coding! 🎉
