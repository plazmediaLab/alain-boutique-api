import User from '../models/User';
import Group from '../models/Group';
import Product from '../models/Product';
import shortid from  'shortid';

class ParnerthController {

  // TODO · Crear Enpoint para agregar parnerth solamente a un grupo 09/27/2020 
  // TODO · Crear Enpoint para eliminar un parnerth globalmente  09/27/2020 

  async store(req, res) {

    const { parnerth_key, group } = req.body;
    let keyIsAdd = {};

    if(!shortid.isValid(parnerth_key)) keyIsAdd = { ok: false, error: 400, message: 'EL valor enviado no es valido.' };
    
    const parnerthUser = await User.findOne({parnerth_key: parnerth_key}, ['_id']);

    if(!parnerthUser) keyIsAdd = { ok: false, error: 404, message: 'El KEY enviado no fue encontrado.' };
    
    if(parnerthUser) await User.findById(req.user_id,['parnerth'], (err, resp) => {
      const { parnerth } = resp;

      if(parnerth.includes(parnerthUser._id)){
        keyIsAdd = { ok: false, error: 400, message: 'El KEY enviado ya esta agregado a tu lista.' };
      };
    });

    try {

      if(Object.keys(keyIsAdd).length === 0){

        User.updateOne({ _id: req.user_id }, { 
          // $push: { parnerth: [parnerth_key] } 
          parnerth: [parnerthUser._id]
        }, (err, res) => {
          if(err) console.log(err);
          console.log(res);
        });
  
        Group.updateOne({ _id: group }, { 
          // $push: { parnerth: [parnerth_key] } 
          parnerth: [parnerthUser._id]
        }, (err, res) => {
          if(err) console.log(err);
          console.log(res);
        });
      }

      if(Object.keys(keyIsAdd).length > 0){
        return res.status(400).json(keyIsAdd);
      }else{
        return res.json({ok: true, message: "Se elemento fue agregado correctamente."});
      }

    } catch (error) {
      return res.status(400).json(error);
    }

  }

  async index(req, res) {

    try {
      
      const user = await User.findById(req.user_id, ['parnerth_key']);

      let groups = null;

      if(user.parnerth_key === null){
        const gps = await Group.find({user_id: req.user_id}, ['name', 'color', 'parnerth'])
          .populate({ path: 'parnerth', select: 'name img -_id' })
          .sort({ 'createdAt': -1 });

        const newGps = gps.filter(a => a.parnerth.length > 0);

        groups = newGps;

      }else{
        groups = await Group.find({parnerth: {$all:[req.user_id]}}, ['name', 'color', 'user_id'])
          .populate({ path: 'user_id', select: 'name img' })
          .sort({ 'createdAt': -1 });
      };

      return res.json({ok: true, groups});

    } catch (error) {
      return res.status(400).json(error)
    }
  }

  async show(req, res) {

    const param = req.params.group_id;

    if(param.length !== 24) res.status(400).json({ ok: false, error: 400, message: 'El valor enviado como parámetro de búsqueda no es válido.' });

    /**
     * 
     * Validar si el usuario es parnerth y verificar que tenga acceso a la lista
     * 
     */
    // const user = await User.findById({ _id: req.user_id }, ['parnerth']);
    // console.log(user);

    try {

      const groupFound = await Group.findById(param, ['name', 'color', 'user_id', 'parnerth'])
        .populate({ path: 'user_id', select: 'name img -_id' })
        .populate({ path: 'parnerth', select: 'name img parnerth_key -_id' });

      if(!groupFound) throw { ok: false, error: 404, message: 'No se encontro el elemento.' };

      const productsFound = await Product.find({ group: param }, [
        'name',
        'price',
        'value',
        'state',
        'description',
        'sold_date',
        'createdAt'
      ]).sort({ 'createdAt': -1 });

      const response = {
        group: groupFound,
        products: productsFound
      }

      return res.json({ok: true, response});

    } catch (error) {
      return res.status(400).json(error)
    }
  }

  async destroy(req, res) {

    const param = req.params.group_id;
    const key = req.params.key;

    if(param.length !== 24) res.status(400).json({ ok: false, error: 400, message: 'El valor enviado como parámetro de búsqueda no es válido.' });

    try {

      const id = await User.findOne({parnerth_key: key},['_id']);

      if(!id) throw { ok: false, error: 404, message: 'No se encontro el elemento.' };

      let idToSearch = id._id;

      /**
       * 
       *  Eliminar de Grupo
       * 
       */ 
      const parnerths = await Group.findOne({ _id: param }, ['parnerth']);
      const { parnerth, _id } = parnerths;

      if(!parnerth.includes(idToSearch)) throw { ok: false, error: 404, message: 'El KEY no es valido en este grupo.' };;

      // Eliminar ID del parnerth del Array del Grupo 
      for(var i = parnerth.length - 1; i >= 0; i--) {
        if(toString(parnerth[i]) === toString(idToSearch)){
          parnerth.splice(i, 1);
        }
      };

      // Actualizar propiedad parnerth
      await Group.updateOne({ _id }, { parnerth });

      return res.json({ ok: true, message: 'El elemento fue removido de tu lista con éxito.' });

    } catch (error) {
      return res.status(400).json(error)
    }
  }
}

export default new ParnerthController();
