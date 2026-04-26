import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    authors: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    journal: {
      type: String,
      required: true,
      trim: true,
    },
    doi: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
    },
    abstract: {
      type: String,
      trim: true,
    },
    researchArea: {
      type: String,
      trim: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Paper', paperSchema);
