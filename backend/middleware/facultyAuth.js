import jwt from 'jsonwebtoken';

// Verify Faculty Token
export const verifyFacultyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify it's a faculty token
    if (decoded.role !== 'faculty') {
      return res.status(403).json({ message: 'Faculty access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Verify user is updating their own profile
export const isOwnProfile = (req, res, next) => {
  if (req.user.id !== req.params.id && !req.params.id) {
    // If no ID in params, they're updating their own profile (from /me endpoint)
    return next();
  }

  if (req.user.id === req.params.id) {
    return next();
  }

  return res.status(403).json({ message: 'You can only update your own profile' });
};
