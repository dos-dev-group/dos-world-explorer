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
  bookmarkTypes: string[];
  preSelectType?: string[];
  visible: boolean;

  onOk: (types: string[]) => void;
  onCancel: () => void;
  onAddBookmarkItem: (type: string) => void;
}
export default function BookmarkSelectModal(props: Props) {
  const selectRef = useRef<RefSelectProps>(null);

  const [insertedItemName, setInsertedItemName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>();

  useEffect(() => {
    setSelectedTypes(props.preSelectType);
  }, [props.preSelectType]);

  useEffect(() => {
    if (!props.visible) {
      setInsertedItemName('');
      setSelectedTypes(undefined);
    }
  }, [props.visible]);

  const renderedOptions = props.bookmarkTypes.map((e) => (
    <Option key={e}>{e}</Option>
  ));

  const isDisabledAddItem =
    insertedItemName.trim() === '' ||
    props.bookmarkTypes.find((e) => e === insertedItemName.trim()) !==
      undefined;

  return (
    <Modal
      title="북마크를 선택해주세요"
      visible={props.visible}
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
      zIndex={3}
    >
      <Flex>
        <Select
          ref={selectRef}
          placeholder="북마크를 선택해주세요"
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
                  placeholder="추가할 북마크 이름"
                  value={insertedItemName}
                  onChange={(e) => setInsertedItemName(e.target.value)}
                />
                <Typography.Link
                  onClick={(e) => {
                    e.preventDefault();
                    props.onAddBookmarkItem(insertedItemName);
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
