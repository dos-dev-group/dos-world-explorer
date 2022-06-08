import { worldFavoritesState } from '@src/renderer/data/favorites';
import { World } from '@src/types';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

interface HookMember {
  onOpenBookmarkModal(world: World): void;
  onCloseBookmarkModal(): void;
  onAddBookmarkType(bookmarkType: string): void;
  onRemoveBookmarkType(bookmarkType: string): void;
  onBookmarkWorld(bookmarkType: string): void;

  isBookmarkedWorld(world: World): boolean;

  isOpenBookmarkModal: boolean;
  bookmarkTypes: string[];
}

const useBookmark = (): HookMember => {
  const [selectedWorld, setSelectedWorld] = useState<World>();
  const [recoilBookmarks, setRecoilBookmarks] =
    useRecoilState(worldFavoritesState);

  const hookMember: HookMember = {
    onOpenBookmarkModal(world: World): void {
      setSelectedWorld(world);
    },
    onCloseBookmarkModal(): void {
      setSelectedWorld(undefined);
    },
    onAddBookmarkType(bookmarkType: string): void {},
    onRemoveBookmarkType(bookmarkType: string): void {
      throw new Error('Function not implemented.');
    },
    onBookmarkWorld(bookmarkType: string): void {
      throw new Error('Function not implemented.');
    },
    isBookmarkedWorld(world: World): boolean {
      throw new Error('Function not implemented.');
    },
    isOpenBookmarkModal: false,
    bookmarkTypes: [],
  };

  return hookMember;
};
