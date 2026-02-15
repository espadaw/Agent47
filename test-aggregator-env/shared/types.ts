export enum Platform {
    VIRTUALS = 'virtuals',
    RENTAHUMAN = 'rentahuman',
    X402_BAZAAR = 'x402_bazaar',

    // Web scraping platforms
    JOBFORAGENT = 'jobforagent',
    AGENT_AI = 'agent_ai',
    MULERUN = 'mulerun',
    PLAYHOUSE = 'playhouse',
    AI_AGENT_STORE = 'ai_agent_store',
    METASCHOOL = 'metaschool',
}

export enum JobCategory {
    DEVELOPMENT = 'development',
    DESIGN = 'design',
    WRITING = 'writing',
    MARKETING = 'marketing',
    DATA = 'data',
    CW = 'content_writing',
    SOCIAL_MEDIA = 'social_media',
    ASSISTANT = 'assistant',
    CREATIVE = 'creative',
    OTHER = 'other'
}

export interface JobSalary {
    min: number;
    max: number;
    currency: string;
}

export interface Job {
    id: string;
    platform: Platform;
    title: string;
    description: string;
    url: string;
    salary: JobSalary;
    postedAt: Date;
    category: JobCategory;
    tags: string[];
}

export interface JobFilter {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: JobCategory;
    platform?: Platform[];
}
