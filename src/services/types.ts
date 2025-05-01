export interface Template {
    id: string;
    name: string;
    description: string;
    keywords: string;
    author: string;
    license: string;
    price: string;
    blocks: TemplateBlock[];
  }
  
  export interface TemplateBlock {
    id?: number;
    type: string;
    component: string;
    position: number;
  }
  
  export interface Landing {
    id: string;
    template_id: string;
    blocks: LandingBlock[];
  }
  
  export interface LandingBlock {
    id?: number;
    type: string;
    component: string;
    position: number;
  }
  
  export type LandingUpdateData = Partial<Pick<Landing, 'blocks'>>;