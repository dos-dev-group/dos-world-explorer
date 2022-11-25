import { useDebugValue, useEffect, useState } from 'react';
import {
  atom,
  AtomEffect,
  selector,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import { User } from 'vrchat';
import { VRCHAT_STATUS } from '../utils/constants';
import { loadBookmarks, saveBookmarks } from '../utils/ipc/fileUtils';
import { getFriednListToMain } from '../utils/ipc/vrchatAPIToMain';

const friendsQuery = selector({
  key: 'friendsQuery',
  get: async ({ get }) => {
    const response = await getFriednListToMain(true);
    return response;
  },
});

export const sortedFriendsState = selector({
  key: 'sortedFriendsState',
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

      if (a.status !== 'offline' && b.status !== 'offline') {
        return a.displayName.localeCompare(b.displayName);
      }

      return b.last_login.localeCompare(a.last_login);
    });
    return sortedFriends;
  },
});

interface FriendsHookMember {
  friends: User[] | undefined;
  refresh(): void;
}
export const useFriendsData = (): FriendsHookMember => {
  const friendsLoadable = useRecoilValueLoadable(sortedFriendsState);
  const refreshFriends = useRecoilRefresher_UNSTABLE(friendsQuery);

  const [memoizedFriends, setMemoizedFriends] = useState<User[]>();
  useDebugValue(memoizedFriends);

  useEffect(() => {
    const id = setInterval(() => refreshFriends(), 5000);
    return () => clearInterval(id);
  }, [refreshFriends]);

  useEffect(() => {
    const maybeValue = friendsLoadable.valueMaybe();
    if (maybeValue) {
      setMemoizedFriends(maybeValue);
    }
  }, [friendsLoadable]);

  const hookMember: FriendsHookMember = {
    friends: memoizedFriends,
    refresh(): void {
      refreshFriends();
    },
  };

  return hookMember;
};
