import { type } from 'os';
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
export function isWorld(obj: any): obj is World {
  return (
    Object.keys(obj).sort().join(' ') ===
    'author date description imageUrl key name score tags type url'
  );
}
export type WorldPartial = Partial<World> & Pick<World, 'key'>;
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

export interface TagStyle {
  tag: string;
  content: string[];
  color: string;
  key: string;
}
export function isTagStyle(obj: any): obj is TagStyle {
  return Object.keys(obj).sort().join(' ') === 'color content key tag';
}

export type TagStyleInput = Pick<TagStyle, 'tag' | 'content' | 'color'>;

export function isTagStyleInput(obj: any): obj is TagStyle {
  return Object.keys(obj).sort().join(' ') === 'color content tag';
}

export interface CheckerWorld {
  key: string;
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

export function isCheckerWorld(obj: any): obj is CheckerWorld {
  return (
    Object.keys(obj).sort().join(' ') ===
    'author checker date description imageUrl key name score tags url'
  );
}

export type CheckerWorldEditInput = Pick<
  CheckerWorld,
  'description' | 'tags' | 'score' | 'url' | 'checker'
>;

export function isCheckerWorldEditInput(obj: any): obj is CheckerWorld {
  return (
    Object.keys(obj).sort().join(' ') === 'checker description score tags url'
  );
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
export type CheckerWorldData = CheckerWorld[];
export type TagStyleData = TagStyle[];

export interface Bookmarks {
  [bookmarkType: string]: string[];
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
