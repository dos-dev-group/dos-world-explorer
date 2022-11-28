import { useFriendsData } from '@src/renderer/data/friends';
import { PartyGroup, usePartyData } from '@src/renderer/data/party';
import { User } from 'vrchat';

interface HookMember {
  onClickRefresh(): void;
  onClickOpenLoadDialog(): void;
  onClickOpenSaveDialog(): void;
  partyGroup: PartyGroup | undefined;

  findUserGroups(userKey: string): string[];
  onSetUsersGroup(groupNames: string[], user: User): void;
  onCreateGroup(groupName: string): void;
  onRemoveGroup(groupName: string): void;
  onRenameGroup(oldName: string, newName: string): void;
}
const usePartyPage = (): HookMember => {
  const {
    party,
    findUserGroups,
    setUsersGroup,
    addGroup,
    removeGroup,
    renameGroup,
    showLoadDialog,
    showSaveDialog,
  } = usePartyData();

  const { refresh } = useFriendsData();

  const hookMember: HookMember = {
    partyGroup: party,
    findUserGroups,
    onSetUsersGroup: setUsersGroup,
    onCreateGroup: addGroup,
    onRemoveGroup: removeGroup,
    onRenameGroup: renameGroup,
    onClickOpenLoadDialog: (): void => {
      showLoadDialog();
    },
    onClickOpenSaveDialog: (): void => {
      showSaveDialog();
    },
    onClickRefresh(): void {
      refresh();
    },
  };
  return hookMember;
};

export default usePartyPage;
