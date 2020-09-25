import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validation';
import slugifyProccess from '../helpers/slugifyProccess';

const GroupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El NOMBRE del grupo es requerido.'],
      trim: true,
    },
    slug: {
      type: String,
    },
    color: {
      type: String,
    },
    user_id: [{
      ref: "User",
      type: Schema.Types.ObjectId
    }],
    parnerth: {
      type: [String]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Middlewares
GroupSchema.plugin(uniqueValidator);

// Hidde fields
GroupSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  delete userObject.user_id;

  return userObject;
};
// Middlewares methods
/**
 * validate
 * save
 * remove
 * updateOne
 * deleteOne
 * init => sync
 */
GroupSchema.pre('validate', function(next){
  this.slug = slugifyProccess(this.name)
  next();
});

export default mongoose.model('Group', GroupSchema);
