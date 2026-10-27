// server/models/Material.js
import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['o-level', 'a-level'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      index: true,
    },
    materialType: {
      type: String,
      required: [true, 'Material type is required'],
      // enum: ['past-paper', 'marking-scheme', 'notes'],
      trim: true,
      index: true,
    },
    year: {
      type: Number,
      required: function() {
        return !(this.materialType === "notes")
      },
      min: [2000, 'Year must be between 2000 and current year'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
      default: 2026,
      index: true,
    },
    session: {
      type: String,
      required: [function () {
        return !(this.materialType === "notes")
      }, "Paper session is required"],
      enum: ["june", "november"]
    },
    topic: {
      type: String,
      trim: true,
      required: function() {
        return this.materialType === 'notes';
      },
      validate: {
        validator: function(v) {
          if (this.materialType === 'notes') {
            return v && v.length > 0 && v.length <= 200;
          }
          return true;
        },
        message: 'Topic is required for notes and must be under 200 characters'
      }
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true,
      validate: {
        validator: function(v) {
          // Validate Supabase storage URL
          return v.startsWith('https://') && v.includes('supabase.co');
        },
        message: 'Invalid file URL. Must be a valid Supabase storage URL'
      }
    },
    paper: {
      type: String
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
materialSchema.index({ level: 1, subject: 1, materialType: 1, year: -1 });
materialSchema.index({ createdAt: -1 });
materialSchema.index({ downloadCount: -1 });

// Virtual field for display name
materialSchema.virtual('displayName').get(function() {
  const typeMap = {
    'past-paper': 'Past Paper',
    'marking-scheme': 'Marking Scheme',
    'notes': 'Notes'
  };
  const levelMap = {
    'o-level': 'O Level',
    'a-level': 'A Level'
  };
  
  let name = `${this.subject} ${typeMap[this.materialType]}`;
  
  if (this.materialType === 'notes' && this.topic) {
    name += ` - ${this.topic}`;
  }
  
  name += ` (${levelMap[this.level]})`;
  name += ` ${this.year}`;
  
  return name;
});

// Virtual for formatted file size
materialSchema.virtual('formattedFileSize').get(function() {
  if (!this.fileSize) return '0 Bytes';
  const bytes = this.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
});

// Static method to get subjects by level
materialSchema.statics.getSubjectsByLevel = function(level) {
  return this.distinct('subject', { level });
};

// Static method to get years for a subject
materialSchema.statics.getYearsForSubject = function(level, subject) {
  return this.distinct('year', { level, subject }).sort({ year: -1 });
};

// Static method to get material types for a subject
materialSchema.statics.getMaterialTypesForSubject = function(level, subject) {
  return this.distinct('materialType', { level, subject });
};

// Instance method to increment download count
materialSchema.methods.incrementDownloadCount = async function() {
  this.downloadCount += 1;
  return this.save();
};



// Pre-save middleware to validate notes have topic
materialSchema.pre('save', async function() {
  if (this.materialType === 'notes' && !this.topic) {
    throw new Error('Topic is required for notes');
  }
});

// Create the model
const Material = mongoose.model('Material', materialSchema);

export default Material;