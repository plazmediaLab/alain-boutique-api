/**
 * Verifica existencia de Token en Headers + Validación Signature
 *
 * @param  \JWT on Headers Request
 * @return False -> Error message or True -> Next function
 */
export const IDLengthVerify = (req, res, next) => {

  const id = req.params.id;

  if(id.length !== 24) res.status(400).json({ ok: false, error: 400, message: 'El valor enviado como parámetro de búsqueda no es válido.' });

  next();

};