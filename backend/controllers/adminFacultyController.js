import Faculty from '../models/Faculty.js';

// Get Pending Faculty Registrations
export const getPendingRegistrations = async (req, res) => {
  try {
    const pendingFaculty = await Faculty.find({ registrationStatus: 'pending' })
      .select('-password');

    res.status(200).json({
      data: pendingFaculty,
      count: pendingFaculty.length,
      message: 'Pending registrations retrieved',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Faculty
export const getAllFacultyRegistrations = async (req, res) => {
  try {
    const allFaculty = await Faculty.find()
      .select('-password')
      .populate('approvedBy', 'username');

    res.status(200).json({
      data: allFaculty,
      count: allFaculty.length,
      message: 'All faculty retrieved',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve Faculty Registration
export const approveFacultyRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await Faculty.findByIdAndUpdate(
      id,
      {
        registrationStatus: 'approved',
        approvedBy: req.user.id,
      },
      { new: true }
    ).select('-password');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({
      message: 'Faculty registration approved',
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject Faculty Registration
export const rejectFacultyRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const faculty = await Faculty.findByIdAndUpdate(
      id,
      {
        registrationStatus: 'rejected',
        approvedBy: req.user.id,
      },
      { new: true }
    ).select('-password');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({
      message: 'Faculty registration rejected',
      data: faculty,
      rejectionReason: reason,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
