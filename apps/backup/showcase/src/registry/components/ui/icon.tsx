import { cn } from '@/registry/lib/utils';
import { cssInterop } from 'nativewind';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

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

/**
 * A wrapper component for Expo Vector Icons with Nativewind `className` support via `cssInterop`.
 *
 * This component allows you to render any Expo Vector Icon while applying utility classes
 * using `nativewind`. It supports MaterialIcons, Ionicons, FontAwesome, and AntDesign.
 *
 * @component
 * @example
 * ```tsx
 * import MaterialIcons from '@expo/vector-icons/MaterialIcons';
 * import { Icon } from '@/registry/components/ui/icon';
 *
 * <Icon as={MaterialIcons} name="arrow-forward" className="text-red-500" size={16} />
 * ```
 *
 * @param {any} as - The Expo Vector Icon component to render.
 * @param {string} name - The icon name (required for Expo Vector Icons).
 * @param {string} className - Utility classes to style the icon using Nativewind.
 * @param {number} size - Icon size (defaults to 14).
 * @param {...any} ...props - Additional icon props passed to the "as" icon.
 */
function Icon({ as: IconComponent, className, size = 14, name, ...props }: IconProps) {
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

export { Icon, MaterialIcons, Ionicons, FontAwesome, AntDesign };
