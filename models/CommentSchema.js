const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  is_accepted: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', CommentSchema);
