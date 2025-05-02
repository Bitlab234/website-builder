import express from 'express';
import cors from 'cors';
import { pool } from './db';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import setupSwagger from './swagger';

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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *     Template:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     Landing:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         template_id:
 *           type: integer
 *     Block:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         type:
 *           type: string
 *         component:
 *           type: string
 *         position:
 *           type: integer
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Аутентификация администратора
 *   - name: Templates
 *     description: Управление шаблонами лендингов
 *   - name: Landings
 *     description: Управление лендингами
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     tags: [Auth]
 *     summary: Вход администратора
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required: [username, password]
 *     responses:
 *       200:
 *         description: Успешный вход
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *       401:
 *         description: Неверные учетные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Обновление токена доступа
 *     responses:
 *       200:
 *         description: Токен обновлен
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недействительный refresh token
 */

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Выход из системы
 *     responses:
 *       200:
 *         description: Успешный выход
 */

/**
 * @swagger
 * /api/admin/data:
 *   get:
 *     tags: [Auth]
 *     summary: Защищенные данные
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Успешный запрос
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

/**
 * @swagger
 * /api/templates:
 *   get:
 *     tags: [Templates]
 *     summary: Получить все шаблоны с блоками
 *     responses:
 *       200:
 *         description: Список шаблонов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Template'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/templates/{id}:
 *   get:
 *     tags: [Templates]
 *     summary: Получить шаблон по ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Данные шаблона
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Template'
 *       404:
 *         description: Шаблон не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/template-blocks/{templateId}:
 *   get:
 *     tags: [Templates]
 *     summary: Получить блоки шаблона
 *     parameters:
 *       - name: templateId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список блоков шаблона
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Block'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


/**
 * @swagger
 * /api/landings:
 *   get:
 *     tags: [Landings]
 *     summary: Получить все лендинги
 *     responses:
 *       200:
 *         description: Список лендингов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Landing'
 *       500:
 *         description: Ошибка при получении лендингов
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Landings]
 *     summary: Создать новый лендинг
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template_id:
 *                 type: integer
 *             required: [template_id]
 *     responses:
 *       200:
 *         description: Лендинг создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       500:
 *         description: Ошибка при создании лендинга
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/landings/{id}:
 *   get:
 *     tags: [Landings]
 *     summary: Получить лендинг по ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Данные лендинга с блоками
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 template_id:
 *                   type: integer
 *                 blocks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Block'
 *       404:
 *         description: Лендинг не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/landings/{id}/blocks:
 *   get:
 *     tags: [Landings]
 *     summary: Получить блоки лендинга
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список блоков лендинга
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Block'
 *       500:
 *         description: Ошибка при получении блоков лендинга
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Landings]
 *     summary: Сохранить блоки лендинга
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blocks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Block'
 *             required: [blocks]
 *     responses:
 *       200:
 *         description: Блоки сохранены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Ошибка при сохранении блоков
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/templates/{id}/blocks:
 *   get:
 *     tags: [Templates]
 *     summary: Получить блоки шаблона
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список блоков шаблона
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Block'
 *       500:
 *         description: Ошибка при получении блоков шаблона
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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

setupSwagger(app);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger доступен на http://localhost:${PORT}/api-docs`);
});