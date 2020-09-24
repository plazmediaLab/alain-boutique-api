class ProductController {
  async store(req, res) {
    return res.json('Product created...');
  }

  async index(req, res) {
    return res.json('Get products...');
  }

  async show(req, res) {

    const id = req.params.id;

    return res.json(`Get product: ${id}`);
  }

  async update(req, res) {
    const id = req.params.id;

    return res.json(`Update product: ${id}`);
  }

  async destroy(req, res) {
    const id = req.params.id;

    return res.json(`Delete product: ${id}`);
  }
}

export default new ProductController();
