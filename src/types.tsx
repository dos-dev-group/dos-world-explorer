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
export type WorldInput = Pick<
  World,
  'url' | 'description' | 'tags' | 'score' | 'type'
>;
export type WorldOutput = Omit<
  World,
  'url' | 'description' | 'tags' | 'score' | 'type'
>;

export type WorldData = World[];

export enum WorldSortOrder {
  NONE,
  SCORE,
  AUTHOR,
}

export enum EditResult {
  SUCCESS = 0,
  UNKNOWN = 1,
  PROTECTED = 2,
  ALREADYEXIST = 3,
  NOTEXIST = 4,
}
