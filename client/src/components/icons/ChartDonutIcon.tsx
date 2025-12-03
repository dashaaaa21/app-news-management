import {
    type Ref,
    type SVGProps,
    forwardRef,
    memo,
    type MemoExoticComponent,
    type ForwardRefExoticComponent,
} from 'react';

const SvgComponent = (
    props: SVGProps<SVGSVGElement>,
    ref: Ref<SVGSVGElement>,
) => (
    <svg
        fill="none"
        height={24}
        ref={ref}
        viewBox="0 0 24 24"
        width={24}
        color="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C12.55 4 13 4.45 13 5V11H19C19.55 11 20 11.45 20 12C20 16.41 16.41 20 12 20Z"
            fill="currentColor"
        />
        <path
            d="M15 2.05C18.18 3.07 20.5 5.94 20.95 9.45C20.98 9.75 20.75 10 20.45 10H15.5C15.22 10 15 9.78 15 9.5V2.55C15 2.25 15.25 2.02 15.55 2.05H15Z"
            fill="currentColor"
        />
    </svg>
);

const ChartDonutIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default ChartDonutIcon;
