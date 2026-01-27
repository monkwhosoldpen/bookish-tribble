// Sample data for better UX demonstration

export interface ChatItem {
  id: string;
  username: string;
  lastMessage: string;
  timestamp: string;
  isOnline?: boolean;
  unreadCount?: number;
  avatar?: string;
}

export interface ExploreItem {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  followers: number;
  posts: number;
  isVerified: boolean;
  tags: string[];
  avatar?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'ios' | 'android' | 'web';
  lastSeen: string;
  isActive: boolean;
}

// Sample chat data
export const sampleChats: ChatItem[] = [
  {
    id: '1',
    username: 'techguru',
    lastMessage: 'Just shipped a new feature! 🚀',
    timestamp: '2m ago',
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: '2',
    username: 'designpro',
    lastMessage: 'Check out this new design system',
    timestamp: '15m ago',
    isOnline: true,
  },
  {
    id: '3',
    username: 'reactdev',
    lastMessage: 'Anyone up for a code review?',
    timestamp: '1h ago',
    unreadCount: 1,
  },
  {
    id: '4',
    username: 'uxmaster',
    lastMessage: 'Great UX article on mobile patterns',
    timestamp: '2h ago',
  },
  {
    id: '5',
    username: 'nodeexpert',
    lastMessage: 'Performance tips for Node.js apps',
    timestamp: '3h ago',
    isOnline: false,
  },
];

// Sample explore data
export const sampleExploreData: ExploreItem[] = [
  {
    id: '1',
    username: 'reactdev',
    displayName: 'React Developer',
    bio: 'Sharing React tips, tricks, and best practices. Building amazing web experiences.',
    followers: 15420,
    posts: 342,
    isVerified: true,
    tags: ['react', 'javascript', 'webdev'],
  },
  {
    id: '2',
    username: 'designpro',
    displayName: 'Design Professional',
    bio: 'UI/UX designer creating beautiful and functional interfaces. Design systems enthusiast.',
    followers: 12300,
    posts: 256,
    isVerified: true,
    tags: ['design', 'ui', 'ux', 'figma'],
  },
  {
    id: '3',
    username: 'techguru',
    displayName: 'Tech Guru',
    bio: 'Full-stack developer sharing insights on modern web development. Coffee addict ☕',
    followers: 28900,
    posts: 567,
    isVerified: true,
    tags: ['webdev', 'javascript', 'nodejs'],
  },
  {
    id: '4',
    username: 'mobileexpert',
    displayName: 'Mobile Expert',
    bio: 'React Native and Flutter developer. Creating amazing mobile experiences.',
    followers: 8900,
    posts: 189,
    isVerified: false,
    tags: ['reactnative', 'flutter', 'mobile'],
  },
  {
    id: '5',
    username: 'aiinnovator',
    displayName: 'AI Innovator',
    bio: 'Exploring the frontiers of artificial intelligence and machine learning.',
    followers: 45600,
    posts: 892,
    isVerified: true,
    tags: ['ai', 'ml', 'python', 'tensorflow'],
  },
];

// Sample devices data
export const sampleDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    type: 'ios',
    lastSeen: 'Active now',
    isActive: true,
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'web',
    lastSeen: '5m ago',
    isActive: false,
  },
  {
    id: '3',
    name: 'Samsung Galaxy',
    type: 'android',
    lastSeen: '1h ago',
    isActive: false,
  },
];

// Utility functions for generating realistic timestamps
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

// Generate sample messages
export function generateSampleMessage(): string {
  const messages = [
    'Just shipped a new feature! 🚀',
    'Check out this new design system',
    'Anyone up for a code review?',
    'Great UX article on mobile patterns',
    'Performance tips for Node.js apps',
    'New blog post is live!',
    'Working on something exciting...',
    'Coffee break! ☕',
    'Issue resolved! ✅',
    'Weekend project complete!',
  ];
  return messages[Math.floor(Math.random() * messages.length)] || 'Default message';
}
