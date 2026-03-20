import * as React from 'react';
import { useState } from 'react';
import type { VariantDefinition, SizeDefinition } from '../../server/readVariants.ts';
import { PropertyPicker } from './PropertyPicker.tsx';
import { CssEditor } from './CssEditor.tsx';

export interface VariantEditorProps {
    variant: VariantDefinition | SizeDefinition;
    variantName: string;
    editType: 'variant' | 'size';
    onSave: (name: string, definition: VariantDefinition | SizeDefinition) => void;
    onCancel: () => void;
    tokens: Array<{ name: string; value: string }>;
}

const VARIANT_STATES = ['base', 'hover', 'active', 'focus', 'disabled', 'outline'] as const;

function isVariantDefinition(def: VariantDefinition | SizeDefinition): def is VariantDefinition {
    return 'base' in def && typeof (def as VariantDefinition).base === 'string';
}

function isSizeDefinition(def: VariantDefinition | SizeDefinition): def is SizeDefinition {
    return 'padding' in def && 'fontSize' in def;
}

export function VariantEditor({
    variant,
    variantName,
    editType,
    onSave,
    onCancel,
    tokens,
}: VariantEditorProps) {
    const [name, setName] = useState(variantName);
    const [draft, setDraft] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        for (const [key, value] of Object.entries(variant)) {
            if (key === '_meta') continue;
            initial[key] = typeof value === 'number' ? String(value) : (value as string);
        }
        return initial;
    });

    function updateField(key: string, value: string) {
        setDraft((prev) => ({ ...prev, [key]: value }));
    }

    function appendToField(key: string, addition: string) {
        setDraft((prev) => {
            const current = prev[key] ?? '';
            const updated = current ? `${current} ${addition}` : addition;
            return { ...prev, [key]: updated };
        });
    }

    function handleSave() {
        if (!name.trim()) return;

        if (editType === 'size') {
            const sizeDef: SizeDefinition = {
                padding: draft.padding ?? '',
                fontSize: draft.fontSize ?? '',
            };
            if (draft.iconSize) sizeDef.iconSize = Number(draft.iconSize);
            if (draft.radius) sizeDef.radius = draft.radius;
            onSave(name, sizeDef);
        } else {
            const variantDef: VariantDefinition = {
                base: draft.base ?? '',
            };
            for (const state of VARIANT_STATES) {
                if (state === 'base') continue;
                if (draft[state]) {
                    variantDef[state] = draft[state];
                }
            }
            // Preserve _meta if it existed
            if (isVariantDefinition(variant) && variant._meta) {
                variantDef._meta = variant._meta;
            }
            onSave(name, variantDef);
        }
    }

    // ---------------------------------------------------------------------------
    // Size editor — simpler text inputs
    // ---------------------------------------------------------------------------

    if (editType === 'size' || isSizeDefinition(variant)) {
        return (
            <div style={{ padding: 12 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
                    Edit Size: {variantName}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                    <label style={{ fontSize: 12 }}>
                        Name
                        <input
                            type="text"
                            aria-label="Variant name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '4px 8px',
                                fontSize: 12,
                                border: '1px solid #d1d5db',
                                borderRadius: 4,
                                marginTop: 2,
                            }}
                        />
                    </label>
                    {['padding', 'fontSize', 'iconSize', 'radius'].map((field) => (
                        <label key={field} style={{ fontSize: 12 }}>
                            {field}
                            <input
                                type="text"
                                aria-label={field}
                                value={draft[field] ?? ''}
                                onChange={(e) => updateField(field, e.target.value)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '4px 8px',
                                    fontSize: 12,
                                    border: '1px solid #d1d5db',
                                    borderRadius: 4,
                                    marginTop: 2,
                                }}
                            />
                        </label>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '6px 16px',
                            fontSize: 12,
                            borderRadius: 4,
                            border: '1px solid #3b82f6',
                            backgroundColor: '#3b82f6',
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        Save
                    </button>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '6px 16px',
                            fontSize: 12,
                            borderRadius: 4,
                            border: '1px solid #d1d5db',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // Variant editor — grouped by state with PropertyPicker + CssEditor
    // ---------------------------------------------------------------------------

    return (
        <div style={{ padding: 12 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
                Edit Variant: {variantName}
            </h3>

            <label style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                Name
                <input
                    type="text"
                    aria-label="Variant name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '4px 8px',
                        fontSize: 12,
                        border: '1px solid #d1d5db',
                        borderRadius: 4,
                        marginTop: 2,
                    }}
                />
            </label>

            {VARIANT_STATES.map((stateKey) => (
                <div
                    key={stateKey}
                    style={{
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottom: '1px solid #e5e7eb',
                    }}
                >
                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 8,
                            textTransform: 'capitalize',
                        }}
                    >
                        {stateKey}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <PropertyPicker
                            stateKey={stateKey}
                            propertyType="background"
                            value=""
                            tokens={tokens}
                            onChange={(cls) => appendToField(stateKey, cls)}
                        />
                        <PropertyPicker
                            stateKey={stateKey}
                            propertyType="text"
                            value=""
                            tokens={tokens}
                            onChange={(cls) => appendToField(stateKey, cls)}
                        />
                        <PropertyPicker
                            stateKey={stateKey}
                            propertyType="border"
                            value=""
                            tokens={tokens}
                            onChange={(cls) => appendToField(stateKey, cls)}
                        />
                        <PropertyPicker
                            stateKey={stateKey}
                            propertyType="ring"
                            value=""
                            tokens={tokens}
                            onChange={(cls) => appendToField(stateKey, cls)}
                        />
                    </div>

                    <CssEditor
                        label={`${stateKey} classes`}
                        value={draft[stateKey] ?? ''}
                        onChange={(v) => updateField(stateKey, v)}
                    />
                </div>
            ))}

            <div style={{ display: 'flex', gap: 4 }}>
                <button
                    onClick={handleSave}
                    style={{
                        padding: '6px 16px',
                        fontSize: 12,
                        borderRadius: 4,
                        border: '1px solid #3b82f6',
                        backgroundColor: '#3b82f6',
                        color: '#fff',
                        cursor: 'pointer',
                    }}
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    style={{
                        padding: '6px 16px',
                        fontSize: 12,
                        borderRadius: 4,
                        border: '1px solid #d1d5db',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
