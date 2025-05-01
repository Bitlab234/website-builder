import axios from 'axios'
import type { Template } from './types'

const API_BASE = 'http://localhost:3001';

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