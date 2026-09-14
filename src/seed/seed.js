require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const seed = async () => {
  await connectDB();
  await User.deleteMany({ email: { $in: [
    'admin@counsellease.com',
    'counsellor@counsellease.com',
    'student@counsellease.com',
  ] } });

  await User.create([
    { name: 'System Admin', email: 'admin@counsellease.com', password: 'admin123', role: 'admin' },
    { name: 'Dr. Aisha Bello', email: 'counsellor@counsellease.com', password: 'counsellor123', role: 'counsellor', specialty: 'Academic Counselling' },
    { name: 'Fatima Lawal', email: 'student@counsellease.com', password: 'student123', role: 'student', department: 'Computer Science' },
  ]);

  console.log('Seeded default users:');
  console.log('  admin@counsellease.com / admin123');
  console.log('  counsellor@counsellease.com / counsellor123');
  console.log('  student@counsellease.com / student123');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
