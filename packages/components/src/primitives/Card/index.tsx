import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { cardVariantClass, type CardVariant } from './Card.variants';

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
                'card',
                cardVariantClass[variant],
                hoverable && 'card-hoverable',
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
        <div ref={ref} className={cn('card-header', className)} {...props}>
            {children}
        </div>
    ),
);
CardHeader.displayName = 'Card.Header';

const CardBody = forwardRef<ElementRef<'div'>, CardSectionProps>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn('card-body', className)} {...props}>
            {children}
        </div>
    ),
);
CardBody.displayName = 'Card.Body';

const CardFooter = forwardRef<ElementRef<'div'>, CardSectionProps>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn('card-footer', className)} {...props}>
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

export { cardVariantClass, type CardVariant };
