import React from 'react';

interface BadgeProps {
    variant: 'hit' | 'miss' | 'neutral';
    children: React.ReactNode;
}

/**
 * Status badge component for displaying cache HIT/MISS states.
 *
 * @param variant - Visual style: 'hit' (green), 'miss' (amber), 'neutral' (gray)
 * @param children - Badge label content
 */
export function Badge({ variant, children }: BadgeProps): React.ReactElement {
    const variantClasses = {
        hit: 'bg-emerald-900/40 text-emerald-400 border border-emerald-700',
        miss: 'bg-amber-900/40 text-amber-400 border border-amber-700',
        neutral: 'bg-slate-800 text-slate-400 border border-slate-700',
    };

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold font-mono ${variantClasses[variant]}`}
        >
            {children}
        </span>
    );
}
