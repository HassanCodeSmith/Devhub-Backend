import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, required: true },
    cover_image: {
      url: { type: String },
      alt: { type: String },
    }, // image schema --> name , size, file type
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Tutorial',
        'Best Practices',
        'Technology',
        'Career',
        'Project Showcase',
      ],
      required: true,
    }, // enum based on the categories
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 }, // views will be updated when the user reads the blog
    reading_time: { type: Number }, // avg time to read the blog
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    }, // handle the status enum based on the status --> 200words > api -> save.
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    liked_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    is_featured: { type: Boolean, default: false }, // optional for the featured blogs
    is_deleted: { type: Boolean, default: false }, // soft delete
    // code_snippets: [{
    //   language: String,
    //   code: String,
    //   description: String
    // }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.model('Blog', BlogSchema);
