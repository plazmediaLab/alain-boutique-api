import Group from '../models/Group';
import User from '../models/User';
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
  
      const groups = await Group.find({ 'user_id': req.user_id });
      // groups.map(x => x.name === slugifyProccess(newGroup.name) ? res.status(400).json({ok: false , message: 'Ya existe creado un NOMBRE de grupo igual.'}) : true);
      groups.map(x => {
        if(x.name === slugifyProccess(newGroup.name)){
          return res.status(400).json({ok: false , message: 'Ya existe un GRUPO creado con el mismo nombre.'});
        }
      });

      // Doc save
      const groupSave = await newGroup.save();
  
      // Success response
      return res.status(200).json({ok: true, group: groupSave});
      
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async index(req, res) {

    try {
      
      const groups = await Group.find({ 'user_id': req.user_id });

      // Success response
      return res.status(200).json({ok: true, group: groups});

    } catch (error) {
      return res.status(400).json(error);
    }

    return res.json('Get groups...');
  }

  async show(req, res) {

    const ID = req.params.id;

    return res.json(`Get group for ID: ${ID}`);
  }

  async update(req, res) {

    const ID = req.params.id;

    return res.json(`Update group: ${ID}`);
  }

  async destroy(req, res) {

    const ID = req.params.id;

    return res.json(`Delete group: ${ID}`);
  }
}

export default new GroupController();
