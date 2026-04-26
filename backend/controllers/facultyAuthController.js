import Faculty from '../models/Faculty.js';
import jwt from 'jsonwebtoken';

// Faculty Registration
export const registerFaculty = async (req, res) => {
  try {
    const { name, email, password, designation, researchArea, bio, photo } = req.body;

    // Validation
    if (!name || !email || !password || !designation || !researchArea) {
      return res.status(400).json({ 
        message: 'Name, email, password, designation, and research area are required' 
      });
    }

    // Check if email already exists
    const existingFaculty = await Faculty.findOne({ email: email.toLowerCase() });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new faculty with pending status
    const faculty = new Faculty({
      name,
      email: email.toLowerCase(),
      password,
      designation,
      researchArea,
      bio,
      photo,
      isAuthEnabled: true,
      registrationStatus: 'pending',
      registrationDate: new Date(),
    });

    await faculty.save();

    res.status(201).json({
      message: 'Registration successful! Awaiting admin approval.',
      facultyId: faculty._id,
      status: faculty.registrationStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Faculty Login
export const loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const faculty = await Faculty.findOne({ email: email.toLowerCase() });

    if (!faculty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if faculty is approved
    if (faculty.registrationStatus !== 'approved') {
      return res.status(403).json({ 
        message: `Registration status: ${faculty.registrationStatus}. Please wait for admin approval.` 
      });
    }

    // Verify password
    const isMatch = await faculty.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: faculty._id, 
        email: faculty.email, 
        role: 'faculty',
        name: faculty.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Return faculty data (excluding password)
    const facultyData = faculty.toObject();
    delete facultyData.password;

    res.status(200).json({
      message: 'Login successful',
      token,
      faculty: facultyData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Faculty Profile
export const getFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Exclude password
    const facultyData = faculty.toObject();
    delete facultyData.password;

    res.status(200).json({
      data: facultyData,
      message: 'Profile retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Faculty Profile
export const updateFacultyProfile = async (req, res) => {
  try {
    const { name, designation, researchArea, bio, photo, password, newPassword } = req.body;

    const faculty = await Faculty.findById(req.user.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // If changing password, verify old password
    if (newPassword) {
      if (!password) {
        return res.status(400).json({ message: 'Current password required to change password' });
      }

      const isMatch = await faculty.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      faculty.password = newPassword;
    }

    // Update fields
    if (name) faculty.name = name;
    if (designation) faculty.designation = designation;
    if (researchArea) faculty.researchArea = researchArea;
    if (bio !== undefined) faculty.bio = bio;
    if (photo !== undefined) faculty.photo = photo;

    await faculty.save();

    // Return updated data (excluding password)
    const updatedData = faculty.toObject();
    delete updatedData.password;

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Faculty's Own Papers
export const getFacultyPapers = async (req, res) => {
  try {
    const { Paper } = await import('../models/Paper.js');
    
    const papers = await Paper.find({ facultyId: req.user.id })
      .populate('facultyId', 'name email designation');

    res.status(200).json({
      data: papers,
      count: papers.length,
      message: 'Papers retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
