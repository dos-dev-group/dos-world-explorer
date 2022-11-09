import { useFriendsData } from '@src/renderer/data/friends';
import { PartyGroup, usePartyData } from '@src/renderer/data/party';
import { User } from 'vrchat';

/* 
usersGroupNames={[]}
allGroupNames={[]}
onSetUsersGroup={function (groupNames: string[]): void {
  throw new Error('Function not implemented.');
}}
onCreateGroup={function (groupName: string): void {
  throw new Error('Function not implemented.');
}}
*/

interface HookMember {
  friends: User[];
  partyGroup: PartyGroup;

  checkUserGroups(userKey: string): string[];
  onSetUsersGroup(groupNames: string[], user: User): void;
  onCreateGroup(groupName: string, user: User): void;

}
const useFriendsPage = () => {
  const { friends } = useFriendsData();
  const { party, checkUserGroups } = usePartyData();

  const hookMember: HookMember = {
    friends: friends,
    partyGroup: party,

    checkUserGroups: checkUserGroups,
  };
  return hookMember;
};
export default useFriendsPage;
