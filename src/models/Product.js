import mongoose, { Schema } from 'mongoose';

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El NOMBRE del producto es requerido.']
    },
    value: {
      type: Number,
      required: [true, 'El NOMBRE del producto es requerido.'],
      min: [0, 'El VALOR no puede ser menor a cero.']
    },
    price: {
      type: Number,
      required: [true, 'El NOMBRE del producto es requerido.'],
      min: [0, 'El PRECIO no puede ser menor a cero.']
    },
    user_id: [{
      ref: 'User',
      type: Schema.Types.ObjectId
    }],
    description: {
      type: String,
    },
    group: [{
      ref: 'Group',
      type: Schema.Types.ObjectId
    }],
    sold_date: {
      type: Date,
      defauld: null
    },
    state: {
      type: String,
      defauld: 'STOCK',
      enum: ['STOCK', 'ACTIVE', 'SOLD']
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('Product', ProductSchema);
