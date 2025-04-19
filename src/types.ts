export interface Block {
    type: string;
    content: string;
  }
  
  export interface Template {
    id: string;
    name: string;
    description: string;
    author: string;
    license: string;
    price: string;
    blocks: Block[];
  }
  
  export interface Landing {
    id: string;
    templateId: string;
    blocks: Block[];
  }
  