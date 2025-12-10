import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonStyles = cva(
    [
        'font-inherit text-inherit',
        'inline-flex items-center justify-center gap-2',
        'px-4 py-3',
        'rounded-[12px]',
        'text-sm font-medium text-center',
        'border-0 cursor-pointer select-none outline-none',
        'focus-visible:ring-1 focus-visible:ring-offset-1',
        'transition ease-in-out duration-300',
    ].join(' '),
    {
        variants: {
            variant: {
                primary:
                    'bg-[#CEFF7D] text-black hover:bg-[#89DC00] hover:text-white',
                secondary:
                    'bg-[rgba(199,199,199,0.16)] text-black hover:bg-[rgba(150,150,150,0.3)]',
                dots: 'bg-[#EDEFEA] text-black hover:bg-[#E0E0E0]',
            },
            size: {
                default: 'px-4 py-3',
                sm: 'px-2 py-2 text-sm',
                lg: 'px-4 py-4 text-lg',
            },
            fullWidth: { true: 'w-full', false: '' },
            iconPosition: {
                left: 'flex-row',
                right: 'flex-row-reverse',
            },
        },
        defaultVariants: {
            variant: 'primary',
            fullWidth: false,
            iconPosition: 'left',
        },
    },
);

type OwnProps = {
    children?: ReactNode;
    className?: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
} & VariantProps<typeof buttonStyles>;

type PolymorphicProps<T extends ElementType> = {
    as?: T;
} & OwnProps &
    Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | 'as'>;

export const Button = <T extends ElementType = 'button'>(
    props: PolymorphicProps<T>,
) => {
    const {
        as,
        children,
        className,
        variant,
        fullWidth,
        size,
        iconPosition,
        icon,
        ...rest
    } = props;
    const Component = (as ?? 'button') as ElementType;

    return (
        <Component
            className={twMerge(
                buttonStyles({ variant, fullWidth, size, iconPosition }),
                className,
            )}
            {...rest}
        >
            {icon && iconPosition === 'left' && (
                <span className="shrink-0">{icon}</span>
            )}
            <span className="flex-1">{children}</span>
            {icon && iconPosition === 'right' && (
                <span className="shrink-0">{icon}</span>
            )}
        </Component>
    );
};
