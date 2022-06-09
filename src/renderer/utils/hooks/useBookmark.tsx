import { worldBookmarksState } from '@src/renderer/data/bookmarks';
import copyDeep from '@src/renderer/utils/copyDeep';
import { World } from '@src/types';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

interface HookMember {
  onClickOpenBookmarkModal(world: World): void;
  onCloseBookmarkModal(): void;
  onAddBookmarkType(bookmarkType: string): void;
  onRemoveBookmarkType(bookmarkType: string): void;
  onAddBookmarkWorld(bookmarkType: string): void;
  onRemoveBookmarkWorld(bookmarkType: string): void;
  onChangeBookmarkWorld(bookmarkTypes: string[]): void;

  checkIsSomewhereBookmarkedWorld(world: World): boolean;

  isOpenBookmarkModal: boolean;
  bookmarkTypes: string[];
  worldTypes: string[] | undefined;
}

const useBookmark = (): HookMember => {
  const [selectedWorld, setSelectedWorld] = useState<World>();
  const [recoilBookmarks, setRecoilBookmarks] =
    useRecoilState(worldBookmarksState);

  const hookMember: HookMember = {
    onClickOpenBookmarkModal(world: World): void {
      setSelectedWorld(world);
    },
    onCloseBookmarkModal(): void {
      setSelectedWorld(undefined);
    },
    onAddBookmarkType(bookmarkType: string): void {
      if (!recoilBookmarks) return;

      setRecoilBookmarks((b) => {
        const clone = copyDeep(b)!;
        clone[bookmarkType] = [];
        return clone;
      });
    },
    onRemoveBookmarkType(bookmarkType: string): void {
      if (!recoilBookmarks) return;

      setRecoilBookmarks((b) => {
        const clone = copyDeep(b)!;
        delete clone[bookmarkType];
        return clone;
      });
    },
    onAddBookmarkWorld(bookmarkType: string): void {
      if (!selectedWorld) return;
      if (!recoilBookmarks) return;

      setRecoilBookmarks((b) => {
        const clone = copyDeep(b)!;
        clone[bookmarkType].push(selectedWorld.key);
        return clone;
      });
    },
    onRemoveBookmarkWorld(bookmarkType: string): void {
      if (!selectedWorld) return;
      if (!recoilBookmarks) return;

      setRecoilBookmarks((b) => {
        const clone = copyDeep(b)!;
        clone[bookmarkType] = clone[bookmarkType].filter(
          (key) => key !== selectedWorld.key,
        );
        return clone;
      });
    },

    checkIsSomewhereBookmarkedWorld(world: World): boolean {
      if (!recoilBookmarks) return false;

      const isMarked =
        Object.keys(recoilBookmarks).filter(
          (key) =>
            recoilBookmarks[key].filter((worldKey) => worldKey === world.key)
              .length > 0,
        ).length > 0;
      return isMarked;
    },
    onChangeBookmarkWorld(types: string[]): void {
      if (this.worldTypes === undefined) return;

      // 북마크 삭제
      const deleteTarget = this.worldTypes.filter(
        (be) => !types.find((te) => te === be),
      );
      console.log('deleteTarget', deleteTarget);
      deleteTarget.forEach((t) => this.onRemoveBookmarkWorld(t));
      // 북마크 추가
      const addTarget = types.filter(
        (be) => !this.worldTypes!.find((te) => te === be),
      );
      console.log('addTarget', addTarget);
      addTarget.forEach((t) => this.onAddBookmarkWorld(t));
    },

    isOpenBookmarkModal: selectedWorld ? true : false,
    bookmarkTypes: recoilBookmarks ? Object.keys(recoilBookmarks) : [],
    worldTypes: recoilBookmarks
      ? Object.keys(recoilBookmarks).filter(
          (key) =>
            recoilBookmarks[key].filter(
              (worldKey) => worldKey === selectedWorld?.key,
            ).length > 0,
        )
      : undefined,
  };
  return hookMember;
};
export default useBookmark;
