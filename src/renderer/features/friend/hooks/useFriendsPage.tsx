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
  partyGroup: PartyGroup | undefined;

  checkUserGroups(userKey: string): string[];
  onSetUsersGroup(groupNames: string[], user: User): void;
  onCreateGroup(groupName: string): void;
}
const useFriendsPage = () => {
  const friendsHookMember = useFriendsData();
  const partyHookMember = usePartyData();

  const hookMember: HookMember = {
    friends: friendsHookMember.friends,
    partyGroup: partyHookMember.party,

    checkUserGroups: partyHookMember.checkUserGroups,
    onSetUsersGroup(groupNames, user) {
      partyHookMember.setUsersGroup(groupNames, user);
    },
    onCreateGroup(groupName) {
      partyHookMember.addGroup(groupName);
    },
  };
  return hookMember;
};
export default useFriendsPage;
