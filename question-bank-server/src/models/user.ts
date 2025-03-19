import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IThirdPartyAccount } from './third-party-account';

export interface IUser extends Document {
  phone: string;
  nickname?: string;
  avatar?: string;
  role: 'user' | 'admin';
  password?: string;
  thirdPartyAccounts?: IThirdPartyAccount[];
  answerCount: number;
  correctCount: number;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
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
      enum: ['user', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: false,
      select: false
    },
    answerCount: {
      type: Number,
      default: 0
    },
    correctCount: {
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

// 创建phone字段的索引，但不是唯一索引
userSchema.index({ phone: 1 }, { sparse: true });

const User = mongoose.model<IUser>('User', userSchema);
export { User }; 