import jwt from 'jsonwebtoken';
require('dotenv').config();

/**
 * Verifica existencia de Token en Headers + Validación Signature
 *
 * @param  \JWT on Headers Request
 * @return False -> Error message or True -> Next function
 */
export const decodedToken = (req, res, next) => {

  const token = req.headers["x-access-token"];

  if(!token) return res.status(403).json({error: 403, message: "Access TOKEN not received."});

  const tokendata = jwt.decode(token);
  req.user_id = tokendata.id

  next();

};