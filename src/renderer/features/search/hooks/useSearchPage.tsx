import { searchTextState, worldDataState } from '@src/renderer/data/world';
import getSheetWorldData from '@src/renderer/utils/getSheetWorldData';
import openExternalLink from '@src/renderer/utils/ipc/openExternalLink';
import { WorldSortOrder, World, WorldData } from '@src/types';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

interface HookMember {
  currentType: string;
  isLoading: boolean;
  typeList: string[];
  currentTableData: World[];
  visibleAddWorldModal: boolean;

  onChangeSheetTab: (tabKey: string) => void;
  onClickUrl: (url: string) => void;
  onSearchWorlds: (text: string) => void;
  onClickOpenAddWorldModal: () => void;
  onClickCloseAddWorldModal: () => void;
}
const useSearch = (): HookMember => {
  const [currentType, setCurrentType] = useState<string>('전체');
  const [worldData, setWorldData] = useRecoilState(worldDataState);
  const [searchText, setSearchText] = useRecoilState(searchTextState);
  const [isLoading, setIsLoading] = useState(worldData === undefined);
  const [visibleAddWorldModal, setVisibleAddWorldModal] = useState(false);

  useEffect(() => {
    if (worldData === undefined) {
      getSheetWorldData().then((data) => {
        setIsLoading(false);
        return setWorldData(data);
      });
    }
  }, [setWorldData, worldData]);

  const typeList =
    worldData?.reduce(
      (acc, cur) => {
        if (acc.find((e) => e === cur.type)) {
          return acc;
        }
        return acc.concat(cur.type);
      },
      ['전체'],
    ) || [];

  const currentTableData =
    worldData
      ?.filter((w) => {
        if (currentType === '전체') {
          return true;
        }
        return w.type === currentType;
      })
      .filter(
        (e) => e.name.toLowerCase().search(searchText.toLowerCase()) !== -1,
      ) || [];

  return {
    currentType,
    isLoading,
    typeList,
    currentTableData,
    visibleAddWorldModal,

    onChangeSheetTab(tabKey) {
      setCurrentType(tabKey);
    },
    onClickUrl(url) {
      openExternalLink(url);
    },
    onSearchWorlds(text) {
      setSearchText(text);
    },
    onClickOpenAddWorldModal() {
      setVisibleAddWorldModal(true);
    },
    onClickCloseAddWorldModal() {
      setVisibleAddWorldModal(false);
    },
  };
};

export default useSearch;
