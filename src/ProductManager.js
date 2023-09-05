
const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  readData() {   //lee el contenido del this.path y lo convierte en objeto Javascript, sino devuelve un arreglo vacio.
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  writeData(data) {  //recibe datos y losescribe en formato JSON
    fs.writeFileSync(this.path, JSON.stringify(data, null, 2), 'utf8');
  }

  addProduct(productData) {  //recibe un objeto productData que representa un nuevo producto a agregar.
    const products = this.readData();

    const newProduct = {
      id: products.length + 1,
      ...productData,
    };

    products.push(newProduct);
    this.writeData(products);
  }

  getProducts() {
    return this.readData();
  }

  getProductById(id) {
    const products = this.readData();
    return products.find(product => product.id === id);
  }

  updateProduct(id, updatedFields) {
    const products = this.readData();
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        return {
          ...product,
          ...updatedFields,
          id: product.id, 
        };
      }
      return product;
    });

    this.writeData(updatedProducts);
  }

  deleteProduct(id) {
    const products = this.readData();
    const updatedProducts = products.filter(product => product.id !== id);
    this.writeData(updatedProducts);
  }
}

const productManager = new ProductManager('products.json');

// Ejemplo de USO:
productManager.addProduct({
  title: "Product 3",
  description: "Description 3",
  price: 15.99,
  thumbnail: "image3",
  code: "P345",
  stock: 20,
});

const allProducts = productManager.getProducts();
console.log(allProducts);

const productById = productManager.getProductById(2);
console.log(productById);

productManager.updateProduct(2, { price: 22.99, stock: 25 });
const updatedProduct = productManager.getProductById(2);
console.log(updatedProduct);

productManager.deleteProduct(1);
const remainingProducts = productManager.getProducts();
console.log(remainingProducts);

module.exports = ProductManager;

//Se agregan productos, se obtienen todos los productos, se obtiene un producto por ID, se actualiza un producto y se elimina un producto, y se muestran los resultados en la consola.