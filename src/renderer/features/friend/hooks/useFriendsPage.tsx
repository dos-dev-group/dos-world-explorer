import { useFriendsData } from '@src/renderer/data/friends';
import { PartyGroup, usePartyData } from '@src/renderer/data/party';
import { useEffect } from 'react';
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
  friends: User[] | undefined;
  // partialFriends: User[] | undefined;
  partyGroup: PartyGroup | undefined;

  findUserGroups(userKey: string): string[];
  onSetUsersGroup(groupNames: string[], user: User): void;
  onCreateGroup(groupName: string): void;
  onClickRefresh(): void;
}
const useFriendsPage = () => {
  const friendsHookMember = useFriendsData();
  const partyHookMember = usePartyData();

  const hookMember: HookMember = {
    friends: friendsHookMember.friends,
    partyGroup: partyHookMember.party,

    findUserGroups: partyHookMember.findUserGroups,
    onSetUsersGroup(groupNames, user) {
      partyHookMember.setUsersGroup(groupNames, user);
    },
    onCreateGroup(groupName) {
      partyHookMember.addGroup(groupName);
    },
    onClickRefresh() {
      friendsHookMember.refresh();
    },
  };
  return hookMember;
};
export default useFriendsPage;
