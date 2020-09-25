import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validation'
import bcrypt from 'bcryptjs';
import hash from 'object-hash';

const validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const ParnerthSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El NOMBRE es requierido."],
      trim: [true, "EL NOMBRE no puede contener solamenete caracteres en blanco."]
    },
    email: {
      type: String,
      required: [true, "El EMAIL es requerido."],
      unique: '{PATH} tiene que ser único, ya existe otro registro con el mismo valor.',
      validate: [validateEmail, 'Introdusca un CORREO electrónico valido.'],
      trim: true
    },
    status: {
      type: Boolean,
      default: true
    },
    role: [{
      ref: "Role",
      type: Schema.Types.ObjectId,
      required: [true, "El ROLE es requerido."]
    }],
    parnerth_key: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Password encrypt & ParnerthKey
UserSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
UserSchema.statics.comparePassword = async (password, recivePassword) => {
  return await bcrypt.compare(password, recivePassword);
};
UserSchema.statics.HashParnerthKey = (data) => {
  let key = hash(data) 
  return key;
};

// Hidde Password
UserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  delete userObject.password;
  delete userObject.status;

  return userObject;
};

// Middlewares
ParnerthSchema.plugin(uniqueValidator);

export default mongoose.model('Parnerth', ParnerthSchema);
