import mongoose, { Document, Schema } from 'mongoose';

export interface IThirdPartyAccount extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'wechat' | 'qq';
  openId: string;
  nickname?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const thirdPartyAccountSchema = new Schema<IThirdPartyAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: {
      type: String,
      enum: ['wechat', 'qq'],
      required: true,
    },
    openId: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 创建复合唯一索引
thirdPartyAccountSchema.index({ platform: 1, openId: 1 }, { unique: true });

const ThirdPartyAccount = mongoose.model<IThirdPartyAccount>('ThirdPartyAccount', thirdPartyAccountSchema);
export { ThirdPartyAccount }; 