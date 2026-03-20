# SCSS Research Archive - Version Control Guide

## Git Setup

Initialize a git repository for version control:

```bash
# In project root
git init
git add .
git commit -m "Initial commit: Complete SCSS Research Archive MERN application"
```

## .gitignore Files

Both backend and frontend have `.gitignore` files configured to exclude:
- `node_modules/` - Dependencies (can be reinstalled with npm install)
- `.env` files - Contains sensitive data
- Build artifacts - `dist/`, `build/`
- Logs and temporary files

## Important: Environment Files

**Never commit `.env` files to git!** They contain sensitive information like:
- Database credentials
- JWT secrets
- API keys

Instead:
1. Create `.env.example` files with dummy values
2. Share these examples with team members
3. Each developer creates their own `.env` locally

## Remote Repository Setup

To push to GitHub/GitLab/Bitbucket:

```bash
# Add remote repository
git remote add origin https://github.com/yourusername/scss-research-archive.git

# Push to remote
git branch -M main
git push -u origin main
```

## Deployment Preparation

Before deploying:

1. **Backend**:
   - Update `.env` with production values
   - Change JWT_SECRET to a strong random string
   - Update MONGODB_URI to production database
   - Set NODE_ENV=production

2. **Frontend**:
   - Update VITE_API_BASE_URL to production backend
   - Run `npm run build`
   - Deploy `dist/` folder

## File Overview for Version Control

### Backend Files
```
backend/
├── .env                 (DO NOT COMMIT - secrets)
├── .env.example         (COMMIT - template)
├── .gitignore          (COMMIT)
├── node_modules/       (IGNORE)
├── package.json        (COMMIT)
├── package-lock.json   (COMMIT)
├── server.js           (COMMIT)
├── seed.js             (COMMIT)
└── /* all source files (COMMIT) */
```

### Frontend Files
```
frontend/
├── .env                (DO NOT COMMIT - config)
├── .env.example        (COMMIT - template)
├── .gitignore         (COMMIT)
├── node_modules/      (IGNORE)
├── package.json       (COMMIT)
├── package-lock.json  (COMMIT)
├── dist/              (IGNORE - build output)
└── src/               (COMMIT - source code)
```

## Create .env.example Files

### backend/.env.example
```
MONGODB_URI=mongodb://localhost:27017/scss_research_archive
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### frontend/.env.example
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Common Git Workflows

### Creating a Feature Branch
```bash
git checkout -b feature/add-paper-search
# Make changes
git add .
git commit -m "feat: Add paper search functionality"
git push origin feature/add-paper-search
```

### Syncing with Team
```bash
git pull origin main
git push origin main
```

### Reverting Changes
```bash
# Undo uncommitted changes
git checkout -- .

# Undo last commit
git reset HEAD~1
```

## Collaborative Development

When working with a team:

1. Always pull before starting work:
   ```bash
   git pull origin main
   ```

2. Create feature branches:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit regularly with clear messages:
   ```bash
   git commit -m "type: description"
   ```

4. Push your branch and create a pull request

## Commit Message Convention

Follow semantic commit messages:

```
feat:   New feature
fix:    Bug fix
docs:   Documentation changes
style:  Code style (no logic changes)
refactor: Code restructuring
test:   Test additions/changes
chore:  Dependency updates
```

Example:
```bash
git commit -m "feat: Add faculty search functionality"
git commit -m "fix: Resolve CORS issue with frontend"
git commit -m "docs: Update README with API endpoints"
```

## Branching Strategy

Recommended Git Flow:

```
main (production)
  ↓
develop (staging)
  ↓
feature/xyz (feature development)
```

Process:
1. Create feature branch from `develop`
2. Work on your feature
3. Create pull request to `develop`
4. Review and merge
5. Periodically merge `develop` to `main` for release

## Ignoring Files Properly

If you accidentally committed `.env`:

```bash
# Remove from git but keep locally
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: Stop tracking environment files"
git push
```

## Useful Git Commands

```bash
# View status
git status

# View logs
git log --oneline

# View changes
git diff

# Stash changes temporarily
git stash
git stash pop

# View branches
git branch -a

# Delete local branch
git branch -d feature/name

# Force push (use cautiously!)
git push -f origin branch-name
```

## Continuous Integration (CI/CD)

To set up GitHub Actions:

1. Create `.github/workflows/` directory
2. Add workflow YAML files for:
   - Install dependencies
   - Run tests
   - Build application
   - Deploy to production

## Security Notes

✅ DO:
- Commit source code
- Commit package.json and package-lock.json
- Commit .gitignore files
- Commit configuration templates (.env.example)

❌ DON'T:
- Commit .env files with secrets
- Commit node_modules/
- Commit build artifacts
- Commit IDE-specific files
- Commit API keys or tokens

## Repository Structure for GitHub

```
SCSS-Research-Archive/
├── README.md
├── SETUP_GUIDE.md
├── ARCHITECTURE.md
├── LICENSE
├── backend/
├── frontend/
└── .gitignore
```

## Recommended IDE Git Extensions

- VS Code: GitLens, Git Graph
- GitHub Desktop app
- Source Tree (free)

---

**Version Control Helps:**
- Track changes over time
- Collaborate with team members
- Revert to previous versions
- Maintain code history
- Deploy with confidence

Start with the basics, and you'll be a Git expert in no time!
