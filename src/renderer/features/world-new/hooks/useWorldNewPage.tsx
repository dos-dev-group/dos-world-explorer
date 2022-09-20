import { worldDataState } from '@src/renderer/data/world';
import getSheetWorldData from '@src/renderer/utils/getSheetWorldData';
import {
  addEditSheetToMain,
  getWorldDataToMain,
} from '@src/renderer/utils/ipc/editSheetToMain';
import {
  getVrchatNewWorldsToMain,
  getVrchatRecentWorldsToMain,
} from '@src/renderer/utils/ipc/vrchatAPIToMain';
import { World, WorldEditInput, WorldVrcRaw } from '@src/types';
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

interface HookMember {
  isLoading: boolean;
  currentTableData: WorldVrcRaw[];
  currentPage: number;
  infoModalWorld?: WorldVrcRaw;
  addModalWorld?: WorldVrcRaw;
  typeList: string[];
  canLoadMore: boolean;
  queryLimit: number;

  onClickRefresh(): void;
  onChangePage(page: number): void;
  onOpenAddWorldModal(world: WorldVrcRaw): void;
  onCloseAddWorldModal(): void;
  onOpenWorldInfoModal(world: WorldVrcRaw): void;
  onCloseWorldInfoModal(): void;
  onAddWorld(world: WorldEditInput): void;
  onClickLoadMore(): void;
  onChangeQueryLimit(limit: number): void;
}

const useWorldNewPage = (): HookMember => {
  const [worldData, setWorldData] = useRecoilState(worldDataState);
  const [newWorlds, setNewWorlds] = useState<WorldVrcRaw[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryOffset, setQueryOffset] = useState(0);
  const [queryLimit, setQueryLimit] = useState(30);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [infoModalWorld, setInfoModalWorld] = useState<WorldVrcRaw>();
  const [addModalWorld, setAddModalWorld] = useState<WorldVrcRaw>();

  useEffect(() => {
    if (worldData === undefined) {
      getWorldDataToMain().then((data) => {
        return setWorldData(data);
      });
    }
  }, [setWorldData, worldData]);

  useEffect(() => {
    getVrchatNewWorldsToMain(0, queryLimit).then((w) => {
      setNewWorlds(w);
      setIsLoading(false);
      setQueryOffset(0 + queryLimit);
      if (w.length < queryLimit) {
        setCanLoadMore(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeList = useMemo(
    () =>
      worldData?.reduce((acc, cur) => {
        if (acc.find((e) => e === cur.type)) {
          return acc;
        }
        return acc.concat(cur.type);
      }, [] as string[]) || [],
    [worldData],
  );

  const hookMember: HookMember = {
    isLoading,
    currentTableData: newWorlds,
    currentPage,
    infoModalWorld,
    addModalWorld,
    typeList,
    canLoadMore,
    queryLimit,

    onClickRefresh(): void {
      setIsLoading(true);
      getVrchatRecentWorldsToMain(0, queryLimit).then((w) => {
        setQueryOffset(queryLimit);
        setNewWorlds(w);
        setIsLoading(false);
        setCanLoadMore(true);
      });
    },
    onChangePage(page: number): void {
      setCurrentPage(page);
    },
    onOpenAddWorldModal(world: WorldVrcRaw): void {
      setAddModalWorld(world);
    },
    onCloseAddWorldModal(): void {
      setAddModalWorld(undefined);
    },
    onOpenWorldInfoModal(world: WorldVrcRaw): void {
      setInfoModalWorld(world);
    },
    onCloseWorldInfoModal(): void {
      setInfoModalWorld(undefined);
    },
    onAddWorld(world: WorldEditInput): void {
      addEditSheetToMain(world)
        .then(() => message.info('월드가 추가되었습니다'))
        .then(() => getWorldDataToMain())
        .then((data) => setWorldData(data))
        .catch((e: Error) => message.error(e.toString()));
    },
    onClickLoadMore(): void {
      setIsLoading(true);
      getVrchatNewWorldsToMain(queryOffset, queryLimit).then((w) => {
        setNewWorlds((old) => old.concat(w));
        setIsLoading(false);
        setQueryOffset(queryOffset + queryLimit);
        if (w.length < queryLimit) {
          setCanLoadMore(false);
        }
      });
    },
    onChangeQueryLimit(limit: number): void {
      setQueryLimit(limit);
    },
  };
  return hookMember;
};
export default useWorldNewPage;
