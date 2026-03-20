import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { FadeIn } from './FadeIn';
import { SlideUp } from './SlideUp';
import { ScaleIn } from './ScaleIn';
import { AnimatedList } from './AnimatedList';
import { AnimatedPanel } from './AnimatedPanel';
import { CountUp } from './CountUp';
import { SkeletonTransition } from './SkeletonTransition';

describe('Motion components', () => {
    it('FadeIn renders without crashing', () => {
        const { container } = render(<FadeIn>content</FadeIn>);
        expect(container.firstChild).not.toBeNull();
    });

    it('SlideUp renders without crashing', () => {
        const { container } = render(<SlideUp>content</SlideUp>);
        expect(container.firstChild).not.toBeNull();
    });

    it('ScaleIn renders without crashing', () => {
        const { container } = render(<ScaleIn>content</ScaleIn>);
        expect(container.firstChild).not.toBeNull();
    });

    it('AnimatedList renders without crashing', () => {
        const { container } = render(
            <AnimatedList>
                <div>item 1</div>
                <div>item 2</div>
            </AnimatedList>,
        );
        expect(container.firstChild).not.toBeNull();
    });

    it('AnimatedPanel renders without crashing when open', () => {
        const { container } = render(
            <AnimatedPanel open onClose={() => {}}>
                panel content
            </AnimatedPanel>,
        );
        expect(container.firstChild).not.toBeNull();
    });

    it('CountUp renders without crashing', () => {
        const { container } = render(<CountUp value={100} />);
        expect(container.firstChild).not.toBeNull();
    });

    it('SkeletonTransition renders without crashing', () => {
        const { container } = render(
            <SkeletonTransition isLoading={false} skeleton={<div>loading...</div>}>
                loaded content
            </SkeletonTransition>,
        );
        expect(container.firstChild).not.toBeNull();
    });
});
