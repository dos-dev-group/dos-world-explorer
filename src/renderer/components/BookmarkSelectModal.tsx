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
import { useState } from 'react';
import { Flex } from './styledComponents';

const { Option } = Select;

interface Props {
  bookmarkTypes: string[];
  preSelectType?: string;
  visible: boolean;

  onOk: (type: string) => void;
  onCancel: () => void;
  onAddItem: (type: string) => void;
}
export default function BookmarkSelectModal(props: Props) {
  const [insertedItemName, setInsertedItemName] = useState('');
  const [selectedType, setSelectedType] = useState(props.preSelectType);

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
        if (!selectedType) {
          message.error('타입을 골라주세요.');
          return;
        }
        props.onOk(selectedType);
      }}
      onCancel={() => {
        props.onCancel();
      }}
    >
      <Flex>
        <Select
          placeholder="custom dropdown render"
          value={selectedType}
          onChange={(value) => setSelectedType(value)}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space align="center" style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="Please enter item"
                  value={insertedItemName}
                  onChange={(e) => setInsertedItemName(e.target.value)}
                />
                <Typography.Link
                  onClick={(e) => {
                    e.preventDefault();
                    props.onAddItem(insertedItemName);
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
