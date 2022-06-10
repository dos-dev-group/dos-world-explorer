import { UserLogin } from '@src/types';
import {
  Input,
  Modal,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  onLogin?: (u: UserLogin) => void;
  onCancel?: () => void;
  visible: boolean;
  userLogin?: UserLogin;
}
function TwoFactorAuthModal(props: Props) {
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (props.visible === false) {
      setCode('');
    }
  }, [props.visible]);

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
          props.onCancel?.();
        }
      }}
      destroyOnClose
      onCancel={props.onCancel}
      visible={props.visible}
      width="300px"
      okButtonProps={{
        disabled: code.trim().length !== 6 ? true : false,
      }}
    >
      <Typography.Title level={5}>OTP코드를 입력해주세요</Typography.Title>
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
