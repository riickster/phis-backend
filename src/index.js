const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

require('dotenv').config();

app.use(cors());
app.use(express.json());

const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});