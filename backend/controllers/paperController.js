import Paper from '../models/Paper.js';

export const getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find().populate('facultyId');
    res.status(200).json({ data: papers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPaperById = async (req, res) => {
  try {
    const { id } = req.params;
    const paper = await Paper.findById(id).populate('facultyId');

    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    res.status(200).json({ data: paper });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const searchPapers = async (req, res) => {
  try {
    const { q, researchArea, year } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { abstract: { $regex: q, $options: 'i' } },
      ];
    }

    if (researchArea) {
      query.researchArea = { $regex: researchArea, $options: 'i' };
    }

    if (year) {
      query.year = parseInt(year);
    }

    const papers = await Paper.find(query).populate('facultyId');
    res.status(200).json({ data: papers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createPaper = async (req, res) => {
  try {
    const { title, author, year, journal, doi, link, abstract, researchArea, facultyId } = req.body;

    if (!title || !author || !year || !journal || !link || !researchArea || !facultyId) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const paper = new Paper({ title, author, year, journal, doi, link, abstract, researchArea, facultyId });
    await paper.save();
    await paper.populate('facultyId');

    res.status(201).json({ message: 'Paper created successfully', data: paper });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, journal, doi, link, abstract, researchArea, facultyId } = req.body;

    const paper = await Paper.findByIdAndUpdate(
      id,
      { title, author, year, journal, doi, link, abstract, researchArea, facultyId },
      { new: true, runValidators: true }
    ).populate('facultyId');

    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    res.status(200).json({ message: 'Paper updated successfully', data: paper });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deletePaper = async (req, res) => {
  try {
    const { id } = req.params;
    const paper = await Paper.findByIdAndDelete(id);

    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    res.status(200).json({ message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalPapers = await Paper.countDocuments();
    const papersByArea = await Paper.aggregate([
      {
        $group: {
          _id: '$researchArea',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const latestPapers = await Paper.find().sort({ year: -1 }).limit(10).populate('facultyId');

    res.status(200).json({
      data: {
        totalPapers,
        papersByArea,
        latestPapers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
