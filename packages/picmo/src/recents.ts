import { EmojiRecord } from './types';

const LOCAL_STORAGE_KEY = 'PicMo:recents';

export function clear(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function getRecents(maxCount: number): Array<EmojiRecord> {
  const recents = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '[]');
  return recents.slice(0, maxCount);
}

export function addOrUpdateRecent(emoji: EmojiRecord, maxCount: number) {
  // Add the new recent to the beginning of the list, removing it if it exists already
  const recents = [
    emoji,
    ...getRecents(maxCount).filter(recent => recent.hexcode !== emoji.hexcode)
  ].slice(0, maxCount);
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recents));
}