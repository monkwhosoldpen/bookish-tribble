import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)] || 'Default message';
}
