import { useDebugValue } from 'react';
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { User } from 'vrchat';
import { sortedFriendsState } from './friends';

// const friendsQuery = selector({
//   key: 'VRCFriendsQuery',
//   get: async ({ get }) => {
//     const response = await getFriednListToMain(true);
//     return response;
//   },
// });

// const sortedFriendsState = selector({
//   key: 'VRCSortedFriendsState',
//   get: ({ get }) => {
//     const friends = get(friendsQuery);
//     const sortedFriends = [...friends].sort((a, b) => {
//       if (
//         (a.location === 'offline' || b.location === 'offline') &&
//         a.location !== b.location
//       ) {
//         if (a.location === 'offline') return 1;
//         if (b.location === 'offline') return -1;
//       }

//       if (a.status !== b.status) {
//         return VRCHAT_STATUS[a.status] - VRCHAT_STATUS[b.status];
//       }

//       return b.last_login.localeCompare(a.last_login);
//     });
//     return sortedFriends;
//   },
// });

const partyUserKeyState = atom({
  key: 'partyState',
  default: [] as string[],
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('partyState');
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue, _, isReset) => {
        if (isReset) {
          localStorage.removeItem('partyState');
          return;
        }
        localStorage.setItem('partyState', JSON.stringify(newValue));
      });
    },
  ],
});

const partyDerivedState = selector({
  key: 'partyDerivedState',
  get: async ({ get }) => {
    const userKeys = get(partyUserKeyState);
    const friends = get(sortedFriendsState);

    return friends.filter((f) => userKeys.includes(f.id));
  },
});

interface PartyHookMember {
  party: User[];
  addUser(user: User): void;
  removeUser(user: User): void;
}
export const useParty = (): PartyHookMember => {
  const partyUserKeys = useRecoilValue(partyUserKeyState);
  const partyUsers = useRecoilValue(partyDerivedState);
  const setParty = useSetRecoilState(partyUserKeyState);
  useDebugValue(partyUsers);

  const hookMember: PartyHookMember = {
    party: partyUsers,
    addUser(user) {
      setParty([...partyUserKeys, user.id]);
    },
    removeUser(user) {
      setParty(partyUserKeys.filter((p) => p !== user.id));
    },
  };

  return hookMember;
};
