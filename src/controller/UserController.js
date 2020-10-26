import User from '../models/User';
import jwt from 'jsonwebtoken';

class UserController {
  /**
   *
   * Register user
   *
   */
  async signup(req, res) {
    const { name, email, password, img, role } = req.body;

    try {
      // Validate password character length
      if (password.length < 8) {
        throw {
          ok: false,
          error: 400,
          message: 'La CONTRASEÑA debe de tener al menos 8 caracteres'
        };
      }

      // New model instance
      const newUser = new User({
        name,
        email,
        img,
        role,
        password: await User.encryptPassword(password),
        parnerth: [],
        parnerth_key: role === 'PARNERTH_ROLE' ? User.HashParnerthKey() : null
      });

      // Save user
      await newUser.save();

      // Success response
      return res.status(200).json({
        ok: true,
        user: 'User created successfully'
      });
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
      const userFound = await User.findOne({ email: req.body.email });

      // If the user does not exist
      if (!userFound)
        throw {
          ok: false,
          error: 404,
          message: 'No hay usuario registrado con ese correo electrónico.'
        };

      // Check that the password is valid
      const matchPass = await User.comparePassword(req.body.password, userFound.password);
      // If the password does not match
      console.log(matchPass);
      if (!matchPass)
        throw { ok: false, error: 401, message: 'El correo o la contraseña son incorrectos.' };

      // Create token
      const token = jwt.sign({ id: userFound._id }, process.env.SECRET_WORD, {
        expiresIn: '2h'
      });

      return res.json({ ok: true, authorization: token, user: userFound });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  /**
   *
   * Auth
   *
   */
  async auth(req, res, next) {
    const token = req.headers['x_access_token'];

    if (!token) return res.status(401).json(null);

    jwt.verify(token, process.env.SECRET_WORD, async (err, decoded) => {
      if (err) {
        return res.status(401).json(null);
      }

      // decoded.id;

      await User.findById(decoded.id, (err, data) => {
        err && res.status(404).json(null);
        return res.status(200).json({ ok: true, data });
      });

      next();
    });
  }
}

export default new UserController();
