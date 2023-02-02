import { useVrcCurrentUser } from '@src/renderer/data/user';
import { loginToMain } from '@src/renderer/utils/ipc/vrchatAPIToMain';
import { LoginResult, UserLogin } from '@src/types';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

const SEARCH_OPTIONS = ['NAME', 'AUTHOR', 'DESCRIPTION', 'TAG'] as const;

export type TfaType = 'NONE' | 'TFA' | 'EMAIL';

interface HookMember {
  username: string;
  password: string;
  isLoginProgress: boolean;
  twoFactorAuthState: TfaType;

  onChangeUsername: (u: string) => void;
  onChangePassword: (p: string) => void;
  onSubmitLogin: (user: UserLogin) => void;
  onSubmit2faCode: (user: UserLogin) => void;
  onCancel2faCode: () => void;
  checkInputValid: (input: string | null | undefined) => boolean;
}

const useLoginPage = (): HookMember => {
  const { currentUser, login, doTwoFactorAuth, doTFAEmail, logout } =
    useVrcCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoginProgress, setIsLoginProgress] = useState(false);
  const [twoFactorAuthState, setTwoFactorAuthState] = useState<TfaType>('NONE');

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
    twoFactorAuthState: twoFactorAuthState,

    checkInputValid,
    onSubmit2faCode(userLogin: UserLogin) {
      if (userLogin.code && twoFactorAuthState === 'TFA') {
        doTwoFactorAuth(userLogin.code)
          .then(() => login(userLogin))
          .catch((err) => message.error('인증번호가 틀렸습니다.'));
      } else if (userLogin.code && twoFactorAuthState === 'EMAIL') {
        doTFAEmail(userLogin.code)
          .then(() => login(userLogin))
          .catch((err) => message.error('인증번호가 틀렸습니다.'));
      } else {
        message.error('2차인증코드가 제대로 입력되지 않았습니다.');
        setIsLoginProgress(false);
      }
      setTwoFactorAuthState('NONE');
    },
    onCancel2faCode() {
      message.warn('2차인증을 취소했습니다.');
      setIsLoginProgress(false);
      setTwoFactorAuthState('NONE');
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
          if (err === LoginResult.TWOFACTOR) {
            setTwoFactorAuthState('TFA');
          } else if (err === LoginResult.TWOFACTOREMAIL) {
            setTwoFactorAuthState('EMAIL');
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
