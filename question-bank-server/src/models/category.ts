import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, '分类名称不能为空'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      trim: true
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  },
  {
    timestamps: true
  }
);

// 创建索引
categorySchema.index({ name: 1 });
categorySchema.index({ parent: 1 });

const Category = mongoose.model<ICategory>('Category', categorySchema);
export { Category }; 