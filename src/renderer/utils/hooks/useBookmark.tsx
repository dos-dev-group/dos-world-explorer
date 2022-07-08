import { worldBookmarksState } from '@src/renderer/data/bookmarks';
import copyDeep from '@src/renderer/utils/copyDeep';
import { World } from '@src/types';
import { message } from 'antd';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

interface HookMember {
  onClickOpenBookmarkModal(world: World): void;
  onCloseBookmarkModal(): void;
  onAddBookmarkType(bookmarkType: string): void;
  onEditBookmarkType(oldType: string, newType: string): void;
  onRemoveBookmarkType(bookmarkType: string): void;
  onAddBookmarkWorld(bookmarkType: string): void;
  onRemoveBookmarkWorld(bookmarkType: string): void;
  onChangeBookmarkWorld(bookmarkTypes: string[]): void;
  onFrontSwapWorld(bookmarkType: string, world: World): void;
  onRearSwapWorld(bookmarkType: string, world: World): void;

  checkIsSomewhereBookmarkedWorld(world: World): boolean;

  isOpenBookmarkModal: boolean;
  bookmarkTypes: string[];
  worldTypes: string[] | undefined;
}

const useBookmark = (): HookMember => {
  const [bookmarkTargetWorld, setBookmarkTargetWorld] = useState<World>();
  const [recoilBookmarks, setRecoilBookmarks] =
    useRecoilState(worldBookmarksState);

  const hookMember: HookMember = {
    onClickOpenBookmarkModal(world: World): void {
      setBookmarkTargetWorld(world);
    },
    onCloseBookmarkModal(): void {
      setBookmarkTargetWorld(undefined);
    },
    onAddBookmarkType(bookmarkType: string): void {
      if (!recoilBookmarks) return;
      if (Object.keys(recoilBookmarks).find((e) => e === bookmarkType)) {
        message.error('이미 동일 북마크가 있습니다.');
        return;
      }
      if (bookmarkType.trim() === '') {
        message.error('적합한 이름이 아닙니다.');
        return;
      }

      setRecoilBookmarks((b) => {
        const clone = copyDeep(b)!;
        clone[bookmarkType] = [];
        return clone;
      });
    },
    onEditBookmarkType(oldType: string, newType: string): void {
      if (!recoilBookmarks) return;
      if (!Object.keys(recoilBookmarks).find((e) => e === oldType)) {
        message.error('해당 북마크가 없습니다.');
        return;
      }
      if (Object.keys(recoilBookmarks).find((e) => e === newType)) {
        message.error('이미 동일 북마크가 있습니다.');
        return;
      }
      if (newType.trim() === '') {
        message.error('적합한 이름이 아닙니다.');
        return;
      }

      setRecoilBookmarks((b) => {
        const clone = copyDeep(b)!;
        const temp = clone[oldType].concat();
        delete clone[oldType];
        clone[newType] = temp;
        return clone;
      });
    },
    onRemoveBookmarkType(bookmarkType: string): void {
      if (!recoilBookmarks) return;
      if (!Object.keys(recoilBookmarks).find((e) => e === bookmarkType)) {
        message.error('해당 북마크가 없습니다.');
        return;
      }
      if (bookmarkType.trim() === '') {
        message.error('적합한 이름이 아닙니다.');
        return;
      }

      setRecoilBookmarks((b) => {
        const clone = copyDeep(b)!;
        delete clone[bookmarkType];
        return clone;
      });
    },
    onAddBookmarkWorld(bookmarkType: string): void {
      if (!bookmarkTargetWorld) return;
      if (!recoilBookmarks) return;

      setRecoilBookmarks((b) => {
        const clone = copyDeep(b)!;
        clone[bookmarkType].push(bookmarkTargetWorld.key);
        return clone;
      });
    },
    onRemoveBookmarkWorld(bookmarkType: string): void {
      if (!bookmarkTargetWorld) return;
      if (!recoilBookmarks) return;

      setRecoilBookmarks((b) => {
        const clone = copyDeep(b)!;
        clone[bookmarkType] = clone[bookmarkType].filter(
          (key) => key !== bookmarkTargetWorld.key,
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
      deleteTarget.forEach((t) => this.onRemoveBookmarkWorld(t));
      // 북마크 추가
      const addTarget = types.filter(
        (be) => !this.worldTypes!.find((te) => te === be),
      );
      addTarget.forEach((t) => this.onAddBookmarkWorld(t));
    },

    isOpenBookmarkModal: bookmarkTargetWorld ? true : false,
    bookmarkTypes: recoilBookmarks ? Object.keys(recoilBookmarks) : [],
    worldTypes: recoilBookmarks
      ? Object.keys(recoilBookmarks).filter(
          (key) =>
            recoilBookmarks[key].filter(
              (worldKey) => worldKey === bookmarkTargetWorld?.key,
            ).length > 0,
        )
      : undefined,
    onFrontSwapWorld(bookmarkType: string, world: World): void {
      if (!recoilBookmarks) return;

      const curTypeWorlds = recoilBookmarks[bookmarkType].concat();
      const targetIndex = curTypeWorlds.findIndex((e) => e === world.key);

      if (targetIndex === -1) {
        message.error('해당 월드가 북마크에 없습니다.');
      }
      if (targetIndex === 0) {
        message.error('조건이 맞지 않습니다.');
      }

      const temp = curTypeWorlds[targetIndex - 1];
      curTypeWorlds[targetIndex - 1] = curTypeWorlds[targetIndex];
      curTypeWorlds[targetIndex] = temp;

      setRecoilBookmarks((val) => {
        if (val) {
          const clone = { ...val };
          clone[bookmarkType] = curTypeWorlds;
          return clone;
        }
        return val;
      });
    },
    onRearSwapWorld(bookmarkType: string, world: World): void {
      if (!recoilBookmarks) return;

      const curTypeWorlds = recoilBookmarks[bookmarkType].concat();
      const targetIndex = curTypeWorlds.findIndex((e) => e === world.key);

      if (targetIndex === -1) {
        message.error('해당 월드가 북마크에 없습니다.');
      }
      if (targetIndex === curTypeWorlds.length - 1) {
        message.error('조건이 맞지 않습니다.');
      }

      const temp = curTypeWorlds[targetIndex + 1];
      curTypeWorlds[targetIndex + 1] = curTypeWorlds[targetIndex];
      curTypeWorlds[targetIndex] = temp;

      setRecoilBookmarks((val) => {
        if (val) {
          const clone = { ...val };
          clone[bookmarkType] = curTypeWorlds;
          return clone;
        }
        return val;
      });
    },
  };
  return hookMember;
};
export default useBookmark;
