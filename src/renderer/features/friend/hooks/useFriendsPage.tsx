import { useFriendsData } from '@src/renderer/data/friends';
import { PartyGroup, usePartyData } from '@src/renderer/data/party';
import { useEffect, useMemo, useState } from 'react';
import { User } from 'vrchat';

interface HookMember {
  friendsLength: number;
  friends: User[] | undefined;
  partialFriends: User[] | undefined;
  partyGroup: PartyGroup | undefined;
  currentPage: number;
  pageSize: number;

  onSearchInput: (value: string) => void;
  findUserGroups(userKey: string): string[];
  onSetUsersGroup(groupNames: string[], user: User): void;
  onCreateGroup(groupName: string): void;
  onClickRefresh(): void;
  onChangePage(page: number, pageSize: number): void;
}
const useFriendsPage = () => {
  const friendsHookMember = useFriendsData();
  const partyHookMember = usePartyData();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(24);
  const [searchWord, setSearchWord] = useState('');

  const filteredFriends = useMemo(() => {
    if (!searchWord || searchWord.trim() === '') {
      return friendsHookMember.friends;
    }
    return friendsHookMember.friends?.filter((e) =>
      e.displayName
        .trim()
        .toLocaleLowerCase()
        .includes(searchWord.trim().toLocaleLowerCase()),
    );
  }, [friendsHookMember.friends, searchWord]);

  const memFriends = useMemo(
    () =>
      filteredFriends?.slice(
        currentPageSize * currentPage,
        currentPageSize * currentPage + currentPageSize,
      ),
    [currentPage, currentPageSize, filteredFriends],
  );

  const hookMember: HookMember = {
    friendsLength:
      (!searchWord || searchWord.trim() === ''
        ? friendsHookMember.friends?.length
        : filteredFriends?.length) || 0,
    friends: friendsHookMember.friends,
    partyGroup: partyHookMember.party,
    partialFriends: memFriends,
    currentPage: currentPage + 1,
    pageSize: currentPageSize,

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
    onChangePage(page: number, size: number): void {
      setCurrentPage(page - 1);
    },
    onSearchInput(value: string): void {
      setSearchWord(value);
      setCurrentPage(0);
    },
  };
  return hookMember;
};
export default useFriendsPage;
