import {
  ArrowUpRightIcon,
  LightbulbIcon,
  WavesIcon,
  type LucideIcon,
} from 'lucide-react';

export const NOTIFICATION_TYPES = ['WELCOME', 'NEW_FEATURE', 'FEATURE_UPDATE'] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_DESCRIPTIONS: Record<
  NotificationType,
  {
    title: string;
    settingsDescription: string;
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
  }
> = {
  WELCOME: {
    title: 'Welcome',
    settingsDescription: 'Welcome message for new users',
    icon: WavesIcon,
    bgColor: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-500',
  },
  NEW_FEATURE: {
    title: 'New Feature',
    settingsDescription: 'A new feature has been added to the app',
    icon: LightbulbIcon,
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-500',
  },
  FEATURE_UPDATE: {
    title: 'Feature Update',
    settingsDescription: 'A feature has been updated',
    icon: ArrowUpRightIcon,
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-500',
  },
} as const;
