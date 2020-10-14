import Group from '../models/Group';
import Product from '../models/Product';
import User from '../models/User';

class SummaryController {
  /**
   *
   * Returns all elements SummaryController
   *
   */
  async index(req, res) {
    try {
      // Obtener todos los parnerths del usuario en turno
      const parnerths = await User.findById(req.user_id).select('parnerth role -_id');

      let groups;
      let products;
      let shared_groups;
      let parnerths_count = 0;
      let total_on_base_price = 0;
      let total_on_base_value = 0;
      let total_sold_on_products_price = 0;
      let total_sold_on_products_value = 0;
      let on_stock = 0;
      let on_active = 0;
      let on_sold = 0;

      if (parnerths.role !== 'PARNERTH_ROLE') {
        // Obtener todos los productos del usuario en turno
        products = await Product.countDocuments({ user_id: req.user_id });
        on_stock = await Product.countDocuments({ user_id: req.user_id, state: 'STOCK' });
        on_active = await Product.countDocuments({ user_id: req.user_id, state: 'ACTIVE' });
        on_sold = await Product.countDocuments({ user_id: req.user_id, state: 'SOLD' });
        // Obtener todos los grupos del usuario en turno
        groups = await Group.countDocuments({ user_id: req.user_id });
        // Número de parnerths relacionados al usuario
        shared_groups = await Group.countDocuments({
          parnerth: { $exists: true, $not: { $size: 0 } }
        });

        const parnerthsFound = await User.findById({ _id: req.user_id }).select('parnerth -_id');
        parnerths_count = parnerthsFound.parnerth.length;

        const productsFound = await Product.find({ user_id: req.user_id }).select('price value');
        productsFound.map((item) => {
          total_on_base_price += item.price;
          total_on_base_value += item.value;
        });

        const productsSoldFound = await Product.find({
          user_id: req.user_id,
          state: 'SOLD'
        }).select('price value');
        productsSoldFound.map((item) => {
          total_sold_on_products_price += item.price;
          total_sold_on_products_value += item.value;
        });
      }

      const summary = {
        parnerths_count,
        groups: {
          total: groups,
          shared_groups
        },
        products: {
          total: products,
          on_stock,
          on_active,
          on_sold
        },
        profit: {
          total: total_on_base_value - total_on_base_price
        },
        money_sold_on_products: {
          total: total_sold_on_products_value - total_sold_on_products_price,
          total_sold_on_products_price,
          total_sold_on_products_value
        },
        total_on_base_price,
        total_on_base_value
      };

      // Success response
      return res.status(200).json({ ok: true, summary });
    } catch (err) {
      return res.json(err);
    }
  }
}

export default new SummaryController();
