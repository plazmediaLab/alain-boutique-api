import Product from '../models/Product';

class ProductController {
  async store(req, res) {
    const {
      description,
      group,
      name,
      off,
      price,
      profit,
      state,
      status,
      value,
      value_off
    } = req.body;

    let responseErr = {};

    if (Number(price) > Number(value))
      responseErr = { ok: false, error: 400, message: 'El VALOR no puede ser menor al PRECIO.' };

    try {
      const newProduct = new Product({
        description,
        group,
        name,
        off,
        price,
        profit,
        state,
        status,
        user_id: [req.user_id],
        value,
        value_off
      });

      if (Object.keys(responseErr).length > 0) {
        return res.status(409).json(responseErr);
      } else {
        // Doc save
        const saveProduct = await newProduct.save();

        // Success response
        return res.status(200).json({ ok: true, product: saveProduct });
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async index(req, res) {
    try {
      const products = await Product.find({ user_id: req.user_id }, null, {
        sort: {
          createdAt: -1
        }
      }).populate({
        path: 'group',
        select: 'name color'
      });

      // Success response
      return res.status(200).json({ ok: true, products });
    } catch (error) {
      return res.status(404).json(error);
    }
  }

  async show(req, res) {
    const id = req.params.id;

    try {
      const product = await Product.findOne({ _id: id }).populate({
        path: 'group',
        select: 'name color'
      });

      if (!product) throw { ok: false, error: 404, message: 'No se encontro el elemento.' };

      // Success response
      return res.status(200).json({ ok: true, product });
    } catch (error) {
      return res.status(404).json(error);
    }
  }

  async update(req, res) {
    const id = req.params.id;
    const { state } = req.body;

    try {
      if (state === 'SOLD') {
        req.body.sold_date = Date(Date.now());
      } else if (state === 'ACTIVE' || state === 'STOCK') {
        req.body.sold_date = null;
      }

      const productFound = await Product.findById(id);
      if (!productFound)
        throw {
          ok: false,
          error: 404,
          message: 'El elemento no existe o ya fue eliminado previamente.'
        };

      await Product.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true
        },
        (err, response) => {
          if (err) res.status(404).json({ ok: false, error: 404, message: err });

          // Success response
          return res.status(200).json({ ok: true, group: response });
        }
      ).populate({
        path: 'group',
        select: 'name color'
      });
    } catch (error) {
      return res.status(404).json(error);
    }
  }

  async destroy(req, res) {
    try {
      const doc = await Product.findByIdAndDelete(req.params.id);

      if (!doc)
        throw {
          ok: false,
          error: 404,
          message: 'El elemento no existe o ya fue eliminado previamente.'
        };

      return res.status(200).json({ ok: true, message: 'El elemento fue eliminado con éxito.' });
    } catch (error) {
      return res.status(404).json(error);
    }
  }
}

export default new ProductController();
