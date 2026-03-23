import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FadeIn } from './FadeIn';
import { SlideUp } from './SlideUp';
import { ScaleIn } from './ScaleIn';
import { AnimatedList } from './AnimatedList';
import { CountUp } from './CountUp';
import { SkeletonTransition } from './SkeletonTransition';

const meta: Meta = {
    title: 'Motion/Animations',
};

export default meta;
type Story = StoryObj;

const boxStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    textAlign: 'center',
};

export const Fade: Story = {
    render: () => {
        function FadeDemo() {
            const [key, setKey] = useState(0);
            return (
                <div>
                    <button
                        onClick={() => setKey((k) => k + 1)}
                        style={{
                            marginBottom: '1rem',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                        }}
                    >
                        Replay
                    </button>
                    <FadeIn key={key}>
                        <div style={boxStyle}>Fade In</div>
                    </FadeIn>
                </div>
            );
        }
        return <FadeDemo />;
    },
};

export const Slide: Story = {
    name: 'SlideUp',
    render: () => {
        function SlideDemo() {
            const [key, setKey] = useState(0);
            return (
                <div>
                    <button
                        onClick={() => setKey((k) => k + 1)}
                        style={{
                            marginBottom: '1rem',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                        }}
                    >
                        Replay
                    </button>
                    <SlideUp key={key}>
                        <div style={boxStyle}>Slide Up</div>
                    </SlideUp>
                </div>
            );
        }
        return <SlideDemo />;
    },
};

export const Scale: Story = {
    name: 'ScaleIn',
    render: () => {
        function ScaleDemo() {
            const [key, setKey] = useState(0);
            return (
                <div>
                    <button
                        onClick={() => setKey((k) => k + 1)}
                        style={{
                            marginBottom: '1rem',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                        }}
                    >
                        Replay
                    </button>
                    <ScaleIn key={key}>
                        <div style={boxStyle}>Scale In</div>
                    </ScaleIn>
                </div>
            );
        }
        return <ScaleDemo />;
    },
};

export const List: Story = {
    name: 'AnimatedList',
    render: () => {
        function ListDemo() {
            const [key, setKey] = useState(0);
            return (
                <div>
                    <button
                        onClick={() => setKey((k) => k + 1)}
                        style={{
                            marginBottom: '1rem',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                        }}
                    >
                        Replay
                    </button>
                    <AnimatedList
                        key={key}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                    >
                        {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item) => (
                            <div key={item} style={{ ...boxStyle, padding: '0.75rem' }}>
                                {item}
                            </div>
                        ))}
                    </AnimatedList>
                </div>
            );
        }
        return <ListDemo />;
    },
};

export const Counter: Story = {
    name: 'CountUp',
    render: () => {
        function CounterDemo() {
            const [value, setValue] = useState(0);
            return (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>
                        <CountUp value={value} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                            onClick={() => setValue(42)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 8,
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                            }}
                        >
                            42
                        </button>
                        <button
                            onClick={() => setValue(1000)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 8,
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                            }}
                        >
                            1,000
                        </button>
                        <button
                            onClick={() => setValue(99999)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 8,
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                            }}
                        >
                            99,999
                        </button>
                        <button
                            onClick={() => setValue(0)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 8,
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            );
        }
        return <CounterDemo />;
    },
};

export const SkeletonToContent: Story = {
    name: 'SkeletonTransition',
    render: () => {
        function SkeletonDemo() {
            const [isLoading, setIsLoading] = useState(true);
            return (
                <div style={{ maxWidth: 300 }}>
                    <button
                        onClick={() => setIsLoading((l) => !l)}
                        style={{
                            marginBottom: '1rem',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                        }}
                    >
                        Toggle Loading: {isLoading ? 'ON' : 'OFF'}
                    </button>
                    <SkeletonTransition
                        isLoading={isLoading}
                        skeleton={
                            <div
                                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                            >
                                <div
                                    style={{
                                        height: 16,
                                        width: '80%',
                                        borderRadius: 8,
                                        backgroundColor: 'var(--color-bg-muted)',
                                    }}
                                />
                                <div
                                    style={{
                                        height: 16,
                                        width: '60%',
                                        borderRadius: 8,
                                        backgroundColor: 'var(--color-bg-muted)',
                                    }}
                                />
                                <div
                                    style={{
                                        height: 16,
                                        width: '70%',
                                        borderRadius: 8,
                                        backgroundColor: 'var(--color-bg-muted)',
                                    }}
                                />
                            </div>
                        }
                    >
                        <div style={boxStyle}>
                            <p>Content has loaded!</p>
                        </div>
                    </SkeletonTransition>
                </div>
            );
        }
        return <SkeletonDemo />;
    },
};
