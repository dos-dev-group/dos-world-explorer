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

export type WorldPartial = Partial<World>;
export type WorldEditInput = Pick<
  World,
  'url' | 'description' | 'tags' | 'score' | 'type'
>;
export type WorldEditOutput = Omit<
  World,
  'url' | 'description' | 'tags' | 'score' | 'type'
>;

export type WorldData = World[];

export interface Favorites {
  [favName: string]: World[];
}

export enum EditResult {
  SUCCESS = 0,
  UNKNOWN = 1,
  PROTECTED = 2,
  ALREADYEXIST = 3,
  NOTEXIST = 4,
}
