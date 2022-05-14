export interface World {
  key: string; // 월드 고유ID
  name: string;
  author: string;
  description: string;
  tags: string[];
  score: number;
  url: string;
  imageUrl: string;
}

export interface WorldSheet {
  type: string; // ex: 풍경담화탐험기능VRMV게임아바타사이코소실
  worlds: World[];
}

export type WorldData = WorldSheet[];

export enum WorldSortOrder {
  NONE,
  SCORE,
  AUTHOR,
}
