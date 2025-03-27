import { User } from 'lucia';
import { GradientBubble } from './gradient-bubble';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface UserAvatarProps {
  user: User;
  size?: number;
  className?: string;
  asChild?: boolean;
  linkHref?: string;
}

export function UserAvatar({
  user,
  size = 32,
  className,
  asChild = false,
  linkHref,
}: UserAvatarProps) {
  const avatarContent = user.image ? (
    <Avatar style={{ width: size, height: size }}>
      <AvatarImage src={user.image} alt={user.firstName || user.email} />
      <AvatarFallback>
        <GradientBubble seed={user.id} size={size} />
      </AvatarFallback>
    </Avatar>
  ) : (
    <GradientBubble
      seed={user.id}
      size={size}
      className={cn(
        'border border-border dark:border-0 shadow-xs hover:opacity-80 transition-opacity duration-100 rounded-full',
        className,
      )}
    />
  );

  // If asChild is true, let the parent component handle rendering
  if (asChild) {
    return <Slot className={className}>{avatarContent}</Slot>;
  }

  // If linkHref is provided, wrap in a Link
  if (linkHref) {
    return (
      <Link href={linkHref} className={cn('cursor-pointer', className)}>
        {avatarContent}
      </Link>
    );
  }

  // Default rendering
  return <div className={className}>{avatarContent}</div>;
}
