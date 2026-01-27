import { cn } from '@/registry/lib/utils';
import * as React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import { Platform } from 'react-native';

const DEFAULT_HIT_SLOP = 24;

function Checkbox({
  className,
  checkedClassName,
  indicatorClassName,
  iconClassName,
  ...props
}: CheckboxPrimitive.RootProps & {
  checkedClassName?: string;
  indicatorClassName?: string;
  iconClassName?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'border-input dark:bg-input/30 size-4 shrink-0 rounded-[4px] border shadow-sm shadow-black/5',
        Platform.select({
          web: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          default: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        }),
        props.checked && checkedClassName,
        props.disabled && 'opacity-50',
        className
      )}
      hitSlop={DEFAULT_HIT_SLOP}
      {...props}>
      <CheckboxPrimitive.Indicator
        className={cn('bg-primary h-full w-full items-center justify-center', indicatorClassName)}>
        <MaterialIcons name="check" size={16} className="text-primary-foreground" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
