import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/** __________ Mini schema for avatar __________ */
const AvatarSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Image URL
  name: { type: String, required: true }, // Image file name
  size: { type: Number, required: true }, // Image size in bytes
  fileType: { type: String, required: true }, // MIME type (e.g., 'image/png')
});

/** __________ Mini schema for number (including country code) __________ */
const NumberSchema = new mongoose.Schema({
  countryCode: { type: String, required: true }, // e.g., +92
  number: { type: String, required: true }, // User's phone number
});

/** __________ Mini schema for followers and following __________ */
const FollowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followedAt: { type: Date, default: Date.now },
});

/** __________ Badge schema __________ */
const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  awarded_at: { type: Date, default: Date.now },
});

/** __________ User schema __________ */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    avatar: { type: AvatarSchema, required: false },

    number: { type: NumberSchema, required: false },

    bio: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    github_username: {
      type: String,
    },

    github_id: {
      type: String,
    },

    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    }, // Will change with enums in the future enum based on the roles

    badges: [BadgeSchema],

    social_links: {
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      instagram: { type: String },
    },

    settings: {
      notification_preferences: { type: Map, of: Boolean },
      privacy_settings: {
        type: Map,
        of: Boolean,
        default: { profileVisible: true, emailVisible: false },
      },
    }, // Added privacy settings --> github profie

    interests: [
      {
        type: String,
      },
    ], // Array of user interests

    reputation: {
      type: Number,
      default: 0,
      min: 0,
    }, // User reputation according the the upvotes and badges and verified answers

    last_login: {
      type: Date,
    },

    is_active: {
      type: Boolean,
      default: true,
    }, // user server socket --> will be used to check if the user is online or not

    refresh_token: {
      type: String,
    },

    fcm_token: {
      type: String,
    }, // firebase notification base token

    followers: [{ type: FollowSchema }],

    following: [{ type: FollowSchema }],

    skills: [{ type: String }],

    is_deleted: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      expires: 300,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

/** __________ Hash Password __________ */
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    console.error('An error occurred while hashing password.\n', error);
    next(error);
  }
});

/** __________ Compare Password __________ */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('An error occurred while comparing password.', error);
    return false;
  }
};

/** __________ Generate JWT Token __________ */
UserSchema.methods.generateJWT = function () {
  try {
    return jwt.sign(
      {
        userId: this._id,
      },
      process.env.JWT_SECRET || 'QWERTY!@#$%^',
      { expiresIn: process.env.JWT_EXPIRY || '1h' }
    );
  } catch (error) {
    console.error('An error occurred while generating JWT token.', error);
    throw new Error('Failed to generate JWT token.');
  }
};

export default mongoose.model('User', UserSchema);
