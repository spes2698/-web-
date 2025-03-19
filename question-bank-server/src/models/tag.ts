import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, '标签名称不能为空'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// 创建索引
tagSchema.index({ name: 1 });

const Tag = mongoose.model<ITag>('Tag', tagSchema);
export { Tag }; 