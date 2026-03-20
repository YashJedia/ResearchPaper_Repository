import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Faculty from './models/Faculty.js';
import Paper from './models/Paper.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Faculty.deleteMany({});
    await Paper.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Created admin user');

    // Create sample faculty
    const faculty1 = await Faculty.create({
      name: 'Dr. Sarah Johnson',
      designation: 'Professor',
      email: 'sarah.johnson@university.edu',
      researchArea: 'Machine Learning',
      bio: 'Dr. Johnson specializes in machine learning and artificial intelligence with over 15 years of experience in academic research.',
      photo: 'https://via.placeholder.com/300?text=Dr+Sarah+Johnson',
    });

    const faculty2 = await Faculty.create({
      name: 'Dr. Michael Chen',
      designation: 'Associate Professor',
      email: 'michael.chen@university.edu',
      researchArea: 'Data Science',
      bio: 'Dr. Chen focuses on big data analytics and statistical learning methods.',
      photo: 'https://via.placeholder.com/300?text=Dr+Michael+Chen',
    });

    const faculty3 = await Faculty.create({
      name: 'Dr. Emily Rodriguez',
      designation: 'Assistant Professor',
      email: 'emily.rodriguez@university.edu',
      researchArea: 'Cybersecurity',
      bio: 'Dr. Rodriguez researches network security and encryption algorithms.',
      photo: 'https://via.placeholder.com/300?text=Dr+Emily+Rodriguez',
    });

    console.log('Created sample faculty');

    // Create sample papers
    await Paper.create([
      {
        title: 'Deep Learning Architectures for Natural Language Processing',
        author: 'Johnson, S., et al.',
        year: 2023,
        journal: 'IEEE Transactions on Machine Learning',
        doi: '10.1109/2023.12345',
        link: 'https://example.com/paper1',
        abstract: 'This paper explores advanced deep learning architectures specifically designed for NLP tasks. We investigate transformer models and attention mechanisms...',
        researchArea: 'Machine Learning',
        facultyId: faculty1._id,
      },
      {
        title: 'Scalable Data Processing Pipeline for Real-time Analytics',
        author: 'Chen, M., Johnson, S.',
        year: 2023,
        journal: 'ACM Computing Surveys',
        doi: '10.1145/2023.54321',
        link: 'https://example.com/paper2',
        abstract: 'We present a distributed data processing pipeline that achieves real-time analytics on massive datasets...',
        researchArea: 'Data Science',
        facultyId: faculty2._id,
      },
      {
        title: 'Zero-Trust Security Architecture for Cloud Computing',
        author: 'Rodriguez, E., Chen, M.',
        year: 2022,
        journal: 'Journal of Cybersecurity',
        doi: '10.1016/2022.98765',
        link: 'https://example.com/paper3',
        abstract: 'This paper introduces a zero-trust security model for modern cloud infrastructures...',
        researchArea: 'Cybersecurity',
        facultyId: faculty3._id,
      },
      {
        title: 'Federated Learning: Privacy-Preserving Machine Learning',
        author: 'Johnson, S., Rodriguez, E.',
        year: 2023,
        journal: 'Nature Machine Intelligence',
        doi: '10.1038/2023.11111',
        link: 'https://example.com/paper4',
        abstract: 'Federated learning enables training machine learning models across distributed data sources while preserving privacy...',
        researchArea: 'Machine Learning',
        facultyId: faculty1._id,
      },
      {
        title: 'Anomaly Detection in High-Dimensional Data Using Isolation Forests',
        author: 'Chen, M., et al.',
        year: 2022,
        journal: 'Data Mining and Knowledge Discovery',
        doi: '10.1007/2022.22222',
        link: 'https://example.com/paper5',
        abstract: 'We propose an improved isolation forest algorithm for detecting anomalies in high-dimensional datasets...',
        researchArea: 'Data Science',
        facultyId: faculty2._id,
      },
    ]);

    console.log('Created sample papers');
    console.log('Database seeded successfully!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
