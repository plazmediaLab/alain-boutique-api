import User from '../models/User';
import jwt from 'jsonwebtoken';
import Role from '../models/Role';
require('dotenv').config();

class UserController {
  
  /**
   * 
   * Register user
   * 
   */
  async signup(req, res) {

    const { name, email, password, img, role } = req.body

    try {
      // Validate password character length
      if (password.length < 8) {
        return res.status(400).json({ error: 400, message: 'La CONTRASEÑA debe de tener al menos 8 caracteres' });
      }
      // New model instance
      const newUser = new User({
        name,
        email,
        password: await User.encryptPassword(password),
        parnerth: [],
        parnerth_key: User.HashParnerthKey({email, date: Date.now()}),
      });

      // Assign role reference
      if(role){
        const foundRole = await Role.findOne({ name: role });
        newUser.role = foundRole._id;
      }else{
        return res.status(400).json({ error: 400, message: 'El ROL de usuario es requerido.' });
      }

      // Save user
      const saveUser = await newUser.save();

      // Create token
      const token = jwt.sign({id: saveUser._id}, "nada", {
        expiresIn: '24h'
      });
  
      // Success response
      return res.status(200).json({ok: true, authorization: token, /*user: saveUser*/});
      
    } catch (error) {
      return res.status(400).json(error);
    }

  }

  /**
   * 
   * Log in
   * 
   */
  async login(req, res) {



    try {
      
      // Find user
      const userFound = await User.findOne({email: req.body.email}).populate('roles');
      // If the user does not exist
      if(!userFound) res.status(404).json({ok: false, status: 404, error: {email: 'No hay usuario registrado con ese email.'}});

      // Check that the password is valid
      const matchPass = await User.comparePassword(req.body.password, userFound.password);
      // If the password does not match
      if(!matchPass) res.status(401).json({ok: false, status: 401, error: {password: 'La contraseña es incorrecta.'}});

      // Create token
      const token = jwt.sign({id: userFound._id}, process.env.SECRET_WORD, {
        expiresIn: '24h'
      });

      return res.json({ok: true, authorization: token, /*user: "pending..."*/});

    } catch (error) {
      return res.status(400).json(error.message);
    }
  };

}

export default new UserController();
