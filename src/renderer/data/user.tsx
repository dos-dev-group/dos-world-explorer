import { UserLogin } from '@src/types';
import { atom, AtomEffect } from 'recoil';
import { loginToMain } from '../utils/ipc/vrchatAPIToMain';

const loginLocalStorageEffect =
  (key: string): AtomEffect<UserLogin | undefined> =>
  ({ trigger, onSet, setSelf, resetSelf }) => {
    const savedValue = localStorage.getItem(key);
    if (trigger === 'get' && savedValue !== null) {
      const loginInfo: UserLogin = JSON.parse(savedValue);

      loginToMain(loginInfo.name, loginInfo.password).then(() =>
        setSelf(loginInfo),
      );
    }

    onSet((newValue, _, isReset) => {
      if (isReset) {
        localStorage.removeItem(key);
      } else if (newValue) {
        loginToMain(newValue.name, newValue.password)
          .then(() => localStorage.setItem(key, JSON.stringify(newValue)))
          .catch(() => resetSelf());
      }
    });
  };

export const userLoginState = atom<UserLogin | undefined>({
  key: 'userLoginState',
  default: undefined,
  effects: [loginLocalStorageEffect('userLoginState')],
});
