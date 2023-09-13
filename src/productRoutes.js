const express = require("express");
const router = express.Router();
const ProductManager = require("./ProductManager");
const CartManager = require("./CartManager"); // Agrega esta línea

const productManager = new ProductManager("products.json");
const cartManager = new CartManager("carts.json"); // Crea una instancia de CartManager

// Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, category, thumbnails } = req.body;
    const productData = {
      title,
      description,
      code,
      price,
      category,
      thumbnails,
    };

    productManager.addProduct(productData);
    res.json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;

    productManager.updateProduct(productId, updatedFields);
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);

    productManager.deleteProduct(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Crear un nuevo carrito
router.post("/carts", async (req, res) => {
  try {
    // Crea un nuevo carrito y devuelve su ID
    const cartId = await cartManager.createCart();
    res.json({ cartId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Listar productos de un carrito por ID
router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productsInCart = await cartManager.getProductsInCart(cartId);

    if (!productsInCart) {
      res.status(404).json({ error: "Cart not found" });
    } else {
      res.json(productsInCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Agregar un producto a un carrito
router.post("/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity;

    await cartManager.addProductToCart(cartId, productId, quantity);
    res.json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/carts', async (req, res) => {
    try {
      const cartId = cartManager.createCart();
      res.json({ cartId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Listar productos de un carrito por ID
  router.get('/carts/:cid', async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productsInCart = cartManager.getProductsInCart(cartId);
  
      if (!productsInCart) {
        res.status(404).json({ error: 'Cart not found' });
      } else {
        res.json(productsInCart);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Agregar un producto a un carrito
  router.post('/carts/:cid/product/:pid', async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = parseInt(req.params.pid);
      const quantity = req.body.quantity;
  
      const success = cartManager.addProductToCart(cartId, productId, quantity);
  
      if (success) {
        res.json({ message: 'Product added to cart successfully' });
      } else {
        res.status(404).json({ error: 'Cart not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;