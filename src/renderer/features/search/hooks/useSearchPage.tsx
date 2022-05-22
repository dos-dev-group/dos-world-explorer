import { searchTextState, worldDataState } from '@src/renderer/data/world';
import getSheetWorldData from '@src/renderer/utils/getSheetWorldData';
import openExternalLink from '@src/renderer/utils/ipc/openExternalLink';
import { WorldSortOrder, World, WorldData, WorldSheet } from '@src/types';
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
  onSearchWorlds: (text: string) => void;
}
const useSearch = (): HookMember => {
  const [currentType, setCurrentType] = useState<string>('전체');
  const [worldData, setWorldData] = useRecoilState(worldDataState);
  const [searchText, setSearchText] = useRecoilState(searchTextState);
  const [isLoading, setIsLoading] = useState(worldData === undefined);

  const wd =
    worldData?.map(
      (sheet) =>
        ({
          ...sheet,
          worlds: sheet.worlds.filter(
            (e) => e.name.toLowerCase().search(searchText.toLowerCase()) !== -1,
          ),
        } as WorldSheet),
    ) || [];

  const typeList = ['전체', ...wd.map((e) => e.type)];
  let currentTableData = [];
  if (currentType === '전체') {
    currentTableData = wd.flatMap((e) => e.worlds);
  } else {
    currentTableData =
      wd.filter((e) => e.type === currentType)[0]?.worlds || [];
  }

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
    onSearchWorlds(text) {
      setSearchText(text);
    },
  };
};

export default useSearch;
