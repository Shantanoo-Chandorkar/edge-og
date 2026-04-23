import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    description?: string;
    error?: string;
}

/**
 * Labelled input field with optional description and error message.
 *
 * @param label - The field label shown above the input
 * @param description - Optional helper text shown below the input
 * @param error - Optional error message; when present, input is styled as invalid
 */
export function Input({
    label,
    description,
    error,
    className = '',
    ...props
}: InputProps): React.ReactElement {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                {label}
                {props.required && (
                    <span className="text-red-400 text-xs">*</span>
                )}
            </label>
            <input
                className={`bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-md px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors ${className}`}
                {...props}
            />
            {description && !error && (
                <p className="text-xs text-slate-500">{description}</p>
            )}
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
}
