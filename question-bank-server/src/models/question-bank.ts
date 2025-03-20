import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionBank extends Document {
  name: string;
  description: string;
  cover?: string;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  questions: mongoose.Types.ObjectId[];
  visibility: 'private' | 'public' | 'shared';
  sharedWith: {
    users: mongoose.Types.ObjectId[];
    groups: mongoose.Types.ObjectId[];
  };
  stats: {
    questionCount: number;
    practiceCount: number;
    averageScore: number;
    lastUpdated: Date;
  };
  metadata: {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number;
    recommendedLevel: string;
    prerequisites: string[];
  };
  settings: {
    shuffleQuestions: boolean;
    showAnswers: boolean;
    timeLimit?: number;
    passScore: number;
    allowReview: boolean;
    allowRetry: boolean;
  };
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionBankSchema = new Schema<IQuestionBank>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    cover: {
      type: String,
      trim: true
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
    questions: [{
      type: Schema.Types.ObjectId,
      ref: 'Question'
    }],
    visibility: {
      type: String,
      enum: ['private', 'public', 'shared'],
      default: 'private'
    },
    sharedWith: {
      users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }],
      groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
      }]
    },
    stats: {
      questionCount: {
        type: Number,
        default: 0
      },
      practiceCount: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    metadata: {
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
      },
      estimatedTime: {
        type: Number,
        default: 0
      },
      recommendedLevel: String,
      prerequisites: [String]
    },
    settings: {
      shuffleQuestions: {
        type: Boolean,
        default: true
      },
      showAnswers: {
        type: Boolean,
        default: true
      },
      timeLimit: Number,
      passScore: {
        type: Number,
        default: 60
      },
      allowReview: {
        type: Boolean,
        default: true
      },
      allowRetry: {
        type: Boolean,
        default: true
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 索引
questionBankSchema.index({ name: 'text', description: 'text' });
questionBankSchema.index({ category: 1 });
questionBankSchema.index({ tags: 1 });
questionBankSchema.index({ visibility: 1 });
questionBankSchema.index({ createdBy: 1 });
questionBankSchema.index({ 'metadata.difficulty': 1 });

// 更新统计信息的中间件
questionBankSchema.pre('save', async function(next) {
  if (this.isModified('questions')) {
    this.stats.questionCount = this.questions.length;
    this.stats.lastUpdated = new Date();
  }
  next();
});

const QuestionBank = mongoose.model<IQuestionBank>('QuestionBank', questionBankSchema);
export { QuestionBank }; 