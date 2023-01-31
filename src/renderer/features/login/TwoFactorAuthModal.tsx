import { UserLogin } from '@src/types';
import { Input, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { TfaType } from './hooks/useLoginPage';

interface Props {
  onLogin?: (u: UserLogin) => void;
  onCancel?: () => void;
  tfaState: TfaType;
  userLogin?: UserLogin;
}
function TwoFactorAuthModal(props: Props) {
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (props.tfaState === 'NONE') {
      setCode('');
    }
  }, [props.tfaState]);

  let renderedTfaInfo;
  if (props.tfaState === 'EMAIL') {
    renderedTfaInfo = '(이메일확인)';
  } else if (props.tfaState === 'TFA') {
    renderedTfaInfo = '(2차인증확인)';
  }

  return (
    <Modal
      title="Two-Factor Authentication"
      onOk={() => {
        if (code.trim().length === 6) {
          props.onLogin?.({
            name: props.userLogin?.name || '',
            password: props.userLogin?.password || '',
            code: code,
          });
        }
      }}
      destroyOnClose
      onCancel={props.onCancel}
      open={props.tfaState !== 'NONE'}
      okButtonProps={{
        disabled: code.trim().length !== 6 ? true : false,
      }}
    >
      <Typography.Title level={5}>
        2차 인증코드를 입력해주세요 {renderedTfaInfo}
      </Typography.Title>
      <Input
        value={code}
        onChange={(e) => {
          const numbers = e.target.value.substring(0, 6).replace(/\D/g, '');
          setCode(numbers);
        }}
      />
    </Modal>
  );
}
export default TwoFactorAuthModal;
