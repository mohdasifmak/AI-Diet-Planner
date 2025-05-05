const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dietPlan: {
    breakfast: { type: String },
    lunch: { type: String },
    dinner: { type: String },
    snacks: { type: String } // optional
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diet', dietSchema);
