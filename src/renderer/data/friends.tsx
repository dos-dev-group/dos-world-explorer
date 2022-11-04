import {
  atom,
  AtomEffect,
  selector,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
} from 'recoil';
import { User } from 'vrchat';
import { loadBookmarks, saveBookmarks } from '../utils/ipc/bookmarksUtils';
import { getFriednListToMain } from '../utils/ipc/vrchatAPIToMain';

const friendsQuery = selector({
  key: 'VRCFriendsQuery',
  get: async ({ get }) => {
    const response = await getFriednListToMain(true);
    return response;
  },
});

interface FriendsHookMember {
  friends: User[];
  refresh(): void;
}
export const useFriends = (): FriendsHookMember => {
  const friends = useRecoilValue(friendsQuery);
  const refreshFriends = useRecoilRefresher_UNSTABLE(friendsQuery);

  const hookMember: FriendsHookMember = {
    friends,
    refresh(): void {
      refreshFriends();
    },
  };

  return hookMember;
};
