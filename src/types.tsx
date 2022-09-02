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
  [bookmarkType: string]: string[];
}

export enum EditResult {
  SUCCESS = 0,
  UNKNOWN = 1,
  PROTECTED = 2,
  ALREADYEXIST = 3,
  NOTEXIST = 4,
}
