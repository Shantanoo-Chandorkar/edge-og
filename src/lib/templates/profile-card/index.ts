import React from 'react';
import { TemplateDefinition } from '@/lib/templates/types';
import { ProfileCard } from './ProfileCard';

export const profileCardTemplate: TemplateDefinition = {
    slug: 'profile-card',
    displayName: 'Profile Card',
    description: 'Centered profile card with avatar, social handles, and bio',
    fields: [
        {
            key: 'name',
            label: 'Name',
            type: 'text',
            required: false,
            description: 'Full name to display',
            defaultValue: 'Jane Doe',
        },
        {
            key: 'title',
            label: 'Job Title',
            type: 'text',
            required: false,
            description: 'Professional title or role',
            defaultValue: 'Software Engineer',
        },
        {
            key: 'avatarUrl',
            label: 'Avatar URL',
            type: 'url',
            required: false,
            description: 'URL to your profile photo',
        },
        {
            key: 'company',
            label: 'Company',
            type: 'text',
            required: false,
            description: 'Company or organisation name',
        },
        {
            key: 'twitterHandle',
            label: 'Twitter/X Handle',
            type: 'text',
            required: false,
            description: 'Your Twitter/X username (without @)',
        },
        {
            key: 'githubHandle',
            label: 'GitHub Handle',
            type: 'text',
            required: false,
            description: 'Your GitHub username',
        },
        {
            key: 'bio',
            label: 'Bio',
            type: 'text',
            required: false,
            description: 'Short bio or tagline (keep it under 120 characters)',
        },
    ],
    render: (props: Record<string, string>): React.ReactElement =>
        React.createElement(ProfileCard, props as any),
};
