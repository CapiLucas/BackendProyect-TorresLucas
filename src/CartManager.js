const fs = require('fs');

class CartManager {
  constructor(path) {
    this.path = path;
  }

  readData() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  writeData(data) {
    fs.writeFileSync(this.path, JSON.stringify(data, null, 2), 'utf8');
  }

  createCart() {
    const carts = this.readData();

    const newCart = {
      id: Date.now().toString(), // Generamos un ID basado en el tiempo actual
      products: []
    };

    carts.push(newCart);
    this.writeData(carts);

    return newCart.id;
  }

  getProductsInCart(cartId) {
    const carts = this.readData();
    const cart = carts.find(cart => cart.id === cartId);

    return cart ? cart.products : null;
  }

  addProductToCart(cartId, productId, quantity) {
    const carts = this.readData();
    const cart = carts.find(cart => cart.id === cartId);

    if (cart) {
      const existingProduct = cart.products.find(item => item.id === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }

      this.writeData(carts);
      return true;
    }

    return false;
  }
}

module.exports = CartManager;