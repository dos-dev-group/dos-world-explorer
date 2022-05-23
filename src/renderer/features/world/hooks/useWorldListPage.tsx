import { worldDataState } from '@src/renderer/data/world';
import getSheetWorldData from '@src/renderer/utils/getSheetWorldData';
import openExternalLink from '@src/renderer/utils/ipc/openExternalLink';
import { WorldSortOrder, World, WorldData } from '@src/types';
import { SortOrder } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

interface HookMember {
  currentType: string;
  isLoading: boolean;
  typeList: string[];
  currentTableData: World[];

  onChangeSheetTab: (tabKey: string) => void;
  onClickUrl: (url: string) => void;
}
const useWorldList = (): HookMember => {
  const [worldData, setWorldData] = useRecoilState(worldDataState);
  const [currentType, setCurrentType] = useState<string>('풍경');
  const [isLoading, setIsLoading] = useState(worldData === undefined);

  const wd = worldData || [];

  const typeList = wd.map((e) => e.type);
  const currentTableData =
    wd.filter((e) => e.type === currentType)[0]?.worlds || [];

  useEffect(() => {
    if (worldData === undefined) {
      getSheetWorldData().then((data) => {
        setIsLoading(false);
        return setWorldData(data);
      });
    }
  }, [setWorldData, worldData]);

  return {
    currentType,
    isLoading,
    typeList,
    currentTableData,

    onChangeSheetTab(tabKey) {
      setCurrentType(tabKey);
    },
    onClickUrl(url) {
      openExternalLink(url);
    },
  };
};

export default useWorldListPage;
