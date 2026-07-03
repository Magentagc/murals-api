require('dotenv').config();
const express = require('express');
const cors = require('cors');

const muralsRouter = require('./routes/murals');
const authRouter = require('./routes/auth');

const app = express();

const allowedOrigins = [
  'http://localhost:8080',
  'https://museourbanodememorias.com',
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/murals', muralsRouter);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
