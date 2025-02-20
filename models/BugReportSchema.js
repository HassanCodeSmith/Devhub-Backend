const mongoose = require('mongoose');

const BugReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: { type: String, default: 'Bug' },
  tags: [String],
  upvotes: { type: Number, default: 0 },
  is_resolved: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model('BugReport', BugReportSchema);
