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

interface UserKeyPartyGroup {
  [s: string]: string[];
}
export interface PartyGroup {
  [s: string]: User[];
}

const partyUserKeyState = atom({
  key: 'partyState',
  default: { group1: [] } as UserKeyPartyGroup,
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
    const groups = get(partyUserKeyState);
    const friends = get(sortedFriendsState);

    const derivedGroups: PartyGroup = {};
    for (const g of Object.keys(groups)) {
      derivedGroups[g] = friends.filter((f) => groups[g].includes(f.id));
    }
    return derivedGroups;
  },
});

interface PartyHookMember {
  party: PartyGroup;
  addUser(groupName: string, user: User): void;
  removeUser(groupName: string, user: User): void;
  setUsersGroup(groupNames: string[], user: User): void;
  addGroup(groupName: string): void;
  removeGroup(groupName: string): void;
  checkUserGroups(userKey: string): string[];
}
export const usePartyData = (): PartyHookMember => {
  const partyUserKeyGroup = useRecoilValue(partyUserKeyState);
  const partyGroup = useRecoilValue(partyDerivedState);
  const setPartyUserKeys = useSetRecoilState(partyUserKeyState);
  useDebugValue(partyUserKeyGroup);
  useDebugValue(partyGroup);

  const hookMember: PartyHookMember = {
    party: partyGroup,
    addUser(group, user) {
      const clone = { ...partyUserKeyGroup };
      clone[group].push(user.id);

      setPartyUserKeys(clone);
    },
    removeUser(group, user) {
      const clone = { ...partyUserKeyGroup };
      clone[group] = clone[group].filter((k) => k === user.id);

      setPartyUserKeys(clone);
    },
    setUsersGroup(groupNames: string[], user: User): void {
      throw new Error('Function not implemented.');
    },
    addGroup(groupName) {
      if (Object.prototype.hasOwnProperty.call(partyUserKeyGroup, groupName)) {
        return;
      }
      const clone = { ...partyUserKeyGroup };
      clone[groupName] = [];
    },
    removeGroup(groupName) {
      if (Object.prototype.hasOwnProperty.call(partyUserKeyGroup, groupName)) {
        const clone = { ...partyUserKeyGroup };
        delete clone[groupName];
        setPartyUserKeys(clone);
      }
    },
    checkUserGroups(userKey) {
      return Object.keys(partyUserKeyGroup).filter((g) => {
        return partyUserKeyGroup[g].includes(userKey);
      });
    },
  };

  return hookMember;
};
