// UserTheme.js
const mongoose = require('mongoose');

const UserThemeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  darkMode: { type: Boolean, default: false },
  bgColors: {
    light1: { type: String, default: '#ff4d6d33' },
    light2: { type: String, default: '#00f5d433' },
    gradientColor1: { type: String, default: '#ff4d6d' },
    gradientColor2: { type: String, default: '#00f5d4' }
  }
}, { timestamps: true });

module.exports = mongoose.model('UserTheme', UserThemeSchema);
