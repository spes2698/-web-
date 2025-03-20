import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IThirdPartyAccount } from './third-party-account';

export interface IUser extends Document {
  phone: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'teacher' | 'student';
  permissions: string[];
  password?: string;
  thirdPartyAccounts?: IThirdPartyAccount[];
  profile: {
    realName?: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: Date;
    location?: string;
    bio?: string;
    education?: string;
    organization?: string;
  };
  stats: {
    answerCount: number;
    correctCount: number;
    totalTime: number;
    lastPracticeAt?: Date;
    favoriteQuestions: mongoose.Types.ObjectId[];
    wrongQuestions: mongoose.Types.ObjectId[];
  };
  preferences: {
    questionTypes: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    dailyGoal: number;
    emailNotification: boolean;
    pushNotification: boolean;
  };
  groups: mongoose.Types.ObjectId[];
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(permission: string): boolean;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true
    },
    nickname: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'teacher', 'student'],
      default: 'user'
    },
    permissions: [{
      type: String,
      enum: [
        'manage_users',
        'manage_questions',
        'manage_banks',
        'view_statistics',
        'export_data',
        'import_data',
        'create_practice',
        'view_answers'
      ]
    }],
    password: {
      type: String,
      required: false,
      select: false
    },
    profile: {
      realName: String,
      gender: {
        type: String,
        enum: ['male', 'female', 'other']
      },
      birthday: Date,
      location: String,
      bio: String,
      education: String,
      organization: String
    },
    stats: {
      answerCount: {
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
      lastPracticeAt: Date,
      favoriteQuestions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
      }],
      wrongQuestions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
      }]
    },
    preferences: {
      questionTypes: [String],
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
      },
      dailyGoal: {
        type: Number,
        default: 30
      },
      emailNotification: {
        type: Boolean,
        default: true
      },
      pushNotification: {
        type: Boolean,
        default: true
      }
    },
    groups: [{
      type: Schema.Types.ObjectId,
      ref: 'Group'
    }],
    lastLoginAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 虚拟字段：第三方账号
userSchema.virtual('thirdPartyAccounts', {
  ref: 'ThirdPartyAccount',
  localField: '_id',
  foreignField: 'userId'
});

// 密码加密中间件
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 密码比较方法
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password!);
  } catch (error) {
    return false;
  }
};

// 权限检查方法
userSchema.methods.hasPermission = function (permission: string): boolean {
  return this.permissions.includes(permission) || this.role === 'admin';
};

// 索引
userSchema.index({ phone: 1 }, { sparse: true });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ 'profile.realName': 1 });
userSchema.index({ groups: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model<IUser>('User', userSchema);
export { User }; 