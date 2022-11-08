import { useDebugValue } from 'react';
import {
  atom,
  AtomEffect,
  selector,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
} from 'recoil';
import { User } from 'vrchat';
import { VRCHAT_STATUS } from '../utils/constants';
import { loadBookmarks, saveBookmarks } from '../utils/ipc/bookmarksUtils';
import { getFriednListToMain } from '../utils/ipc/vrchatAPIToMain';

const friendsQuery = selector({
  key: 'VRCFriendsQuery',
  get: async ({ get }) => {
    const response = await getFriednListToMain(true);
    return response;
  },
});

const sortedFriendsState = selector({
  key: 'VRCSortedFriendsState',
  get: ({ get }) => {
    const friends = get(friendsQuery);
    const sortedFriends = [...friends].sort((a, b) => {
      if (
        (a.location === 'offline' || b.location === 'offline') &&
        a.location !== b.location
      ) {
        if (a.location === 'offline') return 1;
        if (b.location === 'offline') return -1;
      }

      if (a.status !== b.status) {
        return VRCHAT_STATUS[a.status] - VRCHAT_STATUS[b.status];
      }

      return b.last_login.localeCompare(a.last_login);
    });
    return sortedFriends;
  },
});

interface FriendsHookMember {
  friends: User[];
  refresh(): void;
}
export const useFriends = (): FriendsHookMember => {
  const friends = useRecoilValue(sortedFriendsState);
  const refreshFriends = useRecoilRefresher_UNSTABLE(friendsQuery);
  useDebugValue(friends);

  const hookMember: FriendsHookMember = {
    friends,
    refresh(): void {
      refreshFriends();
    },
  };

  return hookMember;
};
