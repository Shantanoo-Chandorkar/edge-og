import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    children: React.ReactNode;
}

/**
 * Reusable button component with three visual variants.
 *
 * @param variant - Visual style: 'primary' (filled), 'secondary' (outlined), 'ghost' (transparent)
 * @param children - Button label content
 */
export function Button({
    variant = 'primary',
    children,
    className = '',
    ...props
}: ButtonProps): React.ReactElement {
    const variantClasses = {
        primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
        secondary: 'bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white',
        ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white',
    };

    return (
        <button
            className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${variantClasses[variant]} ${className}`}
            {...props
            }
        >
            {children}
        </button>
    );
}
