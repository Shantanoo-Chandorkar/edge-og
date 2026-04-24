import React from 'react';
import { TemplateDefinition } from '@/lib/templates/types';
import { ProductCard } from './ProductCard';

export const productCardTemplate: TemplateDefinition = {
    slug: 'product-card',
    displayName: 'Product Card',
    description: 'Clean light card for products with name, tagline, price, and CTA',
    fields: [
        {
            key: 'productName',
            label: 'Product Name',
            type: 'text',
            required: true,
            description: 'The product or project name',
            defaultValue: 'My Product',
        },
        {
            key: 'tagline',
            label: 'Tagline',
            type: 'text',
            required: false,
            description: 'A short description or value proposition',
            defaultValue: 'The best product you never knew you needed.',
        },
        {
            key: 'logoUrl',
            label: 'Logo URL',
            type: 'url',
            required: false,
            description: 'URL to the product logo image',
        },
        {
            key: 'price',
            label: 'Price',
            type: 'text',
            required: false,
            description: 'Price value (e.g. "29", "99.99")',
        },
        {
            key: 'currency',
            label: 'Currency Symbol',
            type: 'text',
            required: false,
            description: 'Currency symbol to prefix the price (e.g. "$", "€")',
            defaultValue: '$',
        },
        {
            key: 'stock',
            label: 'Stock',
            type: 'select',
            options: ['In Stock', 'Out of Stock'],
            required: false,
            description: 'Product availability shown as a badge next to the price',
            defaultValue: 'In Stock',
        },
        {
            key: 'ctaText',
            label: 'CTA Text',
            type: 'text',
            required: false,
            description: 'Call-to-action text shown in the footer strip',
            defaultValue: 'Get started today',
        },
        {
            key: 'backgroundColor',
            label: 'Background Color',
            type: 'color',
            required: false,
            description: 'Card background color',
            defaultValue: '#ffffff',
        },
    ],
    render: (props: Record<string, string>): React.ReactElement =>
        React.createElement(ProductCard, props as any),
};
