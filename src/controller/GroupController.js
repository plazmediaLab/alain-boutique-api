import Group from '../models/Group';
import slugifyProccess from '../helpers/slugifyProccess';

class GroupController {
  async store(req, res) {

    const { name, color } = req.body;

    try {

      const newGroup = new Group({
        name,
        color,
        user_id: [req.user_id]
      });
  
      // Validate unique group name per user
      const groups = await Group.find({ 'user_id': req.user_id });
      groups.map(x => {
        if(x.slug === slugifyProccess(newGroup.name)){
          throw {ok: false, error: 400, message: 'Ya existe un GRUPO creado con el mismo nombre.'};
        }
      });

      // Doc save
      const groupSave = await newGroup.save();
  
      // Success response
      return res.status(200).json({ok: true, group: groupSave});
      
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  async index(req, res) {

    try {
      
      const groups = await Group.find({ 'user_id': req.user_id }, ['-user_id'], {
        sort: {
          createdAt: -1
        }
      });

      // Success response
      return res.status(200).json({ok: true, groups});

    } catch (error) {
      return res.status(404).json(error);
    }

  };

  async show(req, res) {

    try {

      const group = await Group.findById(req.params.id);

      if(!group) throw {ok: false , error: 404, message: 'No se encontro el elemento'}; 

      // Success response
      return res.status(200).json({ok: true, group});
      
    } catch (error) {
      return res.status(404).json(error);
    }

  };

  async update(req, res) {

    if(req.body.name) req.body.slug = slugifyProccess(req.body.name);

    try {

      // Validate unique group name per user
      const groupsFound = await Group.find({ 'user_id': req.user_id });
      groupsFound.map(x => {
        if(x.slug === slugifyProccess(req.body.name)){
          throw {ok: false , error: 400, message: 'Ya existe un GRUPO creado con el mismo nombre.'};
        }
      });

      await Group.findByIdAndUpdate(req.params.id,req.body,{
        new: true
      }, (err, response) => {

        if(err) res.status(404).json({ok: false , error: 404, error: err});

        // Success response
        return res.status(200).json({ok: true, group: response});

      });

    } catch (error) {
      return res.status(404).json(error);
    }

  };

  async destroy(req, res) {

    try {

      const doc = await Group.findByIdAndDelete(req.params.id);
      
      if(!doc) throw {ok: false , error: 404, message: 'El elemento no existe o ya fue eliminado previamente.'};
  
      return res.status(200).json({ok: true, message: 'El elemento fue eliminado con éxito.'});

    } catch (error) {
      return res.status(404).json(error); 
    }
    
  };
}

export default new GroupController();
