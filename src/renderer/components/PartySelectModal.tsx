import { PlusOutlined } from '@ant-design/icons';
import {
  Divider,
  Input,
  message,
  Modal,
  Select,
  Space,
  Typography,
} from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import { useEffect, useRef, useState } from 'react';
import { Flex } from './styledComponents';

const { Option } = Select;

interface Props {
  allGroups: string[] | undefined;
  userGroups: string[] | undefined;
  open: boolean;

  onOk: (partyGroups: string[]) => void;
  onCancel: () => void;
  onCreateGroup: (groupName: string) => void;
}
export default function PartySelectModal(props: Props) {
  // const { checkUserGroups, party, addGroup } = usePartyData();
  const selectRef = useRef<RefSelectProps>(null);

  const [insertedItemName, setInsertedItemName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>();

  useEffect(() => {
    setSelectedTypes(props.userGroups);
  }, [props.userGroups]);

  useEffect(() => {
    if (!props.open) {
      setInsertedItemName('');
      setSelectedTypes(undefined);
    }
  }, [props.open]);

  const renderedOptions =
    props.allGroups?.map((e) => <Option key={e}>{e}</Option>) || [];

  const isDisabledAddItem =
    insertedItemName.trim() === '' ||
    props.allGroups?.find((e) => e === insertedItemName.trim()) !== undefined;

  return (
    <Modal
      title="그룹을 선택해주세요"
      open={props.open}
      onOk={() => {
        if (!selectedTypes) {
          message.error('타입을 골라주세요.');
          return;
        }
        props.onOk(selectedTypes);
      }}
      onCancel={() => {
        props.onCancel();
      }}
    >
      <Flex>
        <Select
          ref={selectRef}
          placeholder="그룹"
          mode="multiple"
          value={selectedTypes}
          onChange={(value) => {
            setSelectedTypes(value);
            selectRef.current?.blur();
          }}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space align="center" style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="만들 그룹 이름"
                  value={insertedItemName}
                  onChange={(e) => setInsertedItemName(e.target.value)}
                />
                <Typography.Link
                  onClick={(e) => {
                    e.preventDefault();
                    // props.onAddBookmarkItem(insertedItemName);
                    props.onCreateGroup(insertedItemName);
                  }}
                  style={{ whiteSpace: 'nowrap' }}
                  disabled={isDisabledAddItem}
                >
                  <PlusOutlined /> 추가
                </Typography.Link>
              </Space>
            </>
          )}
        >
          {renderedOptions}
        </Select>
      </Flex>
    </Modal>
  );
}
