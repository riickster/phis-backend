const express = require('express');
const router = express.Router();

let products = [
  { id: 1, name: 'Camisa Azul', category: 'Ropa', stock: 120, createdBy: 'Juan', lastUpdatedBy: 'Carlos' },
  { id: 2, name: 'Vestido Rojo', category: 'Ropa', stock: 95, createdBy: 'Ana', lastUpdatedBy: 'Luis' },
  { id: 3, name: 'Cinturón Negro', category: 'Accesorios', stock: 1, createdBy: 'Pedro', lastUpdatedBy: 'Pedro' },
  { id: 4, name: 'Zapatos Cafés', category: 'Zapatos', stock: 60, createdBy: 'María', lastUpdatedBy: 'Luis' },
];

let logs = [
  { productId: 1, action: 'created', by: 'Juan', date: '2024-01-01', amount: 120, reason: 'Stock inicial' },
  { productId: 1, action: 'removed', by: 'Carlos', date: '2024-02-10', amount: 20, reason: 'Venta' },
  { productId: 1, action: 'added', by: 'Carlos', date: '2024-03-15', amount: 30, reason: 'Reposición' },
];

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  const productLogs = logs.filter((log) => log.productId === product.id);

  res.json({ product, logs: productLogs });
});

router.post('/', (req, res) => {
  const newProduct = { ...req.body, id: products.length + 1 };
  products.push(newProduct);
  logs.push({ productId: newProduct.id, action: 'created', by: newProduct.createdBy, date: new Date().toISOString().split('T')[0], amount: newProduct.stock, reason: 'Creado' });
  res.status(201).json(newProduct);
});

router.post('/:id/add-stock', (req, res) => {
  const { amount, by, reason } = req.body;
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  product.stock += amount;
  product.lastUpdatedBy = by;
  logs.push({ productId: product.id, action: 'added', by, date: new Date().toISOString().split('T')[0], amount, reason });
  res.json(product);
});

router.post('/:id/remove-stock', (req, res) => {
  const { amount, by, reason } = req.body;
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  product.stock = Math.max(product.stock - amount, 0);
  product.lastUpdatedBy = by;
  logs.push({ productId: product.id, action: 'removed', by, date: new Date().toISOString().split('T')[0], amount, reason });
  res.json(product);
});

router.delete('/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });
  logs.push({ productId: products[index].id, action: 'deleted', by: products[index].lastUpdatedBy, date: new Date().toISOString().split('T')[0], amount: 0, reason: 'Eliminado' });
  products.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
