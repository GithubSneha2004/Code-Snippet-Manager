const { Schema, model, Types } = require('mongoose'); // 👈 include `model`

const SnippetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shared: {
      isShared:{
        type: Boolean,
        default: false,
      },
      code:{
        type:String,
        unique: true,
        sparse: true,
        default: null,  
      },
      createdAt:{
        type: Date,
        default: null,
      },
      codeExpiresAt: { type: Date, default: null }, 
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Optional: formatted date virtual
SnippetSchema.virtual('createdAtFormatted').get(function () {
  return this.createdAt.toISOString();
});

// ✅ Export the *model* (not just the schema)
module.exports = model('Snippet', SnippetSchema);
