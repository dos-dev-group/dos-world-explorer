import { FolderOutlined } from '@ant-design/icons';
import { Flex, FlexRow } from '@src/renderer/components/styledComponents';
import { PartyGroup } from '@src/renderer/data/party';
import { spacing } from '@src/renderer/utils/styling';
import { Avatar, Button, Input, List, Modal, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  onAddItem(type: string): void;
  onEditItem(oldType: string, newType: string): void;
  onRemoveItem(type: string): void;
  onCancel: () => void;

  partyGroup: PartyGroup | undefined;
  open: boolean;
}
export default function PartyGroupModal(props: Props) {
  const [curEditItem, setCurEditItem] = useState<string | undefined>();
  const [newEditItem, setNewEditItem] = useState<string>('');
  const [newAddItem, setNewAddItem] = useState<string>('');

  useEffect(() => {
    if (!props.open) {
      setCurEditItem(undefined);
      setNewAddItem('');
      setNewEditItem('');
    }
  }, [props.open]);

  const types = props.partyGroup ? Object.keys(props.partyGroup) : [];

  return (
    <Modal
      open={props.open}
      onCancel={() => props.onCancel()}
      title="파티 관리"
      destroyOnClose
      footer={false}
    >
      <List
        itemLayout="horizontal"
        dataSource={types}
        footer={
          <FlexRow css={{ alignItems: 'center' }}>
            <Input
              placeholder="파티 이름"
              onChange={(e) => setNewAddItem(e.target.value)}
              value={newAddItem}
            />
            <Button
              disabled={newAddItem.trim() === ''}
              css={{ marginLeft: spacing(1) }}
              onClick={() => {
                props.onAddItem(newAddItem);
                setNewAddItem('');
              }}
            >
              파티 추가
            </Button>
          </FlexRow>
        }
        renderItem={(item) => {
          const bookmarkItem = props.partyGroup?.[item] || [];
          const renderedEditButton =
            curEditItem === item ? (
              <Button
                type="primary"
                onClick={() => {
                  setCurEditItem(undefined);
                  setNewEditItem('');
                }}
              >
                취소
              </Button>
            ) : (
              <Button
                ghost
                type="primary"
                onClick={() => {
                  setCurEditItem(item);
                  setNewEditItem(item);
                }}
              >
                수정
              </Button>
            );
          const renderedRemoveButton = (
            <Popconfirm
              title="정말 파티를 삭제하시겠습니까?"
              onConfirm={() => props.onRemoveItem(item)}
            >
              <Button danger>삭제</Button>
            </Popconfirm>
          );

          return (
            <List.Item actions={[renderedEditButton, renderedRemoveButton]}>
              <List.Item.Meta
                avatar={<Avatar icon={<FolderOutlined />} />}
                title={
                  item === curEditItem ? (
                    <Input
                      value={newEditItem}
                      onChange={(e) => setNewEditItem(e.target.value.trim())}
                      onPressEnter={() => {
                        props.onEditItem(item, newEditItem);
                        setCurEditItem(undefined);
                        setNewEditItem('');
                      }}
                    />
                  ) : (
                    item
                  )
                }
                description={'파티 유저수: ' + bookmarkItem.length}
              />
            </List.Item>
          );
        }}
      />
    </Modal>
  );
}
