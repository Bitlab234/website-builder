import axios from 'axios'
import type { Template, TemplateBlock } from './types'

const API_BASE = 'http://localhost:3001';

const createApiInstance = () => {
    const instance = axios.create({
        baseURL: API_BASE,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    await instance.post('/api/admin/refresh');
                    return instance(originalRequest);
                } catch (err) {
                    window.location.href = '/admin/login';
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export async function fetchAllTemplates(): Promise<Template[]> {
    try {
        console.log('huinya srabotala');
        const response = await axios.get<Template[]>(`${API_BASE}/api/templates`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке всех шаблонов:', error);
        return [];
    }
}

export async function fetchTemplateById(id: number): Promise<Template> {
    try {
        console.log('poeben srabotala');
        const response = await axios.get<Template>(`${API_BASE}/api/templates/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при загрузке шаблона с ID ${id}:`, error);
        throw error;
    }
}

export async function fetchTemplateBlocks(templateId: number): Promise<TemplateBlock[]> {
    try {
        console.log('srabotala zalupa');
        const response = await axios.get(`${API_BASE}/api/template-blocks/${templateId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки блоков:', error);
        throw error;
    }
}

export async function fetchFullTemplate(templateId: number): Promise<{
    template: any;
    blocks: TemplateBlock[];
}> {
    try {
        console.log('tut voobshe ahui che srabotalo');
        const [templateRes, blocksRes] = await Promise.all([
            axios.get(`${API_BASE}/api/templates/${templateId}`),
            axios.get(`${API_BASE}/api/template-blocks/${templateId}`)
        ]);

        return {
            template: templateRes.data,
            blocks: blocksRes.data
        };
    } catch (error) {
        console.error('Ошибка загрузки шаблона с блоками:', error);
        throw error;
    }
}

export const createLanding = async (templateId: string): Promise<{ id: string }> => {
    console.log('poehal sohranyatsya');
    const response = await fetch(`${API_BASE}/api/landings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: templateId })
    });
    return response.json();
};

export const saveLandingBlocks = async (landingId: string, blocks: TemplateBlock[]) => {
    console.log('poehali sohranyatsya');
    await fetch(`${API_BASE}/api/landings/${landingId}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            blocks: blocks.map((block, index) => ({
                type: block.type,
                component: block.component,
                position: index
            }))
        })
    });
};

export const fetchAllLandings = async () => {
    const response = await fetch(`${API_BASE}/api/landings`);
    return response.json();
};

export const fetchLandingById = async (id: string) => {
    const response = await fetch(`${API_BASE}/api/landings/${id}`);
    return response.json();
};

export const adminCheckAuth = async () => {
    try {
        const api = createApiInstance();
        await api.get('/api/admin/data');
        return true;
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        return false;
    }
};

export const adminLogout = async () => {
    try {
        const api = createApiInstance();
        await api.post('/api/admin/logout');
        return true;
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        return false;
    }
};

export const fetchLandingBlocks = async (landingId: string) => {
    try {
        const response = await axios.get(`${API_BASE}/api/landings/${landingId}/blocks`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке блоков лендинга:', error);
        throw error;
    }
};
