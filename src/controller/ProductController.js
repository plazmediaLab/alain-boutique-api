import Product from '../models/Product';

class ProductController {
  async store(req, res) {

    const { name, value, price, description, state } = req.body;

    if(price > value) res.status(400).json({ ok: false, error: 400, message: 'El VALOR no puede ser menor al PRECIO.' });

    try {

      const newProduct = new Product({
        name,
        value,
        price,
        description,
        state,
        sold_date: null,
        user_id: [req.user_id],
        group: ['5f6be308d7037e3f20bb7e3b']
      });

      const saveProduct = await newProduct.save();

      // Success response
      return res.status(200).json({ok: true, group: saveProduct});
      
    } catch (error) {
      return res.status(400).json(error);
    }
    
  }

  async index(req, res) {
    
    try {
      
      const products = await Product.find({ 'user_id': req.user_id }, [
        '-user_id',
        ], {
        sort: {
          createdAt: -1
        }
      }).populate('group');

      // Success response
      return res.status(200).json({ok: true, products});

    } catch (error) {
      return res.status(404).json(error);
    }

  }

  async show(req, res) {

    const id = req.params.id;

    try {
      
      const product = await Product.find({ '_id': id }, [
        '-user_id',
        ]
      ).populate('group');

      console.log(product);
      if(product.length === 0) res.status(404).json({ ok: false, error: 404, message: 'No se encontro el elemento.' });

      // Success response
      return res.status(200).json({ok: true, product});

    } catch (error) {
      return res.status(404).json(error);
    }

  }

  async update(req, res) {

    const id = req.params.id;
    const { state } = req.body;

    try {

      if(state === 'SOLD'){
        req.body.sold_date = Date(Date.now());
      }else if(state === 'ACTIVE' || state === 'STOCK'){
        req.body.sold_date = null;
      };

      await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        fields: [
          '-user_id',
        ]
      }, (err, response) => {

        if(err) res.status(404).json({ok: false , error: err});

        // Success response
        return res.status(200).json({ok: true, group: response});

      }).populate('group');

    } catch (error) {
      return res.status(404).json(error);
    }
  }

  async destroy(req, res) {

    try {
      
      const doc = await Product.findByIdAndDelete(req.params.id);
      
      if(!doc) throw {ok: false , message: 'El elemento no existe o ya fue eliminado previamente.'};
  
      return res.status(200).json({ok: true, message: 'El elemento fue eliminado con éxito.'});
      
    } catch (error) {
      return res.status(404).json(error);
    }

  }
}

export default new ProductController();
