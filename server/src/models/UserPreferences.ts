import { Schema, model } from 'mongoose';

const userPreferencesSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  theme: {
    type: String,
    default: 'light'
  },
  notifications: {
    type: Object,
    default: {
      email: false,
      push: false,
      sms: false
    }
  },
  language: {
    type: String,
    default: 'en'
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  chartSettings: {
    type: Object,
    default: {
      indicators: [],
      colors: {
        background: '#ffffff',
        grid: '#e0e0e0',
        text: '#000000'
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userPreferencesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const UserPreferences = model('UserPreferences', userPreferencesSchema);
