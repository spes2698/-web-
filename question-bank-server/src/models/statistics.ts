import mongoose, { Document, Schema } from 'mongoose';

export interface IUserStatistics extends Document {
  userId: mongoose.Types.ObjectId;
  daily: {
    date: Date;
    practiceCount: number;
    questionCount: number;
    correctCount: number;
    totalTime: number;
    completedGoal: boolean;
  }[];
  weekly: {
    weekStart: Date;
    practiceCount: number;
    questionCount: number;
    correctCount: number;
    totalTime: number;
    averageScore: number;
    streakDays: number;
  }[];
  monthly: {
    monthStart: Date;
    practiceCount: number;
    questionCount: number;
    correctCount: number;
    totalTime: number;
    averageScore: number;
    improvement: number;
  }[];
  categories: {
    categoryId: mongoose.Types.ObjectId;
    questionCount: number;
    correctCount: number;
    averageScore: number;
    lastPracticed: Date;
  }[];
  questionTypes: {
    type: string;
    count: number;
    correctCount: number;
    averageTime: number;
  }[];
  progress: {
    totalQuestions: number;
    completedQuestions: number;
    masteredQuestions: number;
    weakQuestions: number;
    averageAccuracy: number;
    estimatedLevel: string;
  };
  recommendations: {
    questionIds: mongoose.Types.ObjectId[];
    categoryIds: mongoose.Types.ObjectId[];
    difficulty: 'easy' | 'medium' | 'hard';
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userStatisticsSchema = new Schema<IUserStatistics>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    daily: [{
      date: {
        type: Date,
        required: true
      },
      practiceCount: {
        type: Number,
        default: 0
      },
      questionCount: {
        type: Number,
        default: 0
      },
      correctCount: {
        type: Number,
        default: 0
      },
      totalTime: {
        type: Number,
        default: 0
      },
      completedGoal: {
        type: Boolean,
        default: false
      }
    }],
    weekly: [{
      weekStart: {
        type: Date,
        required: true
      },
      practiceCount: {
        type: Number,
        default: 0
      },
      questionCount: {
        type: Number,
        default: 0
      },
      correctCount: {
        type: Number,
        default: 0
      },
      totalTime: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      streakDays: {
        type: Number,
        default: 0
      }
    }],
    monthly: [{
      monthStart: {
        type: Date,
        required: true
      },
      practiceCount: {
        type: Number,
        default: 0
      },
      questionCount: {
        type: Number,
        default: 0
      },
      correctCount: {
        type: Number,
        default: 0
      },
      totalTime: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      improvement: {
        type: Number,
        default: 0
      }
    }],
    categories: [{
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      },
      questionCount: {
        type: Number,
        default: 0
      },
      correctCount: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      lastPracticed: Date
    }],
    questionTypes: [{
      type: String,
      count: {
        type: Number,
        default: 0
      },
      correctCount: {
        type: Number,
        default: 0
      },
      averageTime: {
        type: Number,
        default: 0
      }
    }],
    progress: {
      totalQuestions: {
        type: Number,
        default: 0
      },
      completedQuestions: {
        type: Number,
        default: 0
      },
      masteredQuestions: {
        type: Number,
        default: 0
      },
      weakQuestions: {
        type: Number,
        default: 0
      },
      averageAccuracy: {
        type: Number,
        default: 0
      },
      estimatedLevel: {
        type: String,
        default: 'beginner'
      }
    },
    recommendations: {
      questionIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
      }],
      categoryIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
      }],
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  {
    timestamps: true
  }
);

// 索引
userStatisticsSchema.index({ userId: 1 });
userStatisticsSchema.index({ 'daily.date': 1 });
userStatisticsSchema.index({ 'weekly.weekStart': 1 });
userStatisticsSchema.index({ 'monthly.monthStart': 1 });
userStatisticsSchema.index({ 'categories.categoryId': 1 });

// 更新推荐的中间件
userStatisticsSchema.pre('save', async function(next) {
  if (this.isModified('progress') || this.isModified('categories')) {
    this.recommendations.updatedAt = new Date();
  }
  next();
});

const UserStatistics = mongoose.model<IUserStatistics>('UserStatistics', userStatisticsSchema);
export { UserStatistics }; 