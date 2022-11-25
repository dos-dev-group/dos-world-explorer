/* eslint-disable promise/no-nesting */
import { UserLogin } from '@src/types';
import { message } from 'antd';
import { useDebugValue, useEffect } from 'react';
import { atom, AtomEffect, useRecoilState, useResetRecoilState } from 'recoil';
import { CurrentUser } from 'vrchat';
import {
  getCurrentUserToMain,
  loginToMain,
  logoutToMain,
} from '../utils/ipc/vrchatAPIToMain';

const USER_LOGIN_LOCALSTORAGE_KEY = 'USER_LOGIN';

const vrcCurrentUserEffect =
  (): AtomEffect<CurrentUser | undefined> =>
  ({ trigger, onSet, setSelf, resetSelf }) => {
    getCurrentUserToMain()
      .catch(() => {
        const savedUl = localStorage.getItem(USER_LOGIN_LOCALSTORAGE_KEY);
        if (savedUl) {
          return login(JSON.parse(savedUl));
        }
        throw new Error('LOGIN_ERROR');
      })
      .then((currentUser) => {
        setSelf(currentUser);
      })
      .catch((reason) => console.error(reason.toString()));
  };

const currentUserState = atom<CurrentUser | undefined>({
  key: 'currentUserState',
  default: undefined,
  effects: [vrcCurrentUserEffect()],
});

export interface VrcCurrentUserHookMember {
  currentUser: CurrentUser | undefined;
  login(userLogin: UserLogin): Promise<CurrentUser>;
  logout(): Promise<void>;
}
export const useVrcCurrentUser = (): VrcCurrentUserHookMember => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const resetUser = useResetRecoilState(currentUserState);
  useDebugValue(currentUser);

  useEffect(() => {
    const id = setInterval(
      () => getCurrentUserToMain().then((user) => setCurrentUser(user)),
      5000,
    );
    return clearInterval(id);
  }, [setCurrentUser]);

  const hookMember: VrcCurrentUserHookMember = {
    currentUser: currentUser,
    async login(userLogin: UserLogin): Promise<CurrentUser> {
      const user = await login(userLogin);
      setCurrentUser(user);
      return user;
    },
    async logout(): Promise<void> {
      await logout();
      resetUser();
    },
  };

  return hookMember;
};

async function login(userLogin: UserLogin): Promise<CurrentUser> {
  try {
    await loginToMain(userLogin.name, userLogin.password);
    const user = await getCurrentUserToMain();
    localStorage.setItem(
      USER_LOGIN_LOCALSTORAGE_KEY,
      JSON.stringify(userLogin),
    );

    return user;
  } catch {
    localStorage.removeItem(USER_LOGIN_LOCALSTORAGE_KEY);
    throw new Error('LOGIN_ERROR');
  }
}

async function logout(): Promise<void> {
  await logoutToMain();
  localStorage.removeItem(USER_LOGIN_LOCALSTORAGE_KEY);
}
