import Group from '../models/Group';
import Product from '../models/Product';
import slugifyProccess from '../helpers/slugifyProccess';

class GroupController {
  async store(req, res) {
    const { name, color } = req.body;

    let responseErr = {};

    // Validar que el Grupo no exista ya dentro de los registros del usuario
    const alreadyExist = await Group.find({ user_id: req.user_id, slug: slugifyProccess(name) });
    if (alreadyExist.length > 0)
      responseErr = {
        ok: false,
        error: 409,
        message: 'Ya existe un grupo creado con el mismo nombre.'
      };

    try {
      const newGroup = new Group({
        name,
        color,
        user_id: [req.user_id]
      });

      if (Object.keys(responseErr).length > 0) {
        return res.status(409).json(responseErr);
      } else {
        // Doc save
        const groupSave = await newGroup.save();

        // Success response
        return res.status(200).json({ ok: true, group: groupSave });
      }
    } catch (error) {
      return res.status(400).json({ ok: false, error });
    }
  }

  async index(req, res) {
    try {
      const groups = await Group.find({ user_id: req.user_id }, ['-user_id'], {
        sort: {
          createdAt: -1
        }
      }).populate({ path: 'parnerth', select: 'name img parnerth_key -_id' });

      // Success response
      return res.status(200).json({ ok: true, groups });
    } catch (error) {
      return res.status(404).json(error);
    }
  }

  async show(req, res) {
    try {
      const group = await Group.findById(req.params.id, ['-user_id']).populate({
        path: 'parnerth',
        select: 'name img parnerth_key -_id',
        sort: { name: -1 }
      });

      if (!group) throw { ok: false, error: 404, message: 'No se encontro el elemento' };

      const products = await Product.find({ group: req.params.id }, ['-group', '-updatedAt']);

      const response = {
        group,
        products
      };

      // Success response
      return res.status(200).json({ ok: true, response });
    } catch (error) {
      return res.status(404).json(error);
    }
  }

  async update(req, res) {
    if (req.body.name) req.body.slug = slugifyProccess(req.body.name);

    try {
      // Validar que el Grupo no exista ya dentro de los registros del usuario
      const alreadyExist = await Group.find({ user_id: req.user_id, slug: req.body.slug });
      if (alreadyExist.length > 0)
        throw { ok: false, error: 409, message: 'Ya existe un grupo creado con el mismo nombre.' };

      await Group.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          select: '-user_id'
        },
        (err, response) => {
          if (err) throw { ok: false, error: 404, message: err };

          // Success response
          return res.status(200).json({ ok: true, group: response });
        }
      );
    } catch (error) {
      return res.status(404).json(error);
    }
  }

  async destroy(req, res) {
    try {
      const doc = await Group.findByIdAndDelete(req.params.id);

      if (!doc)
        throw {
          ok: false,
          error: 404,
          message: 'El elemento no existe o ya fue eliminado previamente.'
        };

      const productDeleted = await Product.deleteMany({ group: req.params.id });

      const response = {
        destroy: productDeleted
      };

      return res.status(200).json({
        ok: true,
        message: 'El Grupo y sus Productos fuerón eliminado con éxito.',
        response
      });
    } catch (error) {
      return res.status(404).json(error);
    }
  }
}

export default new GroupController();
