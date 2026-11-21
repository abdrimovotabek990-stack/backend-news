import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.model.js';

const seedAdmin = async () => {
  try {
    const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI .env faylida topilmadi');
    }

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('ADMIN_NAME, ADMIN_EMAIL va ADMIN_PASSWORD .env faylida kiritilishi shart');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB ga ulandi');

    const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();
    const existingAdmin = await User.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      console.log(`Admin allaqachon mavjud: ${normalizedEmail}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'ADMIN',
    });

    console.log(`Admin muvaffaqiyatli yaratildi: ${normalizedEmail}`);
  } catch (error) {
    console.error('Admin yaratishda xatolik:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();