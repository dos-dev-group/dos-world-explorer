import { WorldData } from '@src/types';
import { atom } from 'recoil';

export const worldDataState = atom<WorldData | undefined>({
  key: 'worldDataState',
  default: undefined,
});

export const searchTextState = atom<string>({
  key: 'searchTextState',
  default: '',
});
