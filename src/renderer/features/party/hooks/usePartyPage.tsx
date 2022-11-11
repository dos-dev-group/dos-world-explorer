import { PartyGroup, usePartyData } from '@src/renderer/data/party';
import { User } from 'vrchat';

interface HookMember {
  partyGroup: PartyGroup | undefined;

  checkUserGroups(userKey: string): string[];
  onSetUsersGroup(groupNames: string[], user: User): void;
  onCreateGroup(groupName: string): void;
}
const usePartyPage = (): HookMember => {
  const { party, checkUserGroups, setUsersGroup, addGroup } = usePartyData();

  const hookMember: HookMember = {
    partyGroup: party,
    checkUserGroups,
    onSetUsersGroup: setUsersGroup,
    onCreateGroup: addGroup,
  };
  return hookMember;
};

export default usePartyPage;
