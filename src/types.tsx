import { FavoriteGroup, LimitedWorld } from 'vrchat';

export interface World {
  key: string; // 월드 고유ID
  name: string;
  author: string;
  description: string;
  tags: string[];
  score: number;
  url: string;
  imageUrl: string;
  date: Date;
  type: string;
}

export type WorldPartialNonVrcInfo = Partial<World> & WorldVrcRaw;
export type WorldEditInput = Pick<
  World,
  'url' | 'description' | 'tags' | 'score' | 'type'
>;

export function isWorldEditInput(obj: any): obj is WorldEditInput {
  return (
    Object.keys(obj).sort().join(' ') === 'description score tags type url'
  );
}

export type WorldEditOutput = Omit<
  World,
  'url' | 'description' | 'tags' | 'score' | 'type'
>;

export type WorldVrcRaw = Omit<
  World,
  'description' | 'tags' | 'score' | 'date' | 'type'
>;

export interface SheetSuggestWorld {
  key: string; // 유니크한 ID
  name: string;
  author: string;
  description: string;
  tags: string[];
  score: number;
  url: string;
  imageUrl: string;
  date: Date;
  reviewer: string;
}

export interface TagStyle {
  tag: string;
  content: string[];
  color: string;
}

export interface DosFavoriteWorldGroup {
  groupInfo: FavoriteGroup;
  favorites: LimitedWorld[];
}

// export interface User {
//   name: string; // 유저이름
//   id: string; // 유저 아이디
//   currentAvatarThumbnailImageUrl: string; // 유저 이미지
//   userIcon?: string; //유저 아이콘
//   state: UserState; // 유저 상태
// }
// export enum UserState {
//   OFFLINE = 'offline',
//   ONLINE = 'online',
//   JOIN_ME = 'join me',
//   ASK_ME = 'ask me',
//   BUSY = 'busy',
//   ACTIVE = 'active',
// }

export interface UserLogin {
  name: string; // 유저이름
  password: string; // 비밀번호
  code?: string; // Two Factors Authentication OTP 코드
}

export type WorldData = World[];

export interface Bookmarks {
  [worldKeys: string]: string[];
}

export enum EditResult {
  SUCCESS = 0,
  UNKNOWN = 1,
  PROTECTED = 2,
  ALREADYEXIST = 3,
  NOTEXIST = 4,
  TYPEERROR = 5,
}
function test(): string {
  return 'resr';
}

// export interface WorldEditInput {
//   description: string;
//   tags: string[];
//   score: number;
//   type: string;
//   url: string;
// }

export interface World extends SheetBaseType {
  name: string;
  author: string;
  description: string;
  tags: string[];
  score: number;
  url: string;
  imageUrl: string;
  date: Date;
  type: string;
}

export function isWorld(obj: any): obj is World {
  return (
    Object.keys(obj).sort().join(' ') ===
    'author date description imageUrl key name score tags type url'
  );
}

export interface TagStyle extends SheetBaseType {
  tag: string;
  content: string[];
  color: string;
}
export function isTagStyle(obj: any): obj is TagStyle {
  return Object.keys(obj).sort().join(' ') === 'color content key tag';
}

export interface SuggestWorld extends SheetBaseType {
  name: string;
  author: string;
  description: string;
  tags: string[];
  score: number;
  url: string;
  imageUrl: string;
  date: Date;
  checker: string;
}
export function isSuggestWorld(obj: any): obj is SuggestWorld {
  return (
    Object.keys(obj).sort().join(' ') ===
    'author checker date description imageUrl key name score tags url'
  );
}

export interface SuggestWorldEditInput {
  name: string;
  author: string;
  description: string;
  tags: string[];
  score: number;
}
export function isSuggestWorldEditInput(obj: any): obj is SuggestWorld {
  return Object.keys(obj).sort().join(' ') === 'description score tags url';
}
