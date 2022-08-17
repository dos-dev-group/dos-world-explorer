import { UserLogin } from '@src/types';
import { message } from 'antd';
import { atom, AtomEffect } from 'recoil';
import { loginToMain, logoutToMain } from '../utils/ipc/vrchatAPIToMain';

export const LOADING_LOGIN = 'LOADING_LOGIN';

const loginLocalStorageEffect =
  (key: string): AtomEffect<UserLogin | undefined> =>
  ({ trigger, onSet, setSelf, resetSelf }) => {
    const savedValue = localStorage.getItem(key);
    if (trigger === 'get' && savedValue !== null) {
      const loginInfo: UserLogin = JSON.parse(savedValue);

      loginToMain(loginInfo.name, loginInfo.password)
        .then(() => setSelf(loginInfo))
        .catch(() => resetSelf());
    }

    onSet((newValue, _, isReset) => {
      if (isReset) {
        localStorage.removeItem(key);
        logoutToMain();
      } else if (newValue) {
        loginToMain(newValue.name, newValue.password)
          .then(() => {
            localStorage.setItem(key, JSON.stringify(newValue));
          })
          .catch(() => {
            message.error('로그인에 실패했습니다.');
            resetSelf();
          });
      }
    });
  };

export const userLoginState = atom<UserLogin | undefined>({
  key: 'userLoginState',
  default: undefined,
  effects: [loginLocalStorageEffect('userLoginState')],
});
