const express = require('express');
const router = express.Router();
const { Product, Log } = require('../models/products');

router.get('/', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  const productLogs = await Log.findAll({ where: { productId: product.id } });

  res.json({ product, logs: productLogs });
});

router.post('/', async (req, res) => {
  const newProduct = await Product.create(req.body);

  await Log.create({
    productId: newProduct.id,
    action: 'created',
    by: newProduct.createdBy,
    date: new Date().toISOString().split('T')[0],
    amount: newProduct.stock,
    reason: 'Creado',
  });

  res.status(201).json(newProduct);
});

router.post('/:id/add-stock', async (req, res) => {
  const { amount, by, reason } = req.body;
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  product.stock += Number(amount);
  product.lastUpdatedBy = by;
  await product.save();

  await Log.create({
    productId: product.id,
    action: 'added',
    by,
    date: new Date().toISOString().split('T')[0],
    amount,
    reason,
  });

  res.json(product);
});

router.post('/:id/remove-stock', async (req, res) => {
  const { amount, by, reason } = req.body;
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  product.stock = Math.max(product.stock - Number(amount), 0);
  product.lastUpdatedBy = by;
  await product.save();

  await Log.create({
    productId: product.id,
    action: 'removed',
    by,
    date: new Date().toISOString().split('T')[0],
    amount,
    reason,
  });

  res.json(product);
});

router.put('/:id', async (req, res) => {
  const { name, category, by } = req.body;
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  if (name) product.name = name;
  if (category) product.category = category;
  if (by) product.lastUpdatedBy = by;

  await product.save();
  res.json(product);
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  await Log.create({
    productId: product.id,
    action: 'deleted',
    by: product.lastUpdatedBy,
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    reason: 'Eliminado',
  });

  await product.destroy();
  res.status(204).send();
});

module.exports = router;
