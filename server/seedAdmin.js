
// seedAdmin.js
// This is a one-time script to create an admin user in the database.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./api/models/userModel');

// Your MongoDB connection string (ensure this is correct)
const dbURI = 'mongodb+srv://QuynNyn:1234@thecodex.lvejko1.mongodb.net/?retryWrites=true&w=majority&appName=TheCodex';

const addAdmin = async () => {
  try {
    console.log('Connecting to the database...');
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database connection successful.');

    // --- Admin User Details ---
    const adminUsername = 'admin';
    const adminPassword = 'password';

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    console.log('Creating admin user...');
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create the new admin user
    const adminUser = new User({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin'
    });

    // Save the user to the database
    await adminUser.save();

    console.log('--------------------------------------------------');
    console.log('Admin user created successfully!');
    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Ensure the database connection is closed
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

// Run the function
addAdmin();
