import { UserLogin } from '@src/types';
import { useState } from 'react';

const SEARCH_OPTIONS = ['NAME', 'AUTHOR', 'DESCRIPTION', 'TAG'] as const;

interface HookMember {
  username: string;
  password: string;
  code: string;
  userLogin: UserLogin | undefined;
  isChecking: boolean;
  isTwoFactorAuth: boolean;
  visibleTwoFactorAuthModal: boolean;
  isAutoLogin: boolean;

  onChangeInputValue: (input: string | null | undefined) => boolean;
  onOpenTwoFactorAuthdModal: () => void;
  onCloseTwoFactorAuthdModal: () => void;
  onCheckAutoLogin: (isChecked: boolean) => void;
  onCheckTwoFactorLogin: (isChecked: boolean) => void;
  onClickLogin: (user: UserLogin) => void;
}

const useSearchPage = (): HookMember => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [userLogin, setUserLogin] = useState<UserLogin | undefined>();
  const [isChecking, setIsChecking] = useState(false);
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const [visibleTwoFactorAuthModal, setVisibleTwoFactorAuthModal] =
    useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  return {
    username,
    password,
    code,
    userLogin,
    isChecking,
    isTwoFactorAuth,
    visibleTwoFactorAuthModal,
    isAutoLogin,

    onChangeInputValue(input: string | null | undefined) {
      return checkInputValid(input);
    },
    onOpenTwoFactorAuthdModal() {
      setVisibleTwoFactorAuthModal(true);
    },
    onCloseTwoFactorAuthdModal() {
      setVisibleTwoFactorAuthModal(false);
    },
    onCheckAutoLogin(isChecked: boolean) {
      setIsAutoLogin(isChecked);
    },
    onCheckTwoFactorLogin(isChecked: boolean) {
      setIsTwoFactorAuth(isChecked);
    },
    onClickLogin(userLogin: UserLogin) {      
      if (!checkInputValid(userLogin.name) || !checkInputValid(userLogin.password)) {
        return;
      }

      setUsername(userLogin.name);
      setPassword(userLogin.password);
      setCode(userLogin.code);

      console.log('login');
      // Todo: 로그인시도
      setIsChecking(true);

      // 만약 2FA가 필요할 경우
      if (isTwoFactorAuth) {
        setVisibleTwoFactorAuthModal(true);
      }

      if (isAutoLogin) {
        // todo: 유저 로그인정보 저장
      }

      
      setIsChecking(false);
    },
  };
};

export default useSearchPage;

function checkInputValid(input: string | null | undefined) {
  if (typeof input === 'string' && input.trim().length !== 0) {
    return true;
  } else {
    return false;
  }
}