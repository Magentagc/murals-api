const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /murals/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query(
    'SELECT id, title, description, video_url, qr_code_url FROM murals WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Mural not found' });
  }

  res.json(rows[0]);
});

// GET /murals/visited/:user_id
router.get('/visited/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const [rows] = await db.query(
    `SELECT m.id, m.title, m.description, m.video_url, m.qr_code_url, mv.visited_at
     FROM mural_visits mv
     JOIN murals m ON m.id = mv.mural_id
     WHERE mv.user_id = ?
     ORDER BY mv.visited_at DESC`,
    [user_id]
  );

  res.json(rows);
});

// POST /murals/:id/visit
router.post('/:id/visit', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const [mural] = await db.query('SELECT id FROM murals WHERE id = ?', [id]);
  if (mural.length === 0) {
    return res.status(404).json({ error: 'Mural not found' });
  }

  await db.query(
    'INSERT IGNORE INTO mural_visits (user_id, mural_id) VALUES (?, ?)',
    [user_id, id]
  );

  res.status(200).json({ message: 'Visit recorded' });
});

module.exports = router;
