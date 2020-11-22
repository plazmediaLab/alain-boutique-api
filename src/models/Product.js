import mongoose, { Schema } from 'mongoose';

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El NOMBRE del producto es requerido.']
    },
    value: {
      type: Number,
      required: [true, 'El VALOR del producto es requerido.'],
      min: [0, 'El VALOR no puede ser menor a cero.'],
      default: 0
    },
    value_off: {
      type: Number,
      min: [0, 'El DESCUENTO no puede ser menor a cero.'],
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'El PRECIO del producto es requerido.'],
      min: [0, 'El PRECIO no puede ser menor a cero.'],
      default: 0
    },
    profit: {
      type: Number,
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
    },
    status: {
      type: String,
      defauld: 'USED',
      enum: ['USED', 'NEW', 'PROMOTION']
    },
    off: {
      type: Number,
      defauld: 0,
      min: [0, 'El PORCENTAJE de descuento no puede ser menor a 0%']
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
  } else {
    this.sold_date = null;
  }
  if (this.off > 0) {
    const discount = Math.floor((this.value * this.off) / 100);
    this.value_off = this.value - discount;
    this.profit = this.value_off - this.price;
  } else {
    this.off = 0;
    this.profit = this.value - this.price;
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
