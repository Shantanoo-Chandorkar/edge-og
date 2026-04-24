import React from 'react';
import { TemplateDefinition } from '@/lib/templates/types';
import { BlogCard } from './BlogCard';

export const blogCardTemplate: TemplateDefinition = {
    slug: 'blog-card',
    displayName: 'Blog Card',
    description: 'Dark-themed card for blog posts with title, author, and metadata',
    fields: [
        {
            key: 'title',
            label: 'Title',
            type: 'text',
            required: false,
            description: 'The main blog post title',
            defaultValue: 'My Blog Post',
        },
        {
            key: 'author',
            label: 'Author',
            type: 'text',
            required: false,
            description: 'Author display name',
            defaultValue: 'Jane Doe',
        },
        {
            key: 'avatarUrl',
            label: 'Avatar URL',
            type: 'url',
            required: false,
            description: 'URL to the author avatar image',
        },
        {
            key: 'readTime',
            label: 'Read Time',
            type: 'text',
            required: false,
            description: 'Estimated read time (e.g. "5 min read")',
            defaultValue: '5 min read',
        },
        {
            key: 'tag',
            label: 'Tag',
            type: 'text',
            required: false,
            description: 'Topic or category tag shown at the top',
            defaultValue: 'Tutorial',
        },
        {
            key: 'siteUrl',
            label: 'Site URL',
            type: 'text',
            required: false,
            description: 'Your site domain shown at the bottom',
            defaultValue: 'mysite.com',
        },
        {
            key: 'accentColor',
            label: 'Accent Color',
            type: 'color',
            required: false,
            description: 'Hex color for the accent strip and highlights',
            defaultValue: '#6366f1',
        },
    ],
    render: (props: Record<string, string>): React.ReactElement =>
        React.createElement(BlogCard, props as any),
};
