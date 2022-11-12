import { useDebugValue, useMemo } from 'react';
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { User } from 'vrchat';
import copyDeep from '../utils/copyDeep';
import { showLoadFileDialog, showSaveFileDialog } from '../utils/ipc/fileUtils';
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
  party: PartyGroup | undefined;
  addUser(groupName: string, user: User): void;
  removeUser(groupName: string, user: User): void;
  setUsersGroup(groupNames: string[], user: User): void;
  addGroup(groupName: string): void;
  removeGroup(groupName: string): void;
  renameGroup(targetGroupName: string, newGroupName: string): void;
  checkUserGroups(userKey: string): string[];
  showSaveDialog(): Promise<void>;
  showLoadDialog(): Promise<void>;
}
export const usePartyData = (): PartyHookMember => {
  const partyGroupLoadable = useRecoilValueLoadable(partyDerivedState);
  const [partyUserKeyGroup, setPartyUserKeyGroup] =
    useRecoilState(partyUserKeyState);
  useDebugValue(partyUserKeyGroup);
  useDebugValue(partyGroupLoadable.valueMaybe());

  const hookMember: PartyHookMember = {
    party: partyGroupLoadable.valueMaybe(),
    addUser(group, user) {
      const clone = { ...partyUserKeyGroup };
      clone[group] = [user.id, ...clone[group]];

      setPartyUserKeyGroup(clone);
    },
    removeUser(group, user) {
      const clone = { ...partyUserKeyGroup };
      clone[group] = clone[group].filter((k) => k === user.id);

      setPartyUserKeyGroup(clone);
    },
    setUsersGroup(groupNames: string[], user: User): void {
      const oldGroupNames = hookMember.checkUserGroups(user.id);

      const targetRemove = oldGroupNames.filter(
        (og) => !groupNames.includes(og),
      );
      const targetAdd = groupNames.filter((ng) => !oldGroupNames.includes(ng));

      const clonePartyUserKeyGroup = { ...partyUserKeyGroup };
      for (const group of targetRemove) {
        clonePartyUserKeyGroup[group] = clonePartyUserKeyGroup[group].filter(
          (e) => e !== user.id,
        );
      }
      for (const group of targetAdd) {
        clonePartyUserKeyGroup[group] = [
          user.id,
          ...clonePartyUserKeyGroup[group],
        ];
      }
      setPartyUserKeyGroup(clonePartyUserKeyGroup);
    },
    addGroup(groupName) {
      if (Object.prototype.hasOwnProperty.call(partyUserKeyGroup, groupName)) {
        return;
      }
      const clone = { ...partyUserKeyGroup };
      clone[groupName] = [];
      setPartyUserKeyGroup(clone);
    },
    removeGroup(groupName) {
      if (Object.prototype.hasOwnProperty.call(partyUserKeyGroup, groupName)) {
        const clone = { ...partyUserKeyGroup };
        delete clone[groupName];
        setPartyUserKeyGroup(clone);
      }
    },
    renameGroup(targetGroupName, newGroupName) {
      const oldGroupKeys = Object.keys(partyUserKeyGroup);

      if (!oldGroupKeys.includes(targetGroupName)) {
        // 없는 북마크 변경 시
        return;
      }
      if (oldGroupKeys.includes(newGroupName)) {
        // 중복된 북마크 이름으로 변경 시
        return;
      }
      const clone = copyDeep(partyUserKeyGroup);
      const temp = clone[targetGroupName].concat();
      delete clone[targetGroupName];
      clone[newGroupName] = temp;
      setPartyUserKeyGroup(clone);
    },

    checkUserGroups(userKey) {
      return Object.keys(partyUserKeyGroup).filter((g) => {
        return partyUserKeyGroup[g].includes(userKey);
      });
    },
    async showSaveDialog(): Promise<void> {
      showSaveFileDialog(partyUserKeyGroup);
    },
    async showLoadDialog(): Promise<void> {
      const data = await showLoadFileDialog<UserKeyPartyGroup>();
      setPartyUserKeyGroup(data);
    },
  };

  return hookMember;
};
