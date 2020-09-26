import User from '../models/User';
import Group from '../models/Group';

class ParnerthController {
  async store(req, res, next) {

    const { parnerth_key, group } = req.body;
    let keyIsAdd = {};
    
    await User.findById(req.user_id,['parnerth'], (err, resp) => {
      const { parnerth } = resp;
      parnerth.map(x => {
        if(x === parnerth_key) keyIsAdd = { ok: false, error: 400, message: 'El KEY enviado ya esta agregado a tu lista.' };
      });
    });

    try {

      if(Object.keys(keyIsAdd).length === 0){
        User.updateOne({ _id: req.user_id }, { 
          $push: { parnerth: [parnerth_key] } 
        }, (err, res) => {
          if(err) console.log(err);
          console.log(res);
        });
  
        Group.updateOne({ _id: group }, { 
          $push: { parnerth: [parnerth_key] } 
        }, (err, res) => {
          if(err) console.log(err);
          console.log(res);
        });
      }

      if(Object.keys(keyIsAdd).length > 0){
        return res.json(keyIsAdd);
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

      let parnerthList = null;
      let groups = null;

      console.log(user.parnerth_key);

      if(user.parnerth_key === null){
        const doc = await User.findById({_id: req.user_id}, ['parnerth']);
        const gps = await Group.find({user_id: req.user_id}, ['name', 'color', 'parnerth']);

        const newGps = gps.filter(a => a.parnerth.length > 0);

        groups = newGps;

      }else{
        groups = await Group.find({parnerth: {$all:[user.parnerth_key]}}, ['name', 'color']);
      };

      return res.json({ok: true, groups});

    } catch (error) {
      return
    }
  }

  async show(req, res) {

    const key = req.params.key;

    return res.json(`Show Connect: ${key}`);
  }

  async update(req, res) {

    const key = req.params.key;

    return res.json(`Update Connect: ${key}`);
  }

  async destroy(req, res) {

    const key = req.params.key;

    return res.json(`Destroy Connect: ${key}`);
  }
}

export default new ParnerthController();
