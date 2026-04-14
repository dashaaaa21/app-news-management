import * as Select from '@radix-ui/react-select';
import * as React from 'react';
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
} from 'react';
import ArrowDown from '../../icons/ArrowDown';

export type Option<TValue extends string = string> = {
    label: string;
    value: TValue;
};

type SelectContentProps = React.ComponentPropsWithoutRef<typeof Select.Content>;
type OnCloseAutoFocusEvent = Parameters<
    NonNullable<SelectContentProps['onCloseAutoFocus']>
>[0];

const SelectItem = forwardRef<
    ComponentRef<typeof Select.Item>,
    ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, ...props }, forwardedRef) => {
    return (
        <Select.Item
            className="px-4 py-2 rounded-md cursor-pointer outline-none select-none hover:bg-[#c5f06d] text-[#2d2d2d]"
            {...props}
            ref={forwardedRef}
        >
            <Select.ItemText>{children}</Select.ItemText>
            <Select.ItemIndicator className="SelectItemIndicator"></Select.ItemIndicator>
        </Select.Item>
    );
});

SelectItem.displayName = 'SelectItem';

export type SelectComponentType<TValue extends string = string> = Omit<
    React.ComponentPropsWithoutRef<typeof Select.Root>,
    'children' | 'value' | 'defaultValue' | 'onValueChange'
> & {
    onChange: (item: TValue) => void;
    value: TValue;
    options: readonly Option<TValue>[];
    placeholder?: string;
    className?: string;
};

export const SelectComponent = <TValue extends string = string>({
    onChange,
    value,
    options,
    placeholder = 'Select option',
    ...props
}: SelectComponentType<TValue>) => {
    const pointerRef = React.useRef(false);

    return (
        <Select.Root
            {...props}
            value={value}
            onValueChange={(value) => onChange(value as TValue)}
        >
            <Select.Trigger
                onPointerDown={() => (pointerRef.current = true)}
                onKeyDown={() => (pointerRef.current = false)}
                className="group w-full h-9 px-4 py-2 gap-2 rounded-[14px] border border-[#d8e0f0] flex items-center justify-between cursor-pointer bg-white text-[#7d8592] transition hover:border-[#C7C7C7] outline-none focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#d8e0f0] focus-visible:ring-offset-2"
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon className="transition-transform duration-200 group-data-[state=open]:rotate-180">
                    <ArrowDown className="w-4 h-4" />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content
                    side="bottom"
                    align="start"
                    sideOffset={8}
                    position="popper"
                    avoidCollisions={false}
                    className="z-50 w-[var(--radix-select-trigger-width)] rounded-[10px] shadow-lg overflow-hidden bg-[#CEFF7D] border border-[#C7C7C7]"
                    onCloseAutoFocus={(e: OnCloseAutoFocusEvent) => {
                        if (pointerRef.current) {
                            e.preventDefault();
                            pointerRef.current = false;
                        }
                    }}
                >
                    <Select.ScrollUpButton></Select.ScrollUpButton>
                    <Select.Viewport>
                        <Select.Group>
                            {options.map((item) => {
                                return (
                                    <SelectItem
                                        key={item.label}
                                        value={item.value}
                                    >
                                        <div>{item.label}</div>
                                    </SelectItem>
                                );
                            })}
                        </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton></Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};
