import { Button, Input, Typography } from 'antd';
import { Flex, FlexCenter } from '@src/renderer/components/styledComponents';
import { useState } from 'react';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import useLoginPage from './hooks/useLoginPage';
import TwoFactorAuthModal from './TwoFactorAuthModal';

export default function LoginPage() {
  const hookMember = useLoginPage();

  return (
    <FlexCenter style={{ height: '100vh' }}>
      {/* <TwoFactorAuthModal
        onLogin={(u) => {
          hookMember.onClickLogin(u);
        }}
        onCancel={() => {
          hookMember.onCloseTwoFactorAuthdModal();
        }}
        visible={hookMember.visibleTwoFactorAuthModal}
        userLogin={hookMember.userLogin}
      /> */}

      <Typography.Title level={2}>VRCExplorer</Typography.Title>

      <Typography.Title level={4}>Login</Typography.Title>
      <div css={{ width: '300px' }}>
        <Typography.Title css={{ marginTop: '10px' }} level={5}>
          VRChat Username or Email
        </Typography.Title>
        <Input
          placeholder="Username/Email"
          status={
            hookMember.username === '' ||
            hookMember.checkInputValid(hookMember.username)
              ? ''
              : 'error'
          }
          onChange={(e) => {
            hookMember.onChangeUsername(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter' && !hookMember.isLoginProgress) {
              hookMember.onSubmitLogin({
                name: hookMember.username,
                password: hookMember.password,
                code: undefined,
              });
            }
          }}
        />
        <Typography.Title css={{ marginTop: '10px' }} level={5}>
          VRChat Password
        </Typography.Title>
        <Input
          placeholder="Password"
          type="password"
          status={
            hookMember.password === '' ||
            hookMember.checkInputValid(hookMember.password)
              ? ''
              : 'error'
          }
          onChange={(e) => {
            hookMember.onChangePassword(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter' && !hookMember.isLoginProgress) {
              hookMember.onSubmitLogin({
                name: hookMember.username,
                password: hookMember.password,
                code: undefined,
              });
            }
          }}
        />
        {/* <Checkbox
          css={{ margin: '10px' }}
          checked={hookMember.isAutoLogin}
          onChange={(e) => {
            hookMember.onCheckAutoLogin(e.target.checked);
          }}
        >
          자동 로그인
        </Checkbox> */}
        {/* <Checkbox
          css={{ margin: '10px' }}
          checked={hookMember.isTwoFactorAuth}
          onChange={(e) => {
            hookMember.onCheckTwoFactorLogin(e.target.checked);
          }}
        >
          Two-Factor Auth 테스트
        </Checkbox> */}
        <FlexCenter>
          <Button
            type="primary"
            loading={hookMember.isLoginProgress}
            css={{ width: '80%', margin: '15px' }}
            onClick={() => {
              hookMember.onSubmitLogin({
                name: hookMember.username,
                password: hookMember.password,
                code: undefined,
              });
            }}
          >
            Login
          </Button>
        </FlexCenter>
      </div>
      <FlexCenter css={{ marginTop: '20vh', padding: '0px 100px 0px 100px' }}>
        <ul>
          <li>
            VRCE는 사용자의 개인정보{'(ID와 PW)'}를 해당 사용자의 컴퓨터에만
            저장하며 외부로 유출하지 않습니다.
          </li>
          <li>
            VRCE는 VRChat의 월드 기록 및 탐험을 위해 Dos팀에서 개발된 앱으로
            VRChat운영측과 아무런 관련이 없으며 VRChat을 대변하지 않습니다.
          </li>
          <li>
            Dos팀은 사용자가 VRCE를 사용함으로서 생긴 문제에 대해 아무런 책임을
            지지 않습니다.
          </li>
        </ul>
        {/* <Typography.Text>
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
        </Typography.Text> */}
      </FlexCenter>
    </FlexCenter>
  );
}
