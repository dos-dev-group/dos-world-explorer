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
export type WorldInput = Pick<World, 'url' | 'description' | 'tags' | 'score'>;
export type WorldOutput = Omit<World, 'url' | 'description' | 'tags' | 'score'>;

export type WorldData = World[];

export enum WorldSortOrder {
  NONE,
  SCORE,
  AUTHOR,
}
