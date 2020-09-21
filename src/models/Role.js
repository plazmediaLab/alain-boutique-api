import mongoose from 'mongoose';

const RoleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
  },
  {
    versionKey: false
  }
);

export default mongoose.model('Role', RoleSchema); 
