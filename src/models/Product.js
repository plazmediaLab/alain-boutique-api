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
      min: [0, 'El VALOR no puede ser menor a cero.'],
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'El NOMBRE del producto es requerido.'],
      min: [0, 'El PRECIO no puede ser menor a cero.'],
      default: 0
    },
    user_id: [
      {
        ref: 'User',
        type: Schema.Types.ObjectId
      }
    ],
    description: {
      type: String
    },
    group: [
      {
        ref: 'Group',
        type: Schema.Types.ObjectId
      }
    ],
    sold_date: {
      type: Date,
      defauld: null
    },
    state: {
      type: String,
      defauld: 'STOCK',
      enum: ['STOCK', 'ACTIVE', 'SOLD']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// state === 'SOLD' ? Date(Date.now()) : null
ProductSchema.pre('validate', function (next) {
  if (this.state === 'SOLD') {
    this.sold_date = Date.now();
  } else if (this.state === 'STOCK' || this.state === 'ACTIVE') {
    this.sold_date = null;
  }
  next();
});

// Hidde Password
ProductSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  delete userObject.user_id;

  return userObject;
};

export default mongoose.model('Product', ProductSchema);
