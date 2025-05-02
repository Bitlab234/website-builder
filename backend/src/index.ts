import express from 'express';
import cors from 'cors';
import { pool } from './db';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3001;
const fs = require('fs');
const SECRET_KEY = 'kjasdhf98n4c8h2f09hajsdhf9834hf028fhq0938';
const ACCESS_TOKEN_EXPIRES = '10s';
const REFRESH_TOKEN_EXPIRES = '7d';

const corsOptions = {
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const generateRandomString = (length = 16) => {
    return Math.random().toString(36).substring(2, length + 2);
};

// Обновлённая функция генерации токенов
const generateTokens = (adminId) => {
    const payload = {
        id: adminId,
        session: generateRandomString(), // Используем нашу функцию
        iat: Math.floor(Date.now() / 1000)
    };

    console.log(`Generating new tokens for admin ${adminId} with session ${payload.session}`);

    const accessToken = jwt.sign(payload, SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_EXPIRES
    });

    const refreshToken = jwt.sign(payload, SECRET_KEY, {
        expiresIn: REFRESH_TOKEN_EXPIRES
    });

    return { accessToken, refreshToken };
};

const authenticateJWT = (req: any, res: any, next: any) => {
    const token = req.cookies.accessToken;

    if (token) {
        jwt.verify(token, SECRET_KEY, (err: any, admin: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.admin = admin;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM admins WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Неверные учетные данные' });
        }

        const admin = result.rows[0];
        const isValid = await bcrypt.compare(password, admin.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Неверные учетные данные' });
        }

        const { accessToken, refreshToken } = generateTokens(admin.id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 10000 // 10 секунд
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновление токена
app.post('/api/admin/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log('token obnovlen');
    console.log(refreshToken);

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(refreshToken, SECRET_KEY) as { id: number };
        const { accessToken } = generateTokens(decoded.id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 10000
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.sendStatus(403);
    }
});

// Выход
app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true });
});

app.get('/api/admin/data', authenticateJWT, (req, res) => {
    res.json({ message: 'Защищенные данные' });
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

app.post('/api/landings', async (req, res) => {
    try {
        const { template_id } = req.body;
        const id = generateLandingId();

        await pool.query(
            'INSERT INTO landings (id, template_id) VALUES ($1, $2)',
            [id, template_id]
        );

        res.json({ id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при создании лендинга' });
    }
});

app.post('/api/landings/:id/blocks', async (req, res) => {
    try {
        const { id } = req.params;
        const { blocks } = req.body;

        await pool.query('BEGIN');

        await pool.query('DELETE FROM landing_blocks WHERE landing_id = $1', [id]);

        for (const [index, block] of blocks.entries()) {
            await pool.query(
                'INSERT INTO landing_blocks (landing_id, type, component, position) VALUES ($1, $2, $3, $4)',
                [id, block.type, block.component, index]
            );
        }

        await pool.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Ошибка при сохранении блоков' });
    }
});

app.get('/api/landings', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM landings ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении лендингов' });
    }
});

app.get('/api/landings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const landing = await pool.query('SELECT * FROM landings WHERE id = $1', [id]);

        if (landing.rows.length === 0) {
            return res.status(404).json({ error: 'Landing not found' });
        }

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

app.get('/api/landings/:id/blocks', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            'SELECT * FROM landing_blocks WHERE landing_id = $1 ORDER BY position',
            [id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении блоков лендинга' });
    }
});

app.get('/api/templates/:id/blocks', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            'SELECT * FROM template_blocks WHERE template_id = $1 ORDER BY position',
            [id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении блоков шаблона' });
    }
});

function generateLandingId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger доступен на http://localhost:${PORT}/api-docs`);
});