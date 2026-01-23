const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
