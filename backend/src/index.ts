import express from 'express';
import cors from 'cors';
import { pool } from './db';


const app = express();
const PORT = 3001;
const fs = require('fs');
const SECRET = 'kjasdhf98n4c8h2f09hajsdhf9834hf028fhq0938';

const corsOptions = {
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Сервер работает! 🚀');
});

app.get('/api/templates', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT t.*, 
                   json_agg(tb.* ORDER BY tb.position) AS blocks
            FROM templates t
            LEFT JOIN template_blocks tb ON t.id = tb.template_id
            GROUP BY t.id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/templates/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/template-blocks/:templateId', async (req, res) => {
    try {
      const { templateId } = req.params;
      const result = await pool.query(
        'SELECT * FROM template_blocks WHERE template_id = $1 ORDER BY position',
        [templateId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/template-blocks/:templateId', async (req, res) => {
    try {
      const { templateId } = req.params;
      const result = await pool.query(
        'SELECT * FROM template_blocks WHERE template_id = $1 ORDER BY position',
        [templateId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/landings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const landing = await pool.query('SELECT * FROM landings WHERE id = $1', [id]);
        const blocks = await pool.query(
            'SELECT * FROM landing_blocks WHERE landing_id = $1 ORDER BY position',
            [id]
        );

        res.json({
            ...landing.rows[0],
            blocks: blocks.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/landings', async (req, res) => {
    const { templateId } = req.body;

    try {
        await pool.query('BEGIN');

        const newLanding = await pool.query(
            'INSERT INTO landings (template_id) VALUES ($1) RETURNING *',
            [templateId]
        );

        await pool.query(`
            INSERT INTO landing_blocks (landing_id, type, component, position)
            SELECT $1, type, component, position 
            FROM template_blocks 
            WHERE template_id = $2
        `, [newLanding.rows[0].id, templateId]);

        await pool.query('COMMIT');

        res.status(201).json(newLanding.rows[0]);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger доступен на http://localhost:${PORT}/api-docs`);
});