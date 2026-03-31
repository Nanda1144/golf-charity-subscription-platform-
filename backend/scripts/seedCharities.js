const mongoose = require('mongoose');
const Charity = require('../models/Charity');
require('dotenv').config();

const charities = [
  {
    name: "Green Fairways Hope",
    description: "Providing environmental restoration for local communities through sustainable landscaping.",
    logo: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=200&h=200&auto=format&fit=crop",
    category: "Environment"
  },
  {
    name: "Heart of the Score",
    description: "Supporting cardiovascular health research and providing equipment to rural clinics.",
    logo: "https://images.unsplash.com/photo-1505751172107-573957a243b0?q=80&w=200&h=200&auto=format&fit=crop",
    category: "Health"
  },
  {
    name: "Tee Time Education",
    description: "Building primary schools and providing supplies to underserved global regions.",
    logo: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=200&h=200&auto=format&fit=crop",
    category: "Education"
  },
  {
    name: "Wild Game Rescue",
    description: "Protecting endangered wildlife and restoring natural habitats for future generations.",
    logo: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=200&h=200&auto=format&fit=crop",
    category: "Animal Welfare"
  },
  {
    name: "Fair Match Justice",
    description: "Advocating for equal opportunities and providing legal support to marginalized communities.",
    logo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=200&h=200&auto=format&fit=crop",
    category: "Social Justice"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");
    
    // Clear existing charities to reset to default 5 as requested
    await Charity.deleteMany({});
    console.log("Cleared existing charities.");

    await Charity.insertMany(charities);
    console.log("Seeded 5 default impact partners successfully.");
    
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
