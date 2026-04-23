import { TemplateDefinition } from './types';
import { blogCardTemplate } from './blog-card/index';
import { productCardTemplate } from './product-card/index';
import { profileCardTemplate } from './profile-card/index';

const templates = new Map<string, TemplateDefinition>();

export function registerTemplate(template: TemplateDefinition): void {
    templates.set(template.slug, template);
}

export function getTemplate(slug: string): TemplateDefinition | undefined {
    return templates.get(slug);
}

export function listTemplates(): TemplateDefinition[] {
    return Array.from(templates.values());
}

// Register all templates at module load time
registerTemplate(blogCardTemplate);
registerTemplate(productCardTemplate);
registerTemplate(profileCardTemplate);
