require('dotenv').config();
const express = require('express');

const muralsRouter = require('./routes/murals');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.json());

app.use('/murals', muralsRouter);
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
