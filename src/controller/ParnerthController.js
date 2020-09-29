import User from '../models/User';
import Group from '../models/Group';
import Product from '../models/Product';
import shortid from  'shortid';

class ParnerthController {


  // ✓ DONE · Agregar un Parnerth global [Usuario + Grupo] & [Grupo] 09/27/2020 

  // ✓ DONE · Mostrar grupos con Parnerth 09/27/2020 
  // ✓ DONE · Mostrar un grupo con Parnerth 09/27/2020 

  // TODO · Eliminar un Parnerth globalmente 09/27/2020 
  // TODO · Eliminar un Parnerth de un Grupo 09/27/2020 

  async store(req, res) {

    const { key, group } = req.body;
    
    let keyIsAdd = {};
    
    try {
      
      // Obtener ID del parnerth
      const parnerthUser = await User.findOne({ parnerth_key: key }, ['_id']);
      if(!parnerthUser) keyIsAdd= { ok: false, error: 404, message: 'El KEY no devuelve resultados.' };
      
      // Obtener el Grupo al que se le agregara el parnerth
      const groupFound = await Group.findOneAndUpdate({ _id: group }, { parnerth: [parnerthUser._id] }, { new: true, select: 'name parnerth' })
        .populate({ path: 'parnerth', select: 'name img -_id' });
      if(!groupFound) keyIsAdd= { ok: false, error: 404, message: 'El GRUPO no devuelve resultados.' };

      // Actualizar Usuario con el nuevo Parnerth
      const userOnTurn = await User.findOneAndUpdate({ _id: req.user_id }, { parnerth: [parnerthUser._id] }, { new: true, select: 'name parnerth' })
        .populate({ path: 'parnerth', select: 'name img -_id' });

      const dataUpdate = {
        group: groupFound,
        user: userOnTurn
      }

      if(Object.keys(keyIsAdd).length > 0){
        return res.status(400).json(keyIsAdd);
      }else{
        return res.json({ok: true, message: "Se elemento fue agregado correctamente.", dataUpdate});
      }

    } catch (error) {
      return res.status(400).json(error);
    }

  };

  async index(req, res) {

    try {
      
      // Obtener el usuario en turno para validar si es USUARIO o PARNERTH
      const userOnTurn = await User.findById(req.user_id, ['parnerth_key']);

      let groups = null;

      // Validar si el Usuario en turno tiene un ['parnerth_key] o no
      // Si es NUll es Usuario
      // Si es EXISTE es Parnerth
      if(userOnTurn.parnerth_key === null){

        groups = await Group.find({user_id: req.user_id, parnerth: {$exists: true, $not: {$size: 0}}}, ['name', 'color', 'parnerth', 'createdAt'])
          .populate({ path: 'parnerth', select: 'name img -_id' })
          .sort({ 'createdAt': -1 });

      }else{
        groups = await Group.find({parnerth: {$all:[req.user_id]}}, ['name', 'color', 'user_id'])
          .populate({ path: 'user_id', select: 'name img -_id' })
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

    let group;

    try {

      // Obtener el usuario en turno para validar si es USUARIO o PARNERTH
      const userOnTurn = await User.findById(req.user_id, ['parnerth_key']);

      // Validar si el Usuario en turno tiene un ['parnerth_key] o no
      // Si es NUll es Usuario
      // Si es EXISTE es Parnerth
      if(userOnTurn.parnerth_key === null){
        console.log('Usre');
        const groupFound = await Group.findById( param );
        if(!groupFound) throw { ok: false, error: 401, message: 'No se encontro el elemento.' };
        
        group = groupFound;
        
      }else{

        // Obtener el producto y validar en el query si el ID del parnerth existe dentro de la propiedad pàra darle acceso a la información
        const groupFound = await Group.findOne({ _id: param, parnerth: { $in: [req.user_id] } }, ['name', 'color', 'parnerth', 'createdAt'])
          .populate({ path: 'parnerth', select: 'name img -_id' });

        if(!groupFound) throw { ok: false, error: 401, message: 'No tienes acceso para ver esta información.' };

        group = groupFound;
        
      };

      // Obtener productos relacionados con el Grupo consultado
      const productsFound = await Product.find({ group: param }, [
        '-group',
        '-updatedAt',
        '-user_id'
      ]).sort({ 'createdAt': -1 });

      const response = {
        group,
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
