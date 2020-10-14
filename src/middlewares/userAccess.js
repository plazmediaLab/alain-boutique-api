import User from '../models/User';

/**
 * Verifica existencia de Token en Headers + Validación Signature
 *
 * @param  \JWT on Headers Request
 * @return False -> Error message or True -> Next function
 */
export const userAccess = async (req, res, next) => {
  const id = req.user_id;

  await User.findById(id, (err, doc) => {
    if (err) res.status(400).json({ ok: false, error: 400, mensaje: err });

    const message = 'Se requiere ROL de USUARIO para acceder a esta funcionalidad.';

    if (doc.role === 'PARNERTH_ROLE')
      return res.status(401).json({ ok: false, error: 401, message });

    next();
  });
};
