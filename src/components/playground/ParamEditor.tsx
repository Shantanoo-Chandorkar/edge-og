'use client';

import React from 'react';
import { SerializableTemplate } from '@/lib/templates/types';
import { Input } from '@/components/ui/Input';

interface ParamEditorProps {
    template: SerializableTemplate;
    params: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

/**
 * Dynamic form that renders an input for each field in the selected template.
 * Field type drives the HTML input type. Required fields show inline errors when empty.
 *
 * @param template - The currently selected template (source of field definitions)
 * @param params - Current param values
 * @param onChange - Callback when any field value changes
 */
export function ParamEditor({
    template,
    params,
    onChange,
}: ParamEditorProps): React.ReactElement {
    return (
        <div className="flex flex-col gap-4">
            {template.fields.map((field) => {
                const value = params[field.key] ?? field.defaultValue ?? '';
                const isMissingRequired = field.required && !value;

                return (
                    <Input
                        key={field.key}
                        label={field.label}
                        description={field.description}
                        error={isMissingRequired ? `${field.label} is required` : undefined}
                        type={field.type === 'color' ? 'color' : field.type === 'number' ? 'number' : 'text'}
                        value={value}
                        required={field.required}
                        placeholder={field.defaultValue}
                        onChange={(e) => onChange(field.key, e.target.value)}
                    />
                );
            })}
        </div>
    );
}
