import Faculty from '../models/Faculty.js';

export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.status(200).json({ data: faculty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({ data: faculty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createFaculty = async (req, res) => {
  try {
    const { name, designation, email, researchArea, bio, photo } = req.body;

    if (!name || !designation || !email || !researchArea) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const faculty = new Faculty({ name, designation, email, researchArea, bio, photo });
    await faculty.save();

    res.status(201).json({ message: 'Faculty created successfully', data: faculty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, email, researchArea, bio, photo } = req.body;

    const faculty = await Faculty.findByIdAndUpdate(
      id,
      { name, designation, email, researchArea, bio, photo },
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({ message: 'Faculty updated successfully', data: faculty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByIdAndDelete(id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
