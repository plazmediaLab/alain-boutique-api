import slugify from 'slugify';
import Group from '../models/Group';

class GroupController {
  async store(req, res) {

    const { name, color } = req.body;

    try {

      const nameSlug = slugify(name, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        lower: true,      // convert to lower case, defaults to `false`
        strict: true,     // strip special characters except replacement, defaults to `false`
      })

      const newGroup = new Group({
        name: nameSlug,
        color,
        user_id: [req.user_id]
      })
  
      const groupSave = await newGroup.save();
  
      // Success response
      return res.status(200).json({ok: true, group: groupSave});
      
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async index(req, res) {
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
