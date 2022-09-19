import { worldDataState } from '@src/renderer/data/world';
import getSheetWorldData from '@src/renderer/utils/getSheetWorldData';
import {
  addEditSheetToMain,
  getWorldDataToMain,
} from '@src/renderer/utils/ipc/editSheetToMain';
import {
  getVrchatlabWorldsToMain,
  getVrchatRecentWorldsToMain,
} from '@src/renderer/utils/ipc/vrchatAPIToMain';
import { World, WorldEditInput, WorldVrcRaw } from '@src/types';
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

const LIMIT = 30;

interface HookMember {
  isLoading: boolean;
  currentTableData: WorldVrcRaw[];
  currentPage: number;
  infoModalWorld?: WorldVrcRaw;
  addModalWorld?: WorldVrcRaw;
  typeList: string[];

  onClickRefresh(): void;
  onChangePage(page: number, pageSize: number): void;
  onOpenAddWorldModal(world: WorldVrcRaw): void;
  onCloseAddWorldModal(): void;
  onOpenWorldInfoModal(world: WorldVrcRaw): void;
  onCloseWorldInfoModal(): void;
  onAddWorld(world: WorldEditInput): void;
  onClickLoadMore(): void;
}

const useWorldLabPage = (): HookMember => {
  const [worldData, setWorldData] = useRecoilState(worldDataState);
  const [newWorlds, setNewWorlds] = useState<WorldVrcRaw[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryOffset, setQueryOffset] = useState(0);
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
    getVrchatlabWorldsToMain(0, LIMIT).then((w) => {
      setNewWorlds(w);
      setIsLoading(false);
      setQueryOffset(0 + LIMIT);
    });
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

    onClickRefresh(): void {
      setIsLoading(true);
      getVrchatRecentWorldsToMain().then((w) => {
        setNewWorlds(w);
        setIsLoading(false);
      });
    },
    onChangePage(page: number, pageSize: number): void {
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
      getVrchatlabWorldsToMain(queryOffset, LIMIT).then((w) => {
        setNewWorlds((old) => old.concat(w));
        setIsLoading(false);
        setQueryOffset(queryOffset + LIMIT);
      });
    },
  };
  return hookMember;
};
export default useWorldLabPage;
