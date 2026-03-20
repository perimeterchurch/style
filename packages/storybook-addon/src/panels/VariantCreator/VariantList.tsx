import React from 'react';
import type { VariantDefinition, SizeDefinition } from '../../server/readVariants';

export interface VariantListProps {
    variants: Record<string, VariantDefinition>;
    sizes: Record<string, SizeDefinition>;
    onEdit: (name: string, type: 'variant' | 'size') => void;
    onClone: (name: string, type: 'variant' | 'size') => void;
    onDelete: (name: string, type: 'variant' | 'size') => void;
    readOnly?: boolean;
}

const buttonStyle: React.CSSProperties = {
    padding: '2px 8px',
    fontSize: 11,
    borderRadius: 4,
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    cursor: 'pointer',
};

const deleteButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: '#dc2626',
    borderColor: '#fca5a5',
};

function EntryRow({
    name,
    type,
    hasDelete,
    onEdit,
    onClone,
    onDelete,
    readOnly,
}: {
    name: string;
    type: 'variant' | 'size';
    hasDelete: boolean;
    onEdit: (name: string, type: 'variant' | 'size') => void;
    onClone: (name: string, type: 'variant' | 'size') => void;
    onDelete: (name: string, type: 'variant' | 'size') => void;
    readOnly?: boolean;
}) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #f3f4f6',
            }}
        >
            <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
            {!readOnly && (
                <div style={{ display: 'flex', gap: 4 }}>
                    <button style={buttonStyle} onClick={() => onEdit(name, type)}>
                        Edit
                    </button>
                    <button style={buttonStyle} onClick={() => onClone(name, type)}>
                        Clone
                    </button>
                    {hasDelete && (
                        <button style={deleteButtonStyle} onClick={() => onDelete(name, type)}>
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export function VariantList({
    variants,
    sizes,
    onEdit,
    onClone,
    onDelete,
    readOnly,
}: VariantListProps) {
    const variantNames = Object.keys(variants);
    const sizeNames = Object.keys(sizes);

    return (
        <div style={{ padding: 12 }}>
            {/* Variants section */}
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>Variants</h3>
            {variantNames.length === 0 ? (
                <div style={{ fontSize: 12, color: '#6b7280', padding: '8px 0' }}>
                    No variants defined
                </div>
            ) : (
                variantNames.map((name) => (
                    <EntryRow
                        key={name}
                        name={name}
                        type="variant"
                        hasDelete={!!variants[name]._meta}
                        onEdit={onEdit}
                        onClone={onClone}
                        onDelete={onDelete}
                        readOnly={readOnly}
                    />
                ))
            )}

            {/* Sizes section */}
            {sizeNames.length > 0 && (
                <>
                    <h3 style={{ margin: '16px 0 8px', fontSize: 14, fontWeight: 600 }}>Sizes</h3>
                    {sizeNames.map((name) => (
                        <EntryRow
                            key={name}
                            name={name}
                            type="size"
                            hasDelete={false}
                            onEdit={onEdit}
                            onClone={onClone}
                            onDelete={onDelete}
                            readOnly={readOnly}
                        />
                    ))}
                </>
            )}
        </div>
    );
}
