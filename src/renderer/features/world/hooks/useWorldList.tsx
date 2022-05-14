import openExternalLink from '@src/utils/ipc-renderer/openExternalLink';
import { WorldData } from '@src/utils/types';
import { useNavigate, useParams } from 'react-router-dom';

interface HookMember {
  currentType: string;
  worldData: WorldData;

  onChangeSheetTab: (tabKey: string) => void;
  onClickUrl: (url: string) => void;
}
const useWorldList = (): HookMember => {
  const params = useParams();
  const navigate = useNavigate();
  const currentType = params.type || '일반';

  return {
    currentType,
    worldData: [],

    onChangeSheetTab(tabKey) {
      navigate('/world/' + tabKey);
    },
    onClickUrl(url) {
      openExternalLink(url);
    },
  };
};

export default useWorldList;
