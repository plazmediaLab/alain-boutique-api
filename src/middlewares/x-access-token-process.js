import jwt from 'jsonwebtoken';
import User from '../models/User';
require('dotenv').config();

/**
 * Verifica existencia de Token en Headers + Validación Signature
 *
 * @param  \JWT on Headers Request
 * @return False -> Error message or True -> Next function
 */
export const decodedToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(403).json({ ok: false, error: 403, message: 'Access TOKEN not received.' });

  jwt.verify(token, process.env.SECRET_WORD, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ ok: false, error: 401, mensaje: 'Token signature inválida.' });
    }

    const tokendata = decoded;

    req.user_id = tokendata.id;

    const user = await User.findById(req.user_id);
    if (!user)
      return res
        .status(404)
        .json({ ok: false, error: 404, mensaje: 'Invalid access - Information not found.' });

    next();
  });
};
