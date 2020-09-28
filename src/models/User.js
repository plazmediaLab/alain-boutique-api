import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validation'
import bcrypt from 'bcryptjs';
import shortid from  'shortid';

const validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const UserSchema = mongoose.Schema(
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
    password: {
      type: String,
      required: [true, 'La CONTRASEÑA es requerida.'],
    },
    img: {
      type: String,
      default: null
    },
    status: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      required: [true, "El ROLE es requerido."],
      default: 'USER_ROLE',
      enum: ['USER_ROLE', 'PARNERTH_ROLE']
    },
    parnerth: [{
      ref: 'User',
      type: Schema.Types.ObjectId
    }],
    parnerth_key: {
      type: String
    }
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
  let key = shortid.generate(); 
  return key;
};

// Hidde Password
UserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  delete userObject.password;
  delete userObject.status;
  delete userObject._id;

  return userObject;
};

// Middlewares
UserSchema.plugin(uniqueValidator);

export default mongoose.model('User', UserSchema);
