import { Button, Input, Typography } from 'antd';
import { FlexCenter } from '@src/renderer/components/styledComponents';
import { useState } from 'react';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import useLoginPage from './hooks/useLoginPage';
import TwoFactorAuthModal from './TwoFactorAuthModal';

export default function LoginPage() {
  const hookMember = useLoginPage();
  const [username, setUsername] = useState<string>();
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [password, setPassword] = useState<string>();
  const [isPwValid, setIsPwValid] = useState(true);

  return (
    <FlexCenter style={{ width: '100%', height: '100%' }}>
      <TwoFactorAuthModal
        onLogin={(u) => {
          hookMember.onClickLogin(u);
        }}
        onCancel={() => {
          hookMember.onCloseTwoFactorAuthdModal();
        }}
        visible={hookMember.visibleTwoFactorAuthModal}
        userLogin={hookMember.userLogin}
      />

      <Typography.Title level={4}>Login</Typography.Title>
      <div css={{ width: '300px' }}>
        <Typography.Title css={{ marginTop: '10px' }} level={5}>
          VRChat Username or Email
        </Typography.Title>
        <Input
          placeholder="Username/Email"
          status={isUsernameValid ? '' : 'error'}
          onChange={(e) => {
            setUsername(e.target.value);
            setIsUsernameValid(hookMember.onChangeInputValue(e.target.value));
          }}
        />
        <Typography.Title css={{ marginTop: '10px' }} level={5}>
          VRChat Password
        </Typography.Title>
        <Input
          placeholder="Password"
          status={isPwValid ? '' : 'error'}
          onChange={(e) => {
            setPassword(e.target.value);
            setIsPwValid(hookMember.onChangeInputValue(e.target.value));
          }}
        />
        <Checkbox
          css={{ margin: '10px' }}
          checked={hookMember.isAutoLogin}
          onChange={(e) => {
            hookMember.onCheckAutoLogin(e.target.checked);
          }}
        >
          자동 로그인
        </Checkbox>
        <Checkbox
          css={{ margin: '10px' }}
          checked={hookMember.isTwoFactorAuth}
          onChange={(e) => {
            hookMember.onCheckTwoFactorLogin(e.target.checked);
          }}
        >
          Two-Factor Auth 테스트
        </Checkbox>
        <FlexCenter>
          <Button
            type="primary"
            loading={hookMember.isChecking}
            css={{ width: '80%', margin: '15px' }}
            onClick={() => {
              let isUsernameValid = hookMember.onChangeInputValue(username);
              let isPwValid = hookMember.onChangeInputValue(password);
              setIsUsernameValid(isUsernameValid);
              setIsPwValid(isPwValid);
              if (isUsernameValid && isPwValid) {
                hookMember.onClickLogin({
                  name: username || '',
                  password: password || '',
                  code: '',
                });
              }
            }}
          >
            Login
          </Button>
        </FlexCenter>
        <Typography.Text>
          VRCE는 사용자의 개인정보{'(ID와 PW)'}를 해당 사용자의 컴퓨터에만
          저장하며 외부로 유출하지 않습니다.
          <br />
          <br />
          VRCE는 VRChat의 월드 기록 및 탐험을 위해 Dos팀에서 개발된 앱으로
          VRChat운영측과 아무런 관련이 없으며 VRChat을 대변하지 않습니다.
          <br />
          <br />
          Dos팀은 사용자가 VRCE를 사용함으로서 생긴 문제에 대해 아무런 책임을
          지지 않습니다.
        </Typography.Text>
      </div>
    </FlexCenter>
  );
}
