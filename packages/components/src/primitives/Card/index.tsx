import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { cardVariants, type CardVariant } from './Card.variants';

type CardElement = ElementRef<'div'>;

export interface CardProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
    variant?: CardVariant;
    hoverable?: boolean;
}

export interface CardSectionProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {}

const CardRoot = forwardRef<CardElement, CardProps>(
    ({ variant = 'default', hoverable = false, className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                cardVariants[variant].base,
                hoverable && 'hover:shadow-md hover:-translate-y-0.5',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    ),
);
CardRoot.displayName = 'Card';

const CardHeader = forwardRef<ElementRef<'div'>, CardSectionProps>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
            {children}
        </div>
    ),
);
CardHeader.displayName = 'Card.Header';

const CardBody = forwardRef<ElementRef<'div'>, CardSectionProps>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
            {children}
        </div>
    ),
);
CardBody.displayName = 'Card.Body';

const CardFooter = forwardRef<ElementRef<'div'>, CardSectionProps>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props}>
            {children}
        </div>
    ),
);
CardFooter.displayName = 'Card.Footer';

export const Card = Object.assign(CardRoot, {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
});

export { cardVariants, type CardVariant };
