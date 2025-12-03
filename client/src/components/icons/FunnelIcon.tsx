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
            d="M4.24 5.61C3.45 6.39 3 7.5 3 8.66V9.5C3 10.33 3.33 11.12 3.92 11.71L9 16.79V21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V16.79L20.08 11.71C20.67 11.12 21 10.33 21 9.5V8.66C21 7.5 20.55 6.39 19.76 5.61L18.66 4.5H5.34L4.24 5.61Z"
            fill="currentColor"
        />
    </svg>
);

const FunnelIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default FunnelIcon;
