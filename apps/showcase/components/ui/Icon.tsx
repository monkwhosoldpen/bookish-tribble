import { cn } from '@/registry/nativewind/lib/utils';
import { cssInterop } from 'nativewind';
import * as React from 'react';

type IconProps = {
    as: any;
    className?: string;
    size?: number;
    color?: string;
    name?: string;
    [key: string]: any;
};

function IconImpl({ as: IconComponent, ...props }: IconProps) {
    return <IconComponent {...props} />;
}

cssInterop(IconImpl, {
    className: {
        target: 'style',
        nativeStyleToProp: {
            height: 'size',
            width: 'size',
        },
    },
});

export function Icon({ as: IconComponent, className, size = 14, name, ...props }: IconProps) {
    return (
        <IconImpl
            as={IconComponent}
            name={name}
            className={cn('text-foreground', className)}
            size={size}
            {...props}
        />
    );
}
