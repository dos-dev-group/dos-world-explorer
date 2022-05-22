import getSheetWorldData from '@src/renderer/utils/getSheetWorldData';
import openExternalLink from '@src/renderer/utils/ipc/openExternalLink';
import { WorldSortOrder, World, WorldData } from '@src/types';
import { SortOrder } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';

interface HookMember {
  currentType: string;
  isLoading: boolean;
  typeList: string[];
  currentTableData: World[];

  onChangeSheetTab: (tabKey: string) => void;
  onClickUrl: (url: string) => void;
}
const useWorldListPage = (): HookMember => {
  const [currentType, setCurrentType] = useState<string>('풍경');
  const [isLoading, setIsLoading] = useState(true);
  const [worldData, setWorldData] = useState<WorldData>([]);

  const typeList = worldData.map((e) => e.type);
  const currentTableData =
    worldData.filter((e) => e.type === currentType)[0]?.worlds || [];

  useEffect(() => {
    getSheetWorldData().then((data) => {
      setIsLoading(false);
      return setWorldData(data);
    });
  }, []);

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
