import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  title: string;
  content: string;
  answer: string;
  analysis: string;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  difficulty: 'easy' | 'medium' | 'hard';
  usageCount: number;
  correctRate: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    analysis: {
      type: String,
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    usageCount: {
      type: Number,
      default: 0
    },
    correctRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// 创建索引
questionSchema.index({ title: 'text', content: 'text' });
questionSchema.index({ category: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ difficulty: 1 });

export const Question = mongoose.model<IQuestion>('Question', questionSchema); 