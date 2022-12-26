import { useVrcCurrentUser } from '@src/renderer/data/user';
import { loginToMain } from '@src/renderer/utils/ipc/vrchatAPIToMain';
import { LoginError, UserLogin } from '@src/types';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

const SEARCH_OPTIONS = ['NAME', 'AUTHOR', 'DESCRIPTION', 'TAG'] as const;

interface HookMember {
  username: string;
  password: string;
  isLoginProgress: boolean;
  visibleTwoFactorAuthModal: boolean;

  onChangeUsername: (u: string) => void;
  onChangePassword: (p: string) => void;
  onSubmitLogin: (user: UserLogin) => void;
  onSubmit2faCode: (user: UserLogin) => void;
  onCancel2faCode: () => void;
  checkInputValid: (input: string | null | undefined) => boolean;
}

const useLoginPage = (): HookMember => {
  const { currentUser, login, doTwoFactorAuth } = useVrcCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoginProgress, setIsLoginProgress] = useState(false);
  const [visibleTwoFactorAuthModal, setVisibleTwoFactorAuthModal] =
    useState(false);

  useEffect(() => {
    // if Login, go Main Page
    if (currentUser) {
      navigate((location.state as any)?.from?.pathname || '/');
    }
  }, [currentUser, location.state, navigate]);

  const hookMember: HookMember = {
    username,
    password,
    isLoginProgress,
    visibleTwoFactorAuthModal,

    checkInputValid,
    onSubmit2faCode(userLogin: UserLogin) {
      if (userLogin.code) {
        doTwoFactorAuth(userLogin.code);
      } else {
        message.error('2차인증코드가 제대로 입력되지 않았습니다.');
      }
      setVisibleTwoFactorAuthModal(false);
    },
    onCancel2faCode() {
      setVisibleTwoFactorAuthModal(false);
    },
    onSubmitLogin(loginSubmitValue: UserLogin) {
      if (
        !checkInputValid(loginSubmitValue.name) ||
        !checkInputValid(loginSubmitValue.password)
      ) {
        message.error('아이디와 비밀번호를 제대로 입력해주세요.');
        return;
      }

      // setUsername(loginState.name);
      // setPassword(loginState.password);
      // setCode(loginState.code);

      // 로그인시도
      setIsLoginProgress(true);

      // // 만약 2FA가 필요할 경우
      // if (isTwoFactorAuth) {
      //   setVisibleTwoFactorAuthModal(true);
      // }
      login(loginSubmitValue)
        .catch((err) => {
          if (err === LoginError.TWOFACTOR) {
            setVisibleTwoFactorAuthModal(true);
          } else {
            throw err;
          }
        })
        .catch((err) => {
          message.error(err.toString());
          setIsLoginProgress(false);
        });
    },
    onChangeUsername(u: string): void {
      setUsername(u);
    },
    onChangePassword(p: string): void {
      setPassword(p);
    },
  };

  return hookMember;
};

export default useLoginPage;

function checkInputValid(input: string | null | undefined) {
  if (typeof input === 'string' && input.trim().length !== 0) {
    return true;
  }
  return false;
}
